/// <reference types="node" />
import { BN, web3 } from "@project-serum/anchor";
import { Callback, ChildUpdatePropagationPermissiveness, InheritanceState, InheritedBoolean, NamespaceAndIndex, Permissiveness, PermissivenessType, Root } from "./common";
export declare const decodeItemClass: (buffer: Buffer) => ItemClass;
export declare class ItemClassSettings {
    freeBuild: null | InheritedBoolean;
    childrenMustBeEditions: null | InheritedBoolean;
    builderMustBeHolder: null | InheritedBoolean;
    updatePermissiveness: null | Permissiveness[];
    buildPermissiveness: null | Permissiveness[];
    stakingWarmUpDuration: null | BN;
    stakingCooldownDuration: null | BN;
    stakingPermissiveness: null | Permissiveness[];
    unstakingPermissiveness: null | Permissiveness[];
    childUpdatePropagationPermissiveness: null | ChildUpdatePropagationPermissiveness[];
    constructor(args: {
        freeBuild: null | InheritedBoolean;
        childrenMustBeEditions: null | InheritedBoolean;
        builderMustBeHolder: null | InheritedBoolean;
        updatePermissiveness: null | Permissiveness[];
        buildPermissiveness: null | Permissiveness[];
        stakingWarmUpDuration: null | BN;
        stakingCooldownDuration: null | BN;
        stakingPermissiveness: null | Permissiveness[];
        unstakingPermissiveness: null | Permissiveness[];
        childUpdatePropagationPermissiveness: null | ChildUpdatePropagationPermissiveness[];
    });
}
export declare class ItemClassData {
    settings: ItemClassSettings;
    config: ItemClassConfig;
    constructor(args: {
        settings: ItemClassSettings;
        config: ItemClassConfig;
    });
}
export declare class ItemClassConfig {
    usageRoot: null | Root;
    usageStateRoot: null | Root;
    componentRoot: null | Root;
    usages: null | ItemUsage[];
    components: null | Component[];
    constructor(args: {
        usageRoot: null | Root;
        usageStateRoot: null | Root;
        componentRoot: null | Root;
        usages: null | ItemUsage[];
        components: null | Component[];
    });
}
export declare class Component {
    mint: web3.PublicKey;
    classIndex: BN;
    amount: BN;
    timeToBuild: null | BN;
    componentScope: string;
    useUsageIndex: number;
    condition: ComponentCondition;
    inherited: InheritanceState;
    constructor(args: {
        mint: web3.PublicKey;
        classIndex: BN;
        amount: BN;
        timeToBuild: null | BN;
        componentScope: string;
        useUsageIndex: number;
        condition: ComponentCondition;
        inherited: InheritanceState;
    });
}
export declare enum ComponentCondition {
    Consumed = 0,
    Presence = 1,
    Absence = 2,
    Cooldown = 3,
    CooldownAndConsume = 4
}
export interface AnchorComponentCondition {
    consumed?: boolean;
    presence?: boolean;
    absence?: boolean;
    cooldown?: boolean;
    cooldownAndConsume?: boolean;
}
export declare class DNPItem {
    key: web3.PublicKey;
    inherited: InheritanceState;
    constructor(args: {
        key: web3.PublicKey;
        inherited: InheritanceState;
    });
}
export declare class ItemUsage {
    index: number;
    basicItemEffects: null | BasicItemEffect[];
    usagePermissiveness: PermissivenessType[];
    inherited: InheritanceState;
    itemClassType: ItemClassType;
    callback: null | Callback;
    validation: null | Callback;
    doNotPairWithSelf: InheritedBoolean;
    dnp: null | DNPItem[];
    constructor(args: {
        index: number;
        basicItemEffects: null | BasicItemEffect[];
        usagePermissiveness: PermissivenessType[];
        inherited: InheritanceState;
        itemClassType: ItemClassType;
        callback: null | Callback;
        validation: null | Callback;
        doNotPairWithSelf: InheritedBoolean;
        dnp: null | DNPItem[];
    });
}
export declare class ItemClass {
    key: BN;
    namespaces: NamespaceAndIndex[] | null;
    parent: web3.PublicKey | null;
    mint: web3.PublicKey | null;
    metadata: web3.PublicKey | null;
    edition: web3.PublicKey | null;
    bump: number;
    existingChildren: BN;
    itemClassData: ItemClassData;
    constructor(args: {
        key: BN;
        namespaces: NamespaceAndIndex[] | null;
        parent: web3.PublicKey | null;
        mint: web3.PublicKey | null;
        metadata: web3.PublicKey | null;
        edition: web3.PublicKey | null;
        bump: number;
        existingChildren: BN;
        itemClassData: ItemClassData;
    });
}
export declare class ItemClassType {
    wearable?: Wearable;
    consumable?: Consumable;
    constructor(args: {
        wearable?: Wearable;
        consumable?: Consumable;
    });
}
export declare class Wearable {
    bodyPart: string[];
    limitPerPart: BN;
    constructor(args: {
        bodyPart: string[];
        limitPerPart: BN;
    });
}
export declare class Consumable {
    maxUses: null | BN;
    maxPlayersPerUse: null | BN;
    itemUsageType: ItemUsageType;
    cooldownDuration: null | BN;
    warmupDuration: null | BN;
    constructor(args: {
        maxUses: null | BN;
        maxPlayersPerUse: null | BN;
        itemUsageType: ItemUsageType;
        cooldownDuration: null | BN;
        warmupDuration: null | BN;
    });
}
export declare enum ItemUsageType {
    Exhaustion = 0,
    Destruction = 1,
    Infinite = 2
}
export declare class BasicItemEffect {
    amount: BN;
    stat: string;
    itemEffectType: BasicItemEffectType;
    activeDuration: null | BN;
    stakingAmountNumerator: null | BN;
    stakingAmountDivisor: null | BN;
    stakingDurationNumerator: null | BN;
    stakingDurationDivisor: null | BN;
    maxUses: null | BN;
    constructor(args: {
        amount: BN;
        stat: string;
        itemEffectType: BasicItemEffectType;
        activeDuration: null | BN;
        stakingAmountNumerator: null | BN;
        stakingAmountDivisor: null | BN;
        stakingDurationNumerator: null | BN;
        stakingDurationDivisor: null | BN;
        maxUses: null | BN;
    });
}
export declare enum BasicItemEffectType {
    Increment = 0,
    Decrement = 1,
    IncrementPercent = 2,
    DecrementPercent = 3,
    IncrementPercentFromBase = 4,
    DecrementPercentFromBase = 5
}
export declare const ITEM_SCHEMA: Map<any, any>;
