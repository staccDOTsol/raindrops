/// <reference types="@solana/web3.js" />
import { Program, SendOptions, Transaction } from "@raindrop-studios/sol-kit";
import * as StakingInstruction from "../instructions/staking";
export declare class StakingProgram extends Program.Program {
    instruction: StakingInstruction.Instruction;
    static PREFIX: string;
    PROGRAM_ID: import("@solana/web3.js").PublicKey;
    constructor();
    beginArtifactStakeWarmup(args: StakingInstruction.BeginArtifactStakeWarmupArgs, accounts: StakingInstruction.BeginArtifactStakeWarmupAccounts, options?: SendOptions): Promise<Transaction.SendTransactionResult>;
    endArtifactStakeWarmup(args: StakingInstruction.EndArtifactStakeWarmupArgs, accounts: StakingInstruction.EndArtifactStakeWarmupAccounts, options?: SendOptions): Promise<Transaction.SendTransactionResult>;
    beginArtifactStakeCooldown(args: StakingInstruction.BeginArtifactStakeCooldownArgs, accounts: StakingInstruction.BeginArtifactStakeCooldownAccounts, options?: SendOptions): Promise<Transaction.SendTransactionResult>;
    endArtifactStakeCooldown(args: StakingInstruction.EndArtifactStakeCooldownArgs, accounts: StakingInstruction.EndArtifactStakeCooldownAccounts, options?: SendOptions): Promise<Transaction.SendTransactionResult>;
}
//# sourceMappingURL=staking.d.ts.map