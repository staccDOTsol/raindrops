import { web3 } from "@project-serum/anchor";
import { NamespaceAndIndex } from "./common";
export declare class PermissivenessSettings {
    namespacePermissiveness: Permissiveness;
    itemPermissiveness: Permissiveness;
    playerPermissiveness: Permissiveness;
    matchPermissiveness: Permissiveness;
    missionPermissiveness: Permissiveness;
    cachePermissiveness: Permissiveness;
}
export declare enum Permissiveness {
    All = 0,
    Whitelist = 1,
    Blacklist = 2,
    Namespace = 3
}
export declare class Namespace {
    key: web3.PublicKey;
    namespaces: NamespaceAndIndex[] | null;
    mint: web3.PublicKey | null;
    metadata: web3.PublicKey | null;
    masterEdition: web3.PublicKey | null;
    uuid: string | null;
    prettyName: string | null;
    artifactsAdded: number;
    highestPage: number;
    artifactsCached: number;
    permissivenessSettings: PermissivenessSettings | null;
    bump: number;
    whitelistedStakingMints: web3.PublicKey[] | null;
    constructor(key: any, data: any);
    print(log: any): void;
}
