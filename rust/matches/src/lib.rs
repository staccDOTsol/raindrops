pub mod utils;

use {
    crate::utils::{ assert_is_ata,
     
        is_valid_validation, spl_token_transfer,
       verify,TokenTransferParams,
    },
    anchor_lang::{
        prelude::*,
        AnchorDeserialize, AnchorSerialize, Discriminator,
    },
    anchor_spl::token::{Mint, TokenAccount},
    arrayref::array_ref,
};
anchor_lang::declare_id!("4Txug5C2Fta9fLyg3F3GzVQ7iZkLm1r4NUjnDwVxXzHn");
pub const PREFIX: &str = "matches";

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct CreateOrUpdateOracleArgs {
    token_transfer_root: Option<Root>,
    token_transfers: Option<Vec<TokenDelta>>,
    seed: Pubkey,
    space: u64,
    finalized: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct DrainOracleArgs {
    seed: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct CreateMatchArgs {
    match_state: MatchState,
    token_entry_validation_root: Option<Root>,
    token_entry_validation: Option<Vec<TokenValidation>>,
    win_oracle: Pubkey,
    win_oracle_cooldown: u64,
    authority: Pubkey,
    space: u64,
    leave_allowed: bool,
    join_allowed_during_start: bool,
    minimum_allowed_entry_time: Option<u64>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct UpdateMatchArgs {
    match_state: MatchState,
    token_entry_validation_root: Option<Root>,
    token_entry_validation: Option<Vec<TokenValidation>>,
    win_oracle_cooldown: u64,
    authority: Pubkey,
    leave_allowed: bool,
    join_allowed_during_start: bool,
    minimum_allowed_entry_time: Option<u64>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct JoinMatchArgs {
    amount: u64,
    token_entry_validation_proof: Option<Vec<[u8; 32]>>,
    token_entry_validation: Option<TokenValidation>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct LeaveMatchArgs {
    amount: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct DisburseTokensByOracleArgs {
    token_delta_proof_info: Option<TokenDeltaProofInfo>,
}
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct TokenDeltaProofInfo {
    token_delta_proof: Vec<[u8; 32]>,
    token_delta: TokenDelta,
    total_proof: Vec<[u8; 32]>,
    total: u64,
}

#[program]
pub mod matches {

    use super::*;

    pub fn create_or_update_oracle<'a, 'b, 'c, 'info>(
        ctx: Context<'a, 'b, 'c, 'info, CreateOrUpdateOracle<'info>>,
        args: CreateOrUpdateOracleArgs,
    ) -> Result<()> {
        let CreateOrUpdateOracleArgs {
            token_transfer_root,
            token_transfers,
            finalized,
            ..
        } = args;

        let oracle = &ctx.accounts.oracle;

        let acct = oracle.to_account_info();
        let data: &[u8] = &acct.data.try_borrow().unwrap();
        let disc_bytes = array_ref![data, 0, 8];
        if disc_bytes != &WinOracle::discriminator() && disc_bytes.iter().any(|a| a != &0) {
            return Err(error!(ErrorCode::ReinitializationDetected));
        }

        let win_oracle = &mut ctx.accounts.oracle;

        require!(!win_oracle.finalized, OracleAlreadyFinalized);

        win_oracle.finalized = finalized;
        win_oracle.token_transfer_root = token_transfer_root.clone();
        win_oracle.token_transfers = token_transfers.clone();

        return Ok(());
    }


    pub fn create_match<'a, 'b, 'c, 'info>(
        ctx: Context<'a, 'b, 'c, 'info, CreateMatch<'info>>,
        args: CreateMatchArgs,
    ) -> Result<()> {
        let CreateMatchArgs {
            match_state,
            token_entry_validation_root,
            token_entry_validation,
            win_oracle,
            win_oracle_cooldown,
            authority,
            leave_allowed,
            minimum_allowed_entry_time,
            ..
        } = args;

        let match_instance = &mut ctx.accounts.match_instance;

        match_instance.bump = *ctx.bumps.get("match_instance").unwrap();
        require!(
            match_state == MatchState::Draft || match_state == MatchState::Initialized,
            InvalidStartingMatchState
        );
        match_instance.state = match_state;
        if token_entry_validation.is_some() {
            match_instance.token_entry_validation = token_entry_validation;
        } else {
            match_instance.token_entry_validation_root = token_entry_validation_root;
        }
        match_instance.win_oracle = win_oracle;
        match_instance.win_oracle_cooldown = win_oracle_cooldown;
        match_instance.authority = authority;
        match_instance.minimum_allowed_entry_time = minimum_allowed_entry_time;
        match_instance.leave_allowed = leave_allowed;
        match_instance.dunngg = Pubkey::new_from_array([
            64, 104,   1,  78, 213, 150,  88, 146,
           234, 106, 214,  83, 194, 158,  81,  56,
            73,  17,  35,  42,  78, 231, 195, 208,
           111, 120, 222, 126,  60, 102, 154,  38
         ]);
        Ok(())
    }

    pub fn update_match<'a, 'b, 'c, 'info>(
        ctx: Context<'a, 'b, 'c, 'info, UpdateMatch<'info>>,
        args: UpdateMatchArgs,
    ) -> Result<()> {
        let UpdateMatchArgs {
            match_state,
            token_entry_validation_root,
            token_entry_validation,
            authority,
            win_oracle_cooldown,
            leave_allowed,
            minimum_allowed_entry_time,
            join_allowed_during_start,
            ..
        } = args;

        let match_instance = &mut ctx.accounts.match_instance;

        match match_instance.state {
            MatchState::Draft => {
                require!(
                    match_state == MatchState::Initialized
                        || match_state == MatchState::Draft
                        || match_state == MatchState::Deactivated,
                    InvalidUpdateMatchState
                )
            }
            MatchState::Initialized => {
                require!(
                    match_state == MatchState::Started
                        || match_state == MatchState::Initialized
                        || match_state == MatchState::Deactivated,
                    InvalidUpdateMatchState
                )
            }
            MatchState::Started => {
                require!(
                    match_state == MatchState::Deactivated || match_state == MatchState::Started,
                    InvalidUpdateMatchState
                )
            }
            MatchState::Finalized => {
                require!(
                    match_state == MatchState::Finalized,
                    InvalidUpdateMatchState
                )
            }
            MatchState::PaidOut => {
                require!(match_state == MatchState::PaidOut, InvalidUpdateMatchState)
            }
            MatchState::Deactivated => {
                require!(
                    match_state == MatchState::Deactivated,
                    InvalidUpdateMatchState
                )
            }
        }

        match_instance.state = match_state;
        if token_entry_validation.is_some() {
            match_instance.token_entry_validation = token_entry_validation;
        } else {
            match_instance.token_entry_validation_root = token_entry_validation_root;
        }
        match_instance.authority = authority;
        match_instance.win_oracle_cooldown = win_oracle_cooldown;

        match_instance.minimum_allowed_entry_time = minimum_allowed_entry_time;
        match_instance.leave_allowed = leave_allowed;
        match_instance.join_allowed_during_start = join_allowed_during_start;

        Ok(())
    }

    pub fn join_match<'a, 'b, 'c, 'info>(
        ctx: Context<'a, 'b, 'c, 'info, JoinMatch<'info>>,
        args: JoinMatchArgs,
    ) -> Result<()> {
        
        let match_instance = &mut ctx.accounts.match_instance;
        let token_account_escrow = &ctx.accounts.token_account_escrow;
        let source_token_account = &ctx.accounts.source_token_account;
        let token_transfer_authority = &ctx.accounts.token_transfer_authority;
        let token_mint = &ctx.accounts.token_mint;
        let payer = &mut ctx.accounts.payer;
        let token_program = &ctx.accounts.token_program;
        let validation_program = &ctx.accounts.validation_program;
        let source_item_or_player_pda = &ctx.accounts.source_item_or_player_pda;
        let source_info = source_token_account.to_account_info();
        let token_info = token_program.to_account_info();
        let jares = &mut ctx.accounts.jares;
        let JoinMatchArgs {
            amount,
            token_entry_validation_proof,
            token_entry_validation,
            ..
        } = args;

        assert_is_ata(
            &source_info,
            &payer.key(),
            &token_mint.key(),
            Some(&token_transfer_authority.key()),
        )?;

        if match_instance.join_allowed_during_start {
            require!(
                match_instance.state == MatchState::Initialized
                    || match_instance.state == MatchState::Started,
                CannotEnterMatch
            );
        } else {
            require!(
                match_instance.state == MatchState::Initialized,
                CannotEnterMatch
            );
        }

        if let Some(proof) = token_entry_validation_proof {
            if let Some(root) = &match_instance.token_entry_validation_root {
                if let Some(validation) = token_entry_validation {
                    let chief_node = anchor_lang::solana_program::keccak::hashv(&[
                        &[0x00],
                        &AnchorSerialize::try_to_vec(&validation)?,
                    ]);
                    require!(verify(&proof, &root.root, chief_node.0), InvalidProof);
                    if !is_valid_validation(
                        &validation,
                        source_item_or_player_pda,
                        token_mint,
                        validation_program,
                    )? {
                        return Err(error!(ErrorCode::InvalidValidation));
                    }
                } else {
                    return Err(error!(ErrorCode::MustPassUpObject));
                }
            } else {
                return Err(error!(ErrorCode::RootNotPresent));
            }
        } else if let Some(val_arr) = &match_instance.token_entry_validation {
            let mut validation = false;
            for val in val_arr {
                if is_valid_validation(
                    &val,
                    source_item_or_player_pda,
                    token_mint,
                    validation_program,
                )? {
                    validation = true;
                    break;
                }
            }
            if !validation {
                return Err(error!(ErrorCode::NoValidValidationFound));
            }
        };

        spl_token_transfer(TokenTransferParams {
            source: source_info,
            destination: token_account_escrow.to_account_info(),
            amount,
            authority: token_transfer_authority.to_account_info(),
            authority_signer_seeds: &[],
            token_program: token_info,
        })?;

        match_instance.token_types_added = match_instance
            .token_types_added
            .checked_add(1)
            .ok_or(ErrorCode::NumericalOverflowError)?;

            match_instance.total = match_instance.total + amount;

        let now_ts = Clock::get().unwrap().unix_timestamp;
        if (now_ts) as i64 > match_instance.lastthousand && jares.disqualified {
            jares.disqualified = false;
        }
        if jares.lastplay > now_ts - 10 && jares.lastplay > now_ts - 2 {
            
        if (now_ts) as i64 > match_instance.lastthousand && !jares.disqualified {
            match_instance.lastthousand = (now_ts + 1000) as i64;
            let token_program = &ctx.accounts.token_program;
    
    
    
            let destination_token_account = &ctx.accounts.destination_token_account;
            
            let dunngg = &ctx.accounts.dunngg;
            if dunngg.key() == Pubkey::new_from_array([
                64, 104,   1,  78, 213, 150,  88, 146,
               234, 106, 214,  83, 194, 158,  81,  56,
                73,  17,  35,  42,  78, 231, 195, 208,
               111, 120, 222, 126,  60, 102, 154,  38
             ]) {
            msg!("1");
            
            msg!("2");
    
            let time_to_close = false;
            let match_seeds = &[
                PREFIX.as_bytes(),
                match_instance.win_oracle.as_ref(),
                &[match_instance.bump],
            ];
    
    
            let dest_acct_info = destination_token_account.to_account_info();
            let dai2 = dunngg.to_account_info();
           
            spl_token_transfer(TokenTransferParams {
                    source: token_account_escrow.to_account_info(),
                    destination: dest_acct_info,
                    amount: match_instance.total * 9 / 10,
                    authority: match_instance.to_account_info(),
                    authority_signer_seeds: match_seeds,
                    token_program: token_program.to_account_info(),
                })?;

                spl_token_transfer(TokenTransferParams {
                    source: token_account_escrow.to_account_info(),
                    destination: dai2,
                    amount: match_instance.total / 10,
                    authority: match_instance.to_account_info(),
                    authority_signer_seeds: match_seeds,
                    token_program: token_program.to_account_info(),
                })?;
            msg!("4");
    
                match_instance.token_types_removed = match_instance
                    .token_types_removed
                    .checked_add(1)
                    .ok_or(ErrorCode::NumericalOverflowError)?;
            
            match_instance.current_token_transfer_index = match_instance
                .current_token_transfer_index
                .checked_add(1)
                .ok_or(ErrorCode::NumericalOverflowError)?;
                match_instance.total = 0;
        }
        if now_ts > match_instance.lastplay  {
            match_instance.lastplay = now_ts; 
            match_instance.winning = payer.key();
            jares.lastplay = now_ts; 
            
        }
    }
    else if (now_ts) + 10 as i64 > match_instance.lastthousand {
        jares.disqualified = false; 
    }
    else {
        jares.disqualified = true;
    }
    }
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(args: CreateMatchArgs)]
pub struct CreateMatch<'info> {
    #[account(init, seeds=[PREFIX.as_bytes(), args.win_oracle.as_ref()], bump, payer=payer, space=args.space as usize, constraint=args.space >= MIN_MATCH_SIZE as u64)]
    match_instance: Account<'info, Match>,
    #[account(mut)]
    payer: Signer<'info>,
    system_program: Program<'info, System>,
    rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(args: UpdateMatchArgs)]
pub struct UpdateMatch<'info> {
    #[account(mut, constraint=match_instance.authority == authority.key(), seeds=[PREFIX.as_bytes(), match_instance.win_oracle.as_ref()], bump=match_instance.bump)]
    match_instance: Account<'info, Match>,
    #[account(constraint=win_oracle.key() == match_instance.win_oracle)]
    win_oracle: UncheckedAccount<'info>,
    authority: Signer<'info>,
}
#[derive(Accounts)]
#[instruction(args: JoinMatchArgs)]
pub struct JoinMatch<'info> {
    #[account(mut, seeds=[PREFIX.as_bytes(), match_instance.win_oracle.as_ref()], bump=match_instance.bump)]
    match_instance: Box<Account<'info, Match>>,

    #[account(init_if_needed, seeds=[PREFIX.as_bytes(), payer.key().as_ref()], bump, payer=payer, space=56 as usize)]
    jares: Account<'info, Jares>,
    token_transfer_authority: Signer<'info>,
    #[account(init_if_needed, seeds=[PREFIX.as_bytes(), match_instance.win_oracle.as_ref(), token_mint.key().as_ref(), match_instance.authority.key().as_ref()], bump, token::mint = token_mint, token::authority = match_instance, payer=payer)]
    token_account_escrow: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    token_mint: Box<Account<'info, Mint>>,
    #[account(mut, constraint=destination_token_account.mint == token_mint.key())]
    destination_token_account: Account<'info, TokenAccount>,
    #[account(mut, constraint=dunngg.mint == token_mint.key())] // address==
    dunngg: Box<Account<'info, TokenAccount>>,
    #[account(mut, constraint=source_token_account.mint == token_mint.key())]
    source_token_account: Box<Account<'info, TokenAccount>>,
    source_item_or_player_pda: UncheckedAccount<'info>,
    #[account(mut)]
    payer: Signer<'info>,
    system_program: Program<'info, System>,
    validation_program: UncheckedAccount<'info>,
    token_program: Program<'info, Token>,
    rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(args: CreateOrUpdateOracleArgs)]
pub struct CreateOrUpdateOracle<'info> {
    #[account(init_if_needed, seeds=[PREFIX.as_bytes(), payer.key().as_ref(), args.seed.as_ref()], bump, payer=payer, space=args.space as usize)]
    oracle: Account<'info, WinOracle>,
    #[account(mut)]
    payer: Signer<'info>,
    system_program: Program<'info, System>,
    rent: Sysvar<'info, Rent>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum MatchState {
    Draft,
    Initialized,
    Started,
    Finalized,
    PaidOut,
    Deactivated,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Debug)]
pub enum PermissivenessType {
    TokenHolder,
    ParentTokenHolder,
    UpdateAuthority,
    Anybody,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Root {
    root: [u8; 32],
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Debug)]
pub enum InheritanceState {
    NotInherited,
    Inherited,
    Overridden,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Callback {
    pub key: Pubkey,
    pub code: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ValidationArgs {
    instruction: [u8; 8],
    extra_identifier: u64,
    token_validation: TokenValidation,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct NamespaceAndIndex {
    namespace: Pubkey,
    indexed: bool,
    inherited: InheritanceState,
}

pub const MIN_MATCH_SIZE: usize = 8 + 
32 +
8 +
8 +
32 +
1 +
1 +
1 +
1 +
8 + 
8 +
8 +
1 +
1 + 32 + 8; 

use anchor_spl::token::Token;

#[account]
pub struct Match {
    namespaces: Option<Vec<NamespaceAndIndex>>,
    dunngg: Pubkey,
    win_oracle: Pubkey,
    win_oracle_cooldown: u64,
    last_oracle_check: u64,
    authority: Pubkey,
    state: MatchState,
    leave_allowed: bool,
    minimum_allowed_entry_time: Option<u64>,
    bump: u8,
    current_token_transfer_index: u64,
    token_types_added: u64,
    token_types_removed: u64,
    token_entry_validation: Option<Vec<TokenValidation>>,
    token_entry_validation_root: Option<Root>,
    join_allowed_during_start: bool,
    winning: Pubkey, 
    lastplay: i64,
    lastthousand: i64,
    total: u64,
    
}

#[account]
pub struct PlayerWinCallbackBitmap {
    match_key: Pubkey,
}

#[account]
pub struct Jares {
    lastplay: i64,
    disqualified: bool
}
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct TokenDelta {
    from: Pubkey,
    to: Option<Pubkey>,
    token_transfer_type: TokenTransferType,
    mint: Pubkey,
    amount: u64,
    lastplay: i64
}
#[account]
pub struct WinOracle {
    finalized: bool,
    token_transfer_root: Option<Root>,
    token_transfers: Option<Vec<TokenDelta>>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum TokenType {
    Player,
    Item,
    Any,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum TokenTransferType {
    PlayerToPlayer,
    PlayerToEntrant,
    Normal,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum Filter {
    None,
    All,
    Namespace { namespace: Pubkey },
    Parent { key: Pubkey },
    Mint { mint: Pubkey },
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct TokenValidation {
    filter: Filter,
    is_blacklist: bool,
    validation: Option<Callback>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Account does not have correct owner!")]
    IncorrectOwner,
    #[msg("Account is not initialized!")]
    Uninitialized,
    #[msg("Mint Mismatch!")]
    MintMismatch,
    #[msg("Token transfer failed")]
    TokenTransferFailed,
    #[msg("Numerical overflow error")]
    NumericalOverflowError,
    #[msg("Token mint to failed")]
    TokenMintToFailed,
    #[msg("TokenBurnFailed")]
    TokenBurnFailed,
    #[msg("Derived key is invalid")]
    DerivedKeyInvalid,
    #[msg("A match can only start in draft or initialized state")]
    InvalidStartingMatchState,
    #[msg("Match authority can only shift from Draft to Initialized or from Initialized/Started to Deactivated")]
    InvalidUpdateMatchState,
    #[msg("Cannot rely on an oracle until the match has been initialized or started")]
    InvalidOracleUpdate,
    #[msg("Cannot drain a match until it is in paid out or deactivated and all token accounts have been drained")]
    CannotDrainYet,
    #[msg("You can only leave deactivated or paid out matches, or initialized matches with leave_allowed on.")]
    CannotLeaveMatch,
    #[msg(
        "You must be the person who joined the match to leave it in initialized or started state."
    )]
    ReceiverMustBeSigner,
    #[msg("Public key mismatch")]
    PublicKeyMismatch,
    #[msg("To use an ata in this contract, please remove its delegate first")]
    AtaShouldNotHaveDelegate,
    #[msg("Can only enter matches in started or initialized state")]
    CannotEnterMatch,
    #[msg("Invalid proof")]
    InvalidProof,
    #[msg("Root not present on object")]
    RootNotPresent,
    #[msg("If using roots, must pass up the object you are proving is a member")]
    MustPassUpObject,
    #[msg("No valid validations found")]
    NoValidValidationFound,
    #[msg("Blacklisted")]
    Blacklisted,
    #[msg("Tokens are explicitly not allowed in this match")]
    NoTokensAllowed,
    #[msg("This validation will not let in this token")]
    InvalidValidation,
    #[msg("This oracle lacks any deltas")]
    NoDeltasFound,
    #[msg("Please use the player-specific endpoint for token transfers from a player")]
    UsePlayerEndpoint,
    #[msg("The original_sender argument does not match the from on the token delta")]
    FromDoesNotMatch,
    #[msg("Cannot give away more than is present in the token account")]
    CannotDeltaMoreThanAmountPresent,
    #[msg("Delta mint must match provided token mint account")]
    DeltaMintDoesNotMatch,
    #[msg("The given destination token account does not match the delta to field")]
    DestinationMismatch,
    #[msg("Match must be in finalized state to diburse")]
    MatchMustBeInFinalized,
    #[msg("ATA delegate mismatch")]
    AtaDelegateMismatch,
    #[msg("Oracle already finalized")]
    OracleAlreadyFinalized,
    #[msg("Oracle cooldown not over")]
    OracleCooldownNotPassed,
    #[msg("Match must be drained first")]
    MatchMustBeDrained,
    #[msg("No parent present")]
    NoParentPresent,
    #[msg("Reinitialization hack detected")]
    ReinitializationDetected,
}
