import { BN, web3 } from "@project-serum/anchor";
import { ChildUpdatePropagationPermissiveness, NamespaceAndIndex, Permissiveness } from "./common";
export declare class ArtifactClassData {
    childrenMustBeEditions: boolean | null;
    builderMustBeHolder: boolean | null;
    updatePermissiveness: Permissiveness[] | null;
    buildPermissiveness: Permissiveness[] | null;
    stakingWarmUpDuration: BN | null;
    stakingCooldownDuration: BN | null;
    stakingPermissiveness: Permissiveness[] | null;
    unstakingPermissiveness: Permissiveness[] | null;
    childUpdatePropagationPermissiveness: ChildUpdatePropagationPermissiveness[] | null;
    constructor(args: {
        childrenMustBeEditions: boolean | null;
        builderMustBeHolder: boolean | null;
        updatePermissiveness: Permissiveness[] | null;
        buildPermissiveness: Permissiveness[] | null;
        stakingWarmUpDuration: BN | null;
        stakingCooldownDuration: BN | null;
        stakingPermissiveness: Permissiveness[] | null;
        unstakingPermissiveness: Permissiveness[] | null;
        childUpdatePropagationPermissiveness: ChildUpdatePropagationPermissiveness[] | null;
    });
}
export declare class ArtifactClass {
    namespaces: NamespaceAndIndex[] | null;
    parent: web3.PublicKey | null;
    mint: web3.PublicKey | null;
    metadata: web3.PublicKey | null;
    edition: web3.PublicKey | null;
    bump: number;
    existingChildren: BN;
    data: ArtifactClassData;
    constructor(args: {
        namespaces: NamespaceAndIndex[] | null;
        parent: web3.PublicKey | null;
        mint: web3.PublicKey | null;
        metadata: web3.PublicKey | null;
        edition: web3.PublicKey | null;
        bump: number;
        existingChildren: BN;
        data: ArtifactClassData;
    });
}
export declare class StakingCounter {
    bump: number;
    eventStart: BN;
    eventType: BN;
    constructor(args: {
        bump: number;
        eventStart: BN;
        eventType: BN;
    });
}
export declare class Artifact {
    namespaces: NamespaceAndIndex[] | null;
    parent: web3.PublicKey | null;
    mint: web3.PublicKey | null;
    metadata: web3.PublicKey | null;
    edition: web3.PublicKey | null;
    bump: number;
    tokenStaked: BN;
    constructor(args: {
        namespaces: NamespaceAndIndex[] | null;
        parent: web3.PublicKey | null;
        mint: web3.PublicKey | null;
        metadata: web3.PublicKey | null;
        edition: web3.PublicKey | null;
        bump: number;
        tokenStaked: BN;
    });
}
//# sourceMappingURL=staking.d.ts.map