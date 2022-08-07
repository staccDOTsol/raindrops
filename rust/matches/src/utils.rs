use {
    crate::{ErrorCode, Filter, TokenValidation, ValidationArgs},
    anchor_lang::{
        error,
        prelude::{
            msg, Account, AccountInfo, AccountMeta, Program, Pubkey, Rent, Result, SolanaSysvar,
            UncheckedAccount,
        },
        require,
        solana_program::{
            hash,
            instruction::Instruction,
            program::{invoke, invoke_signed},
            program_pack::{IsInitialized, Pack},
            system_instruction,
        },
        AnchorSerialize, Key, ToAccountInfo,
    },
    anchor_spl::token::{Mint, Token},
    arrayref::array_ref,
    spl_associated_token_account::get_associated_token_address,
    spl_token::instruction::close_account,
    std::convert::TryInto,
};

pub fn assert_is_ata(
    ata: &AccountInfo,
    wallet: &Pubkey,
    mint: &Pubkey,
    expected_delegate: Option<&Pubkey>,
) -> Result<spl_token::state::Account> {
    let ata_account: spl_token::state::Account = assert_initialized(ata)?;
    assert_keys_equal(ata_account.owner, *wallet)?;
    assert_keys_equal(ata_account.mint, mint.key())?;
    assert_keys_equal(get_associated_token_address(wallet, mint), *ata.key)?;
    if let Some(delegate) = expected_delegate {
        require!(
            ata_account.delegate.unwrap() == *delegate,
            AtaDelegateMismatch
        );
    } else {
        require!(ata_account.delegate.is_none(), AtaShouldNotHaveDelegate);
    }
    Ok(ata_account)
}

pub fn assert_keys_equal(key1: Pubkey, key2: Pubkey) -> Result<()> {
    if key1 != key2 {
        Err(error!(ErrorCode::PublicKeyMismatch))
    } else {
        Ok(())
    }
}
pub fn assert_initialized<T: Pack + IsInitialized>(account_info: &AccountInfo) -> Result<T> {
    let account: T = T::unpack_unchecked(&account_info.data.borrow())?;
    if !account.is_initialized() {
        Err(error!(ErrorCode::Uninitialized))
    } else {
        Ok(account)
    }
}

///TokenTransferParams
pub struct TokenTransferParams<'a: 'b, 'b> {
    /// source
    pub source: AccountInfo<'a>,
    /// destination
    pub destination: AccountInfo<'a>,
    /// amount
    pub amount: u64,
    /// authority
    pub authority: AccountInfo<'a>,
    /// authority_signer_seeds
    pub authority_signer_seeds: &'b [&'b [u8]],
    /// token_program
    pub token_program: AccountInfo<'a>,
}

#[inline(always)]
pub fn spl_token_transfer(params: TokenTransferParams<'_, '_>) -> Result<()> {
    let TokenTransferParams {
        source,
        destination,
        authority,
        token_program,
        amount,
        authority_signer_seeds,
    } = params;

    let val = &[authority_signer_seeds];

    let result = invoke_signed(
        &spl_token::instruction::transfer(
            token_program.key,
            source.key,
            destination.key,
            authority.key,
            &[],
            amount,
        )?,
        &[source, destination, authority, token_program],
        if authority_signer_seeds.len() == 0 {
            &[]
        } else {
            val
        },
    );

    result.map_err(|_| error!(ErrorCode::TokenTransferFailed))
}

