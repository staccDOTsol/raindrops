"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ITEM_SCHEMA = exports.BasicItemEffectType = exports.BasicItemEffect = exports.ItemUsageType = exports.Consumable = exports.Wearable = exports.ItemClassType = exports.ItemClass = exports.ItemUsage = exports.DNPItem = exports.ComponentCondition = exports.Component = exports.ItemClassConfig = exports.ItemClassData = exports.ItemClassSettings = exports.decodeItemClass = void 0;
const borsh_1 = require("borsh");
const borsh_2 = require("../utils/borsh");
const common_1 = require("./common");
(0, borsh_2.extendBorsh)();
const decodeItemClass = (buffer) => {
    const metadata = (0, borsh_1.deserializeUnchecked)(exports.ITEM_SCHEMA, ItemClass, buffer);
    return metadata;
};
exports.decodeItemClass = decodeItemClass;
class ItemClassSettings {
    constructor(args) {
        this.freeBuild = args.freeBuild;
        this.childrenMustBeEditions = args.childrenMustBeEditions;
        this.builderMustBeHolder = args.builderMustBeHolder;
        this.updatePermissiveness = args.updatePermissiveness;
        this.buildPermissiveness = args.buildPermissiveness;
        this.stakingWarmUpDuration = args.stakingWarmUpDuration;
        this.stakingCooldownDuration = args.stakingCooldownDuration;
        this.stakingPermissiveness = args.stakingPermissiveness;
        this.unstakingPermissiveness = args.unstakingPermissiveness;
        this.childUpdatePropagationPermissiveness =
            args.childUpdatePropagationPermissiveness;
    }
}
exports.ItemClassSettings = ItemClassSettings;
class ItemClassData {
    constructor(args) {
        this.settings = args.settings;
        this.config = args.config;
    }
}
exports.ItemClassData = ItemClassData;
class ItemClassConfig {
    constructor(args) {
        this.usageRoot = args.usageRoot;
        this.usageStateRoot = args.usageStateRoot;
        this.componentRoot = args.componentRoot;
        this.usages = args.usages;
        this.components = args.components;
    }
}
exports.ItemClassConfig = ItemClassConfig;
class Component {
    constructor(args) {
        this.classIndex = args.classIndex;
        this.mint = args.mint;
        this.amount = args.amount;
        this.timeToBuild = args.timeToBuild;
        this.componentScope = args.componentScope;
        this.useUsageIndex = args.useUsageIndex;
        this.condition = args.condition;
        this.inherited = args.inherited;
    }
}
exports.Component = Component;
var ComponentCondition;
(function (ComponentCondition) {
    ComponentCondition[ComponentCondition["Consumed"] = 0] = "Consumed";
    ComponentCondition[ComponentCondition["Presence"] = 1] = "Presence";
    ComponentCondition[ComponentCondition["Absence"] = 2] = "Absence";
    ComponentCondition[ComponentCondition["Cooldown"] = 3] = "Cooldown";
    ComponentCondition[ComponentCondition["CooldownAndConsume"] = 4] = "CooldownAndConsume";
})(ComponentCondition = exports.ComponentCondition || (exports.ComponentCondition = {}));
class DNPItem {
    constructor(args) {
        this.key = args.key;
        this.inherited = args.inherited;
    }
}
exports.DNPItem = DNPItem;
class ItemUsage {
    constructor(args) {
        this.index = args.index;
        this.basicItemEffects = args.basicItemEffects;
        this.usagePermissiveness = args.usagePermissiveness;
        this.inherited = args.inherited;
        this.itemClassType = args.itemClassType;
        this.callback = args.callback;
        this.validation = args.validation;
        this.doNotPairWithSelf = args.doNotPairWithSelf;
        this.dnp = args.dnp;
    }
}
exports.ItemUsage = ItemUsage;
class ItemClass {
    constructor(args) {
        this.key = args.key;
        this.namespaces = args.namespaces;
        this.parent = args.parent;
        this.mint = args.mint;
        this.metadata = args.metadata;
        this.edition = args.edition;
        this.bump = args.bump;
        this.existingChildren = args.existingChildren;
        this.itemClassData = args.itemClassData;
    }
}
exports.ItemClass = ItemClass;
class ItemClassType {
    constructor(args) {
        this.wearable = args.wearable;
        this.consumable = args.consumable;
    }
}
exports.ItemClassType = ItemClassType;
class Wearable {
    constructor(args) {
        this.bodyPart = args.bodyPart;
        this.limitPerPart = args.limitPerPart;
    }
}
exports.Wearable = Wearable;
class Consumable {
    constructor(args) {
        this.maxUses = args.maxUses;
        this.maxPlayersPerUse = args.maxPlayersPerUse;
        this.itemUsageType = args.itemUsageType;
        this.cooldownDuration = args.cooldownDuration;
        this.warmupDuration = args.warmupDuration;
    }
}
exports.Consumable = Consumable;
var ItemUsageType;
(function (ItemUsageType) {
    ItemUsageType[ItemUsageType["Exhaustion"] = 0] = "Exhaustion";
    ItemUsageType[ItemUsageType["Destruction"] = 1] = "Destruction";
    ItemUsageType[ItemUsageType["Infinite"] = 2] = "Infinite";
})(ItemUsageType = exports.ItemUsageType || (exports.ItemUsageType = {}));
class BasicItemEffect {
    constructor(args) {
        this.amount = args.amount;
        this.stat = args.stat;
        this.itemEffectType = args.itemEffectType;
        this.activeDuration = args.activeDuration;
        this.stakingAmountNumerator = args.stakingAmountNumerator;
        this.stakingAmountDivisor = args.stakingAmountDivisor;
        this.stakingDurationNumerator = args.stakingDurationNumerator;
        this.stakingDurationDivisor = args.stakingDurationDivisor;
        this.maxUses = args.maxUses;
    }
}
exports.BasicItemEffect = BasicItemEffect;
var BasicItemEffectType;
(function (BasicItemEffectType) {
    BasicItemEffectType[BasicItemEffectType["Increment"] = 0] = "Increment";
    BasicItemEffectType[BasicItemEffectType["Decrement"] = 1] = "Decrement";
    BasicItemEffectType[BasicItemEffectType["IncrementPercent"] = 2] = "IncrementPercent";
    BasicItemEffectType[BasicItemEffectType["DecrementPercent"] = 3] = "DecrementPercent";
    BasicItemEffectType[BasicItemEffectType["IncrementPercentFromBase"] = 4] = "IncrementPercentFromBase";
    BasicItemEffectType[BasicItemEffectType["DecrementPercentFromBase"] = 5] = "DecrementPercentFromBase";
})(BasicItemEffectType = exports.BasicItemEffectType || (exports.BasicItemEffectType = {}));
exports.ITEM_SCHEMA = new Map([
    [
        ItemClass,
        {
            kind: "struct",
            fields: [
                ["key", "u64"],
                ["namespaces", { kind: "option", type: [common_1.NamespaceAndIndex] }],
                ["parent", { kind: "option", type: "pubkey" }],
                ["mint", { kind: "option", type: "pubkey" }],
                ["metadata", { kind: "option", type: "pubkey" }],
                ["edition", { kind: "option", type: "pubkey" }],
                ["bump", "u8"],
                ["existingChildren", "u64"],
                ["itemClassData", ItemClassData],
            ],
        },
    ],
    [
        ItemClassData,
        {
            kind: "struct",
            fields: [
                ["settings", ItemClassSettings],
                ["config", ItemClassConfig],
            ],
        },
    ],
    [
        common_1.Root,
        {
            kind: "struct",
            fields: [
                ["inherited", "u8"],
                ["root", "pubkey"],
            ],
        },
    ],
    [
        common_1.InheritedBoolean,
        {
            kind: "struct",
            fields: [
                ["inherited", "u8"],
                ["boolean", "u8"],
            ],
        },
    ],
    [
        common_1.Permissiveness,
        {
            kind: "struct",
            fields: [
                ["inherited", "u8"],
                ["permissivenessType", "u8"],
            ],
        },
    ],
    [
        common_1.ChildUpdatePropagationPermissiveness,
        {
            kind: "struct",
            fields: [
                ["overridable", "u8"],
                ["inherited", "u8"],
                ["childUpdatePropagationPermissivenessType", "u8"],
            ],
        },
    ],
    [
        DNPItem,
        {
            kind: "struct",
            fields: [
                ["key", "pubkey"],
                ["inherited", "u8"],
            ],
        },
    ],
    [
        common_1.NamespaceAndIndex,
        {
            kind: "struct",
            fields: [
                ["namespace", "pubkey"],
                ["indexed", "u8"],
                ["inherited", "u8"],
            ],
        },
    ],
    [
        Wearable,
        {
            kind: "struct",
            fields: [
                ["bodyPart", ["string"]],
                ["limitPerPart", { kind: "option", type: "u64" }],
            ],
        },
    ],
    [
        common_1.Callback,
        {
            kind: "struct",
            fields: [
                ["key", "pubkey"],
                ["code", "u64"],
            ],
        },
    ],
    [
        Consumable,
        {
            kind: "struct",
            fields: [
                ["maxUses", { kind: "option", type: "u64" }],
                ["maxPlayersPerUse", { kind: "option", type: "u64" }],
                ["itemUsageType", "u8"],
                ["cooldownDuration", { kind: "option", type: "u64" }],
                ["warmupDuration", { kind: "option", type: "u64" }],
            ],
        },
    ],
    [
        ItemClassType,
        {
            kind: "enum",
            values: [
                ["wearable", Wearable],
                ["consumable", Consumable],
            ],
        },
    ],
    [
        ItemUsage,
        {
            kind: "struct",
            fields: [
                ["index", "u16"],
                ["basicItemEffects", { kind: "option", type: [BasicItemEffect] }],
                ["usagePermissiveness", ["u8"]],
                ["inherited", "u8"],
                ["itemClassType", ItemClassType],
                ["callback", { kind: "option", type: common_1.Callback }],
                ["validation", { kind: "option", type: common_1.Callback }],
                ["doNotPairWithSelf", { kind: "option", type: common_1.InheritedBoolean }],
                ["dnp", { kind: "option", type: [DNPItem] }],
            ],
        },
    ],
    [
        Component,
        {
            kind: "struct",
            fields: [
                ["mint", "pubkey"],
                ["classIndex", "u64"],
                ["amount", "u64"],
                ["timeToBuild", { kind: "option", type: "u64" }],
                ["componentScope", "string"],
                ["useUsageIndex", "u16"],
                ["condition", "u8"],
                ["inherited", "u8"],
            ],
        },
    ],
    [
        BasicItemEffect,
        {
            kind: "struct",
            fields: [
                ["amount", "u64"],
                ["stat", "string"],
                ["itemEffectType", "u8"],
                ["activeDuration", { kind: "option", type: "u64" }],
                ["stakingAmountNumerator", { kind: "option", type: "u64" }],
                ["stakingAmountDivisor", { kind: "option", type: "u64" }],
                ["stakingDurationNumerator", { kind: "option", type: "u64" }],
                ["stakingDurationDivisor", { kind: "option", type: "u64" }],
                ["maxUses", { kind: "option", type: "u64" }],
            ],
        },
    ],
    [
        ItemClassConfig,
        {
            kind: "struct",
            fields: [
                ["usageRoot", { kind: "option", type: common_1.Root }],
                ["usageStateRoot", { kind: "option", type: common_1.Root }],
                ["componentRoot", { kind: "option", type: common_1.Root }],
                ["usages", { kind: "option", type: [ItemUsage] }],
                ["components", { kind: "option", type: [Component] }],
            ],
        },
    ],
    [
        ItemClassSettings,
        {
            kind: "struct",
            fields: [
                ["freeBuild", { kind: "option", type: common_1.InheritedBoolean }],
                ["childrenMustBeEditions", { kind: "option", type: common_1.InheritedBoolean }],
                ["builderMustBeHolder", { kind: "option", type: common_1.InheritedBoolean }],
                ["updatePermissiveness", { kind: "option", type: [common_1.Permissiveness] }],
                ["buildPermissiveness", { kind: "option", type: [common_1.Permissiveness] }],
                ["stakingWarmUpDuration", { kind: "option", type: "u64" }],
                ["stakingCooldownDuration", { kind: "option", type: "u64" }],
                ["stakingPermissiveness", { kind: "option", type: [common_1.Permissiveness] }],
                ["unstakingPermissiveness", { kind: "option", type: [common_1.Permissiveness] }],
                [
                    "childUpdatePropagationPermissiveness",
                    { kind: "option", type: [common_1.ChildUpdatePropagationPermissiveness] },
                ],
            ],
        },
    ],
]);
