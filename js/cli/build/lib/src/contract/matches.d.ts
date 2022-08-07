/// <reference types="node" />
import { web3, Program, BN } from "@project-serum/anchor";
import { Keypair } from "@solana/web3.js";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { ObjectWrapper } from "./common";
import { AnchorMatchState, AnchorTokenDelta, AnchorTokenEntryValidation, TokenType } from "../state/matches";
export declare function transformTokenValidations(args: {
    tokenEntryValidation: AnchorTokenEntryValidation[] | null;
}): void;
export declare class MatchWrapper implements ObjectWrapper<any, MatchesProgram> {
    program: MatchesProgram;
    key: web3.PublicKey;
    object: any;
    data: Buffer;
    constructor(args: {
        program: MatchesProgram;
        key: web3.PublicKey;
        object: any;
        data: Buffer;
    });
}
export interface CreateMatchArgs {
    matchState: AnchorMatchState;
    tokenEntryValidationRoot: null;
    tokenEntryValidation: null | AnchorTokenEntryValidation[];
    winOracle: web3.PublicKey;
    winOracleCooldown: BN;
    authority: web3.PublicKey;
    space: BN;
    leaveAllowed: boolean;
    joinAllowedDuringStart: boolean;
    minimumAllowedEntryTime: BN | null;
}
export interface UpdateMatchArgs {
    matchState: AnchorMatchState;
    tokenEntryValidationRoot: null;
    tokenEntryValidation: null;
    winOracleCooldown: BN;
    authority: web3.PublicKey;
    leaveAllowed: boolean;
    joinAllowedDuringStart: boolean;
    minimumAllowedEntryTime: BN | null;
}
export interface JoinMatchArgs {
    amount: BN;
    tokenEntryValidationProof: null;
    tokenEntryValidation: null;
}
export interface LeaveMatchArgs {
    amount: BN;
}
export interface DisburseTokensByOracleArgs {
    tokenDeltaProofInfo: null;
}
export interface CreateMatchAdditionalArgs {
    seed: string;
    finalized: boolean;
    tokenTransferRoot: null;
    tokenTransfers: null | AnchorTokenDelta[];
}
export interface CreateOrUpdateOracleArgs {
    seed: string;
    authority: web3.PublicKey;
    space: BN;
    finalized: boolean;
    tokenTransferRoot: null;
    tokenTransfers: null | AnchorTokenDelta[];
}
export interface DrainMatchArgs {
}
export interface DrainOracleArgs {
    seed: string;
    authority: web3.PublicKey;
}
export interface UpdateMatchFromOracleAccounts {
    winOracle: web3.PublicKey;
}
export interface UpdateMatchAccounts {
    winOracle: web3.PublicKey;
}
export interface DrainMatchAccounts {
    receiver: web3.PublicKey | null;
}
export interface DrainOracleAccounts {
    receiver: web3.PublicKey | null;
}
export interface DisburseTokensByOracleAccounts {
    winOracle: web3.PublicKey;
}
export interface JoinMatchAccounts {
    tokenMint: web3.PublicKey;
    sourceTokenAccount: web3.PublicKey | null;
    tokenTransferAuthority: web3.Keypair | null;
    validationProgram: web3.PublicKey | null;
}
export interface LeaveMatchAccounts {
    tokenMint: web3.PublicKey;
    receiver: web3.PublicKey;
}
export interface JoinMatchAdditionalArgs {
    sourceType: TokenType;
    index: BN | null;
    winOracle: web3.PublicKey;
}
export interface LeaveMatchAdditionalArgs {
    winOracle: web3.PublicKey;
}
export interface DrainMatchAdditionalArgs {
    winOracle: web3.PublicKey;
}
export interface DisburseTokensByOracleAdditionalArgs {
    tokenDelta: AnchorTokenDelta;
}
export declare class MatchesInstruction {
    id: web3.PublicKey;
    program: Program;
    constructor(args: {
        id: web3.PublicKey;
        program: Program;
    });
    createMatch(kp: Keypair, args: CreateMatchArgs, _accounts?: {}, _additionalArgs?: {}): Promise<{
        instructions: web3.TransactionInstruction[];
        signers: any[];
    }>;
    disburseTokensByOracle(args: DisburseTokensByOracleArgs, accounts: DisburseTokensByOracleAccounts, additionalArgs: DisburseTokensByOracleAdditionalArgs): Promise<{
        instructions: any[];
        signers: any[];
    }>;
    drainMatch(_args: DrainMatchArgs, accounts: DrainMatchAccounts, additionalArgs: DrainMatchAdditionalArgs): Promise<{
        instructions: web3.TransactionInstruction[];
        signers: any[];
    }>;
    drainOracle(args: DrainOracleArgs, accounts: DrainOracleAccounts, _additionalArgs?: {}): Promise<{
        instructions: web3.TransactionInstruction[];
        signers: any[];
    }>;
    updateMatch(kp: Keypair, args: UpdateMatchArgs, accounts: UpdateMatchAccounts, _additionalArgs?: {}): Promise<{
        instructions: web3.TransactionInstruction[];
        signers: any[];
    }>;
    leaveMatch(args: LeaveMatchArgs, accounts: LeaveMatchAccounts, additionalArgs: LeaveMatchAdditionalArgs): Promise<{
        instructions: web3.TransactionInstruction[];
        signers: any[];
    }>;
    joinMatch(kp: any, args: JoinMatchArgs, accounts: JoinMatchAccounts, additionalArgs: JoinMatchAdditionalArgs): Promise<{
        instructions: web3.TransactionInstruction[];
        signers: web3.Keypair[];
    }>;
    updateMatchFromOracle(kp: Keypair, args: {}, accounts: UpdateMatchFromOracleAccounts, _additionalArgs?: {}): Promise<{
        instructions: web3.TransactionInstruction[];
        signers: any[];
    }>;
    join(args: CreateOrUpdateOracleArgs, _accounts?: {}, _additionalArgs?: {}): Promise<{
        instructions: web3.TransactionInstruction[];
        signers: any[];
    }>;
    createOrUpdateOracle(args: CreateOrUpdateOracleArgs, _accounts?: {}, _additionalArgs?: {}): Promise<{
        instructions: web3.TransactionInstruction[];
        signers: any[];
    }>;
}
export declare class MatchesProgram {
    id: web3.PublicKey;
    program: Program;
    instruction: MatchesInstruction;
    constructor(args: {
        id: web3.PublicKey;
        program: Program;
    });
    fetchMatch(oracle: web3.PublicKey): Promise<MatchWrapper>;
    fetchOracle(oracle: web3.PublicKey): Promise<MatchWrapper>;
    createMatch(kp: Keypair, args: CreateMatchArgs, _accounts: {}, additionalArgs: CreateMatchAdditionalArgs): Promise<void>;
    disburseTokensByOracle(args: DisburseTokensByOracleArgs, accounts: DisburseTokensByOracleAccounts, additionalArgs: DisburseTokensByOracleAdditionalArgs): Promise<void>;
    drainMatch(args: DrainMatchArgs, accounts: DrainMatchAccounts, additionalArgs: DrainMatchAdditionalArgs): Promise<void>;
    drainOracle(args: DrainOracleArgs, accounts: DrainOracleAccounts, _additionalArgs?: {}): Promise<void>;
    joinMatch(kp: any, args: JoinMatchArgs, accounts: JoinMatchAccounts, additionalArgs: JoinMatchAdditionalArgs): Promise<void>;
    leaveMatch(args: LeaveMatchArgs, accounts: LeaveMatchAccounts, additionalArgs: LeaveMatchAdditionalArgs): Promise<void>;
    updateMatch(kp: Keypair, args: UpdateMatchArgs, accounts: UpdateMatchAccounts, _additionalArgs?: {}): Promise<void>;
    updateMatchFromOracle(kp: Keypair, args: {}, accounts: UpdateMatchFromOracleAccounts, _additionalArgs?: {}): Promise<void>;
    join(kp: Keypair, args: CreateOrUpdateOracleArgs, _accounts?: {}, _additionalArgs?: {}): Promise<void>;
    createOrUpdateOracle(kp: Keypair, args: CreateOrUpdateOracleArgs, _accounts?: {}, _additionalArgs?: {}): Promise<void>;
}
export declare function getMatchesProgram(anchorWallet: NodeWallet | web3.Keypair, env: string, customRpcUrl: string): Promise<MatchesProgram>;
