"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Artifact = exports.StakingCounter = exports.ArtifactClass = exports.ArtifactClassData = void 0;
class ArtifactClassData {
    constructor(args) {
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
exports.ArtifactClassData = ArtifactClassData;
class ArtifactClass {
    constructor(args) {
        this.namespaces = args.namespaces;
        this.parent = args.parent;
        this.mint = args.mint;
        this.metadata = args.metadata;
        this.edition = args.edition;
        this.bump = args.bump;
        this.existingChildren = args.existingChildren;
        this.data = args.data;
    }
}
exports.ArtifactClass = ArtifactClass;
class StakingCounter {
    constructor(args) {
        this.bump = args.bump;
        this.eventStart = args.eventStart;
        this.eventType = args.eventType;
    }
}
exports.StakingCounter = StakingCounter;
class Artifact {
    constructor(args) {
        this.namespaces = args.namespaces;
        this.parent = args.parent;
        this.mint = args.mint;
        this.metadata = args.metadata;
        this.edition = args.edition;
        this.bump = args.bump;
        this.tokenStaked = args.tokenStaked;
    }
}
exports.Artifact = Artifact;
