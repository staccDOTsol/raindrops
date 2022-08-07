import { web3, BN } from "@project-serum/anchor";
export declare class Permissiveness {
    inherited: InheritanceState;
    permissivenessType: PermissivenessType;
    constructor(args: {
        inherited: InheritanceState;
        permissivenessType: PermissivenessType;
    });
}
export declare class ChildUpdatePropagationPermissiveness {
    overridable: boolean;
    inherited: InheritanceState;
    childUpdatePropagationPermissivenessType: ChildUpdatePropagationPermissivenessType;
    constructor(args: {
        overridable: boolean;
        inherited: InheritanceState;
        childUpdatePropagationPermissivenessType: ChildUpdatePropagationPermissivenessType;
    });
}
export declare class InheritedBoolean {
    inherited: InheritanceState;
    boolean: boolean;
    constructor(args: {
        inherited: InheritanceState;
        boolean: boolean;
    });
}
export declare enum PermissivenessType {
    TokenHolder = 0,
    ParentTokenHolder = 1,
    UpdateAuthority = 2,
    Anybody = 3
}
export interface AnchorPermissivenessType {
    tokenHolder?: boolean;
    parentTokenHolder?: boolean;
    updateAuthority?: boolean;
    anybody?: boolean;
}
export declare enum ChildUpdatePropagationPermissivenessType {
    Usages = 0,
    Components = 1,
    UpdatePermissiveness = 2,
    BuildPermissiveness = 3,
    ChildUpdatePropagationPermissiveness = 4,
    ChildrenMustBeEditionsPermissiveness = 5,
    BuilderMustBeHolderPermissiveness = 6,
    StakingPermissiveness = 7,
    Namespaces = 8,
    FreeBuildPermissiveness = 9
}
export declare function toAnchor(enumVal: any, enumClass: any): any;
export declare enum InheritanceState {
    NotInherited = 0,
    Inherited = 1,
    Overridden = 2
}
export interface AnchorInheritanceState {
    notInherited?: boolean;
    inherited?: boolean;
    overridden?: boolean;
}
export declare class Root {
    inherited: InheritanceState;
    root: web3.PublicKey;
    constructor(args: {
        inherited: InheritanceState;
        root: web3.PublicKey;
    });
}
export declare class Callback {
    key: web3.PublicKey;
    code: BN;
    constructor(args: {
        key: web3.PublicKey;
        code: BN;
    });
}
export declare class NamespaceAndIndex {
    namespace: web3.PublicKey;
    indexed: boolean;
    inherited: InheritanceState;
    constructor(args: {
        namespace: web3.PublicKey;
        indexed: boolean;
        inherited: InheritanceState;
    });
}