/// Returns true if a `leaf` can be proved to be a part of a Merkle tree
/// defined by `root`. For this, a `proof` must be provided, containing
/// sibling hashes on the branch from the leaf to the root of the tree. Each
/// pair of leaves and each pair of pre-images are assumed to be sorted.
pub fn verify(proof: &Vec<[u8; 32]>, root: &[u8; 32], leaf: [u8; 32]) -> bool {
    let mut computed_hash = leaf;
    for proof_element in proof.into_iter() {
        if computed_hash <= *proof_element {
            // Hash(current computed hash + current element of the proof)
            computed_hash = anchor_lang::solana_program::keccak::hashv(&[
                &[0x01],
                &computed_hash,
                proof_element,
            ])
            .0;
        } else {
            // Hash(current element of the proof + current computed hash)
            computed_hash = anchor_lang::solana_program::keccak::hashv(&[
                &[0x01],
                proof_element,
                &computed_hash,
            ])
            .0;
        }
    }
    // Check if the computed hash (root) is equal to the provided root
    computed_hash == *root
}

pub fn is_part_of_namespace<'a>(artifact: &AccountInfo<'a>, namespace: &Pubkey) -> bool {
    let data = artifact.data.borrow_mut();
    let number = u32::from_le_bytes(*array_ref![data, 8, 4]) as usize;
    let offset = 12 as usize;
    for i in 0..number {
        let key_bytes = array_ref![data, offset + i * 33, 32];
        let key = Pubkey::new_from_array(*key_bytes);
        if key == *namespace {
            return true;
        }
    }

    return false;
}

pub fn sighash(namespace: &str, name: &str) -> [u8; 8] {
    let preimage = format!("{}:{}", namespace, name);

    let mut sighash = [0u8; 8];
    sighash.copy_from_slice(&hash::hash(preimage.as_bytes()).to_bytes()[..8]);
    sighash
}

pub fn grab_parent<'a>(artifact: &AccountInfo<'a>) -> Result<Pubkey> {
    let data = artifact.data.borrow();

    let number = if data[8] == 1 {
        u32::from_le_bytes(*array_ref![data, 9, 4]) as usize
    } else {
        0
    };
    let offset = 8 as usize + number * 34 + if data[8] == 1 { 4 } else { 0 } + 1;

    if data[offset] == 1 {
        let key_bytes = array_ref![data, offset + 1, 32];
        let key = Pubkey::new_from_array(*key_bytes);
        return Ok(key);
    } else {
        return Err(error!(ErrorCode::NoParentPresent));
    }
}

pub fn is_valid_validation<'info>(
    val: &TokenValidation,
    source_item_or_player_pda: &UncheckedAccount<'info>,
    token_mint: &Account<'info, Mint>,
    validation_program: &UncheckedAccount<'info>,
) -> Result<bool> {
    match val.filter {
        Filter::None => {
            return Err(error!(ErrorCode::NoTokensAllowed));
        }
        Filter::All => {
            if val.is_blacklist {
                return Err(error!(ErrorCode::Blacklisted));
            } else {
                return Ok(true);
            }
        }
        Filter::Namespace { namespace } => {
            if !is_part_of_namespace(source_item_or_player_pda, &namespace) {
                return Ok(false);
            }
        }
        Filter::Parent { key } => {
            let parent = grab_parent(source_item_or_player_pda)?;
            if key != parent {
                return Ok(false);
            }
        }
        Filter::Mint { mint } => {
            if token_mint.key() != mint {
                return Ok(false);
            }
        }
    }

    if val.is_blacklist {
        return Err(error!(ErrorCode::Blacklisted));
    }

    if let Some(validation) = &val.validation {
        let accounts = vec![
            source_item_or_player_pda.to_account_info(),
            token_mint.to_account_info(),
            validation_program.to_account_info(),
        ];

        assert_keys_equal(validation_program.key(), validation.key)?;

        let keys = vec![
            AccountMeta::new_readonly(source_item_or_player_pda.key(), false),
            AccountMeta::new_readonly(token_mint.key(), false),
        ];

        invoke(
            &Instruction {
                program_id: validation.key,
                accounts: keys,
                data: AnchorSerialize::try_to_vec(&ValidationArgs {
                    instruction: sighash("global", "match_validation"),
                    extra_identifier: validation.code,
                    token_validation: val.clone(),
                })?,
            },
            &accounts,
        )?;
    }

    return Ok(true);
}
