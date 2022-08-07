import { BN, web3 } from "@project-serum/anchor";
import { Program, Instruction as SolKitInstruction } from "@raindrop-studios/sol-kit";
import { AnchorPermissivenessType } from "../state/common";
export interface BeginArtifactStakeWarmupArgs {
    classIndex: BN;
    parentClassIndex: BN | null;
    index: BN;
    stakingIndex: BN;
    artifactClassMint: web3.PublicKey;
    artifactMint: web3.PublicKey;
    stakingAmount: BN;
    stakingPermissivenessToUse: AnchorPermissivenessType | null;
}
export interface BeginArtifactStakeWarmupAccounts {
    artifactClass: web3.PublicKey;
    artifact: web3.PublicKey;
    stakingAccount: web3.PublicKey;
    stakingMint: web3.PublicKey;
    stakingTransferAuthority: web3.Keypair;
    parentClassMint: web3.PublicKey | null;
    parentClass: web3.PublicKey | null;
    metadataUpdateAuthority: web3.PublicKey | null;
    namespace: web3.PublicKey;
}
export interface EndArtifactStakeWarmupArgs {
    classIndex: BN;
    index: BN;
    stakingIndex: BN;
    artifactClassMint: web3.PublicKey;
    artifactMint: web3.PublicKey;
}
export interface EndArtifactStakeWarmupAccounts {
    artifactClass: web3.PublicKey;
    artifact: web3.PublicKey;
    stakingMint: web3.PublicKey;
}
export interface BeginArtifactStakeCooldownArgs {
    classIndex: BN;
    parentClassIndex: BN | null;
    index: BN;
    stakingIndex: BN;
    artifactClassMint: web3.PublicKey;
    artifactMint: web3.PublicKey;
    stakingPermissivenessToUse: AnchorPermissivenessType | null;
}
export interface BeginArtifactStakeCooldownAccounts {
    artifactClass: web3.PublicKey;
    artifact: web3.PublicKey;
    stakingAccount: web3.PublicKey;
    stakingMint: web3.PublicKey;
    parentClassAccount: web3.PublicKey | null;
    parentClassMint: web3.PublicKey | null;
    parentClass: web3.PublicKey | null;
    metadataUpdateAuthority: web3.PublicKey | null;
}
export interface EndArtifactStakeCooldownArgs {
    classIndex: BN;
    index: BN;
    stakingIndex: BN;
    artifactClassMint: web3.PublicKey;
    artifactMint: web3.PublicKey;
}
export interface EndArtifactStakeCooldownAccounts {
    artifactClass: web3.PublicKey;
    artifact: web3.PublicKey;
    stakingAccount: web3.PublicKey;
    stakingMint: web3.PublicKey;
}
export declare class Instruction extends SolKitInstruction {
    constructor(args: {
        program: Program.Program;
    });
    beginArtifactStakeWarmup(args: BeginArtifactStakeWarmupArgs, accounts: BeginArtifactStakeWarmupAccounts): Promise<any[]>;
    endArtifactStakeWarmup(args: EndArtifactStakeWarmupArgs, accounts: EndArtifactStakeWarmupAccounts): Promise<web3.TransactionInstruction[]>;
    beginArtifactStakeCooldown(args: BeginArtifactStakeCooldownArgs, accounts: BeginArtifactStakeCooldownAccounts): Promise<web3.TransactionInstruction[]>;
    endArtifactStakeCooldown(args: EndArtifactStakeCooldownArgs, accounts: EndArtifactStakeCooldownAccounts): Promise<web3.TransactionInstruction[]>;
}
