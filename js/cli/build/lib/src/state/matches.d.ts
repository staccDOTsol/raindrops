import { web3, BN } from "@project-serum/anchor";
import { Callback } from "./common";
export interface AnchorMatchState {
    draft?: boolean;
    initialized?: boolean;
    started?: boolean;
    finalized?: boolean;
    paidOut?: boolean;
    deactivated?: boolean;
}
export interface AnchorTokenEntryValidation {
    filter: AnchorFilter;
    isBlacklist: boolean;
    validation: null | Callback;
}
export interface AnchorFilter {
    none?: boolean;
    all?: boolean;
    namespace?: {
        namespace: web3.PublicKey;
    };
    parent?: {
        key: web3.PublicKey;
    };
    mint?: {
        mint: web3.PublicKey;
    };
}
export declare enum MatchState {
    Draft = 0,
    Initialized = 1,
    Started = 2,
    Finalized = 3,
    PaidOut = 4,
    Deactivated = 5
}
export declare enum TokenTransferType {
    PlayerToPlayer = 0,
    PlayerToEntrant = 1,
    Normal = 2
}
export declare enum TokenType {
    Player = 0,
    Item = 1,
    Any = 2
}
export interface AnchorTokenTransferType {
    playerToPlayer?: boolean;
    playerToEntrant?: boolean;
    normal?: boolean;
}
export interface AnchorTokenDelta {
    from: web3.PublicKey;
    to: web3.PublicKey | null;
    tokenTransferType: AnchorTokenTransferType;
    mint: web3.PublicKey;
    amount: BN;
}
