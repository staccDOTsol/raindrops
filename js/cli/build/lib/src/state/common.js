"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamespaceAndIndex = exports.Callback = exports.Root = exports.InheritanceState = exports.toAnchor = exports.ChildUpdatePropagationPermissivenessType = exports.PermissivenessType = exports.InheritedBoolean = exports.ChildUpdatePropagationPermissiveness = exports.Permissiveness = void 0;
class Permissiveness {
    constructor(args) {
        this.inherited = args.inherited;
        this.permissivenessType = args.permissivenessType;
    }
}
exports.Permissiveness = Permissiveness;
class ChildUpdatePropagationPermissiveness {
    constructor(args) {
        this.overridable = args.overridable;
        this.inherited = args.inherited;
        this.childUpdatePropagationPermissivenessType =
            args.childUpdatePropagationPermissivenessType;
    }
}
exports.ChildUpdatePropagationPermissiveness = ChildUpdatePropagationPermissiveness;
class InheritedBoolean {
    constructor(args) {
        this.inherited = args.inherited;
        this.boolean = args.boolean;
    }
}
exports.InheritedBoolean = InheritedBoolean;
var PermissivenessType;
(function (PermissivenessType) {
    PermissivenessType[PermissivenessType["TokenHolder"] = 0] = "TokenHolder";
    PermissivenessType[PermissivenessType["ParentTokenHolder"] = 1] = "ParentTokenHolder";
    PermissivenessType[PermissivenessType["UpdateAuthority"] = 2] = "UpdateAuthority";
    PermissivenessType[PermissivenessType["Anybody"] = 3] = "Anybody";
})(PermissivenessType = exports.PermissivenessType || (exports.PermissivenessType = {}));
var ChildUpdatePropagationPermissivenessType;
(function (ChildUpdatePropagationPermissivenessType) {
    ChildUpdatePropagationPermissivenessType[ChildUpdatePropagationPermissivenessType["Usages"] = 0] = "Usages";
    ChildUpdatePropagationPermissivenessType[ChildUpdatePropagationPermissivenessType["Components"] = 1] = "Components";
    ChildUpdatePropagationPermissivenessType[ChildUpdatePropagationPermissivenessType["UpdatePermissiveness"] = 2] = "UpdatePermissiveness";
    ChildUpdatePropagationPermissivenessType[ChildUpdatePropagationPermissivenessType["BuildPermissiveness"] = 3] = "BuildPermissiveness";
    ChildUpdatePropagationPermissivenessType[ChildUpdatePropagationPermissivenessType["ChildUpdatePropagationPermissiveness"] = 4] = "ChildUpdatePropagationPermissiveness";
    ChildUpdatePropagationPermissivenessType[ChildUpdatePropagationPermissivenessType["ChildrenMustBeEditionsPermissiveness"] = 5] = "ChildrenMustBeEditionsPermissiveness";
    ChildUpdatePropagationPermissivenessType[ChildUpdatePropagationPermissivenessType["BuilderMustBeHolderPermissiveness"] = 6] = "BuilderMustBeHolderPermissiveness";
    ChildUpdatePropagationPermissivenessType[ChildUpdatePropagationPermissivenessType["StakingPermissiveness"] = 7] = "StakingPermissiveness";
    ChildUpdatePropagationPermissivenessType[ChildUpdatePropagationPermissivenessType["Namespaces"] = 8] = "Namespaces";
    ChildUpdatePropagationPermissivenessType[ChildUpdatePropagationPermissivenessType["FreeBuildPermissiveness"] = 9] = "FreeBuildPermissiveness";
})(ChildUpdatePropagationPermissivenessType = exports.ChildUpdatePropagationPermissivenessType || (exports.ChildUpdatePropagationPermissivenessType = {}));
function toAnchor(enumVal, enumClass) {
    if (enumVal === undefined || enumVal === null)
        return null;
    const name = enumClass[enumVal];
    const converted = name.charAt(0).toLowerCase() + name.slice(1);
    return { [converted]: true };
}
exports.toAnchor = toAnchor;
var InheritanceState;
(function (InheritanceState) {
    InheritanceState[InheritanceState["NotInherited"] = 0] = "NotInherited";
    InheritanceState[InheritanceState["Inherited"] = 1] = "Inherited";
    InheritanceState[InheritanceState["Overridden"] = 2] = "Overridden";
})(InheritanceState = exports.InheritanceState || (exports.InheritanceState = {}));
class Root {
    constructor(args) {
        this.inherited = args.inherited;
        this.root = args.root;
    }
}
exports.Root = Root;
class Callback {
    constructor(args) {
        this.key = args.key;
        this.code = args.code;
    }
}
exports.Callback = Callback;
class NamespaceAndIndex {
    constructor(args) {
        this.namespace = args.namespace;
        this.indexed = args.indexed;
        this.inherited = args.inherited;
    }
}
exports.NamespaceAndIndex = NamespaceAndIndex;
