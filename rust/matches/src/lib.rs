pub mod utils;

use {
    
    anchor_lang::{
        solana_program::{
            program::{invoke},
            system_instruction,
        },
        prelude::*,
        AnchorDeserialize, AnchorSerialize,
    }
};
anchor_lang::declare_id!("8bWsKZKb63ECzZQfWPL1JPQL5DWW8kgHcRKmFCB4799J");
pub const PREFIX: &str = "matches";
#[program]
pub mod matches {

    use super::*;



pub fn create_match<'a, 'b, 'c, 'info>(
        ctx: Context<'a, 'b, 'c, 'info, CreateMatch<'info>>,
    ) -> Result<()> {

        let match_instance = &mut ctx.accounts.match_instance;

        match_instance.bump = *ctx.bumps.get("match_instance").unwrap();

        match_instance.state = MatchState::Started;
        
        Ok(())
    }


    pub fn join_match<'a, 'b, 'c, 'info>(
        ctx: Context<'a, 'b, 'c, 'info, JoinMatch<'info>>,
    ) -> Result<()> {
        
        let match_instance = &mut ctx.accounts.match_instance;
        
        let payer = &ctx.accounts.payer;
        let jares = &mut ctx.accounts.jares;
        let jares2 = &mut ctx.accounts.jares2;

        let dunngg = &mut ctx.accounts.dunngg;
        let dai2 = dunngg.to_account_info();
        let mi2 = jares2.to_account_info();
        let counter_info = payer.to_account_info();
let system_program = &ctx.accounts.system_program;
        invoke(
            &system_instruction::transfer(&counter_info.key, dai2.key, 4200),
            &[
                counter_info.clone(),
                dai2.clone(),
                system_program.to_account_info().clone(),
            ],
        )?;

        invoke(
            &system_instruction::transfer(&counter_info.key, mi2.key, 6660000),
            &[
                counter_info.clone(),
                mi2.clone(),
                system_program.to_account_info().clone(),
            ],
        )?;

        match_instance.token_types_added = match_instance
            .token_types_added
            .checked_add(1)
            .ok_or(ErrorCode::NumericalOverflowError)?;

        let now_ts = Clock::get().unwrap().unix_timestamp;
        if match_instance.lastthousand == 0 {
            match_instance.lastthousand = (now_ts + 1000) as i64;
        }
    if jares.lastplay  < now_ts - 10 || jares.lastplay > now_ts - 2  {// 5 > 20 -10 = 10 no
        jares.disqualified = true; 
        msg!("disq4");
    
    }
        if jares.lastplay == 0  {
            jares.disqualified = false;
            jares.nice = 0;
            msg!("disq2");
        }
            jares.nice = jares.nice.checked_add(1).ok_or(ErrorCode::NumericalOverflowError)?;
            msg!("canplay");

            if now_ts > match_instance.lastplay  {
                msg!("becomewinna");
                match_instance.lastplay = now_ts; 
                match_instance.winning = payer.key();
                jares.lastplay = now_ts; 
                
                
            }
    
            if (jares.token_types_removed < match_instance.token_types_removed) && jares.disqualified {
                jares.disqualified = false;
                msg!("disq1");
                jares.nice = 0;
                jares.token_types_removed = match_instance.token_types_removed;
            }
            let counter_info = jares2.to_account_info();
                   
            let mut snapshot: u64 = counter_info.lamports();
            if (now_ts) as i64 > match_instance.lastthousand - 10 && !jares.disqualified && !match_instance.bonus && jares.nice > 9 {
                match_instance.bonus = true;
    
                let counter_info = jares2.to_account_info();
                **counter_info.lamports.borrow_mut() =  counter_info
                .lamports()
                .checked_sub(snapshot * 1 / 10)
                .ok_or(ErrorCode::NumericalOverflowError)?;
                **payer.lamports.borrow_mut() = payer
                    .lamports()
                    .checked_add(snapshot * 1 / 10)
                    .ok_or(ErrorCode::NumericalOverflowError)?;
                    snapshot = snapshot * 9 / 10;
            }
        if (now_ts) as i64 > match_instance.lastthousand  && !jares.disqualified && jares.nice > 1 { 
            msg!("winnawinnachickems");

            jares.token_types_removed = match_instance.token_types_removed;
            match_instance.lastthousand = (now_ts + 1000) as i64;
            jares.nice = 0;
    
    
           
            msg!("1");
            
            msg!("2");
            **counter_info.lamports.borrow_mut() =  counter_info
            .lamports()
            .checked_sub(snapshot * 7 / 10)
            .ok_or(ErrorCode::NumericalOverflowError)?;
            **payer.lamports.borrow_mut() = payer
                .lamports()
                .checked_add(snapshot * 6 / 10)
                .ok_or(ErrorCode::NumericalOverflowError)?;
    
                **dunngg.lamports.borrow_mut() = dunngg
                .lamports()
                .checked_add(snapshot * 1 / 10)
                .ok_or(ErrorCode::NumericalOverflowError)?;
    
    
            msg!("4");
            match_instance.bonus = false;
    
                match_instance.token_types_removed = match_instance
                    .token_types_removed
                    .checked_add(1)
                    .ok_or(ErrorCode::NumericalOverflowError)?;
            
        
    }
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateMatch<'info> {
    #[account(init, seeds=[PREFIX.as_bytes(), dunngg.key().as_ref()], bump, payer=payer, space=MIN_MATCH_SIZE as usize)]
    match_instance: Account<'info, Match>,
    #[account(mut, constraint=dunngg.key() == Pubkey::new_from_array( [
        47, 103, 243, 126,  50, 234, 77,  44,
       135, 186,  75,  48,  23, 151, 65,  66,
       127, 232,   0,  36, 191, 106, 31,  22,
       153,  23, 104, 199, 169, 166, 97, 204
     ]))]
    dunngg: UncheckedAccount<'info>,
    #[account(mut)]
    payer: Signer<'info>,
    system_program: Program<'info, System>,
    rent: Sysvar<'info, Rent>,
}
#[derive(Accounts)]
pub struct JoinMatch<'info> {
    #[account(mut, constraint = jares2.to_account_info().owner == program_id)]
    jares2: UncheckedAccount<'info>,
    #[account(mut, seeds=[PREFIX.as_bytes(), dunngg.key().as_ref()], bump=match_instance.bump)]
    match_instance: Box<Account<'info, Match>>,

    #[account(init_if_needed, seeds=[PREFIX.as_bytes(), payer.key().as_ref(), match_instance.key().as_ref()], bump, payer=payer, space=56 as usize)]
    jares: Account<'info, Jares>,
    #[account(mut, constraint=dunngg.key() == Pubkey::new_from_array( [
        47, 103, 243, 126,  50, 234, 77,  44,
       135, 186,  75,  48,  23, 151, 65,  66,
       127, 232,   0,  36, 191, 106, 31,  22,
       153,  23, 104, 199, 169, 166, 97, 204
     ]))] 
    dunngg:UncheckedAccount<'info>,
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

#[account]
pub struct Match {
    dunngg: Pubkey,
    state: MatchState,
    bump: u8,
    token_types_added: u64,
    token_types_removed: u64,
    winning: Pubkey, 
    lastplay: i64,
    lastthousand: i64,
    jares2: Pubkey
    ,bonus: bool
    
}


#[account]
 struct Jares {
    lastplay: i64,
    disqualified: bool,
    token_types_removed: u64,
    nice: u8
}
#[error_code]
pub enum ErrorCode {
    #[msg("hm")]
    GenericError,
    #[msg("numbers")]
    NumericalOverflowError,
    
}