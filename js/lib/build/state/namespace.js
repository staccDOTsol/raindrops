"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Namespace = exports.Permissiveness = exports.PermissivenessSettings = void 0;
class PermissivenessSettings {
}
exports.PermissivenessSettings = PermissivenessSettings;
var Permissiveness;
(function (Permissiveness) {
    Permissiveness[Permissiveness["All"] = 0] = "All";
    Permissiveness[Permissiveness["Whitelist"] = 1] = "Whitelist";
    Permissiveness[Permissiveness["Blacklist"] = 2] = "Blacklist";
    Permissiveness[Permissiveness["Namespace"] = 3] = "Namespace";
})(Permissiveness = exports.Permissiveness || (exports.Permissiveness = {}));
class Namespace {
    constructor(key, data) {
        this.key = key;
        this.namespaces = data.namespaces;
        this.mint = data.mint;
        this.metadata = data.metadata;
        this.masterEdition = data.masterEdition;
        this.uuid = data.uuid;
        this.prettyName = data.prettyName;
        this.artifactsAdded = data.artifactsAdded;
        this.highestPage = data.highestPage;
        this.artifactsCached = data.artifactsCached;
        this.permissivenessSettings = data.permissivenessSettings;
        this.bump = data.bump;
        this.whitelistedStakingMints = data.whitelistedStakingMints;
    }
    print(log) {
        var _a, _b;
        log.info("Namespace:", this.key.toBase58());
        log.info(`Namespaces: ${this.namespaces ? "[" : "[]"}`);
        if (this.namespaces) {
            this.namespaces.map((n) => {
                log.info(`{`);
                log.info(`\tnamespace: ${n.namespace.toBase58()}`);
                log.info(`\tindexed: ${n.indexed}`);
                log.info(`\tinherited: ${Object.keys(n.inherited).join(", ")}`);
                log.info(`}`);
            });
            log.info("]");
        }
        log.info("Mint:", this.mint ? this.mint.toBase58() : "Not cached on object");
        log.info("Metadata:", this.metadata
            ? this.metadata.toBase58()
            : "Not cached on object");
        log.info("Master Edition:", this.masterEdition
            ? this.masterEdition.toBase58()
            : "Not cached on object");
        log.info("UUID:", this.uuid ? this.uuid : "Not cached on object");
        log.info("Pretty Name:", this.prettyName
            ? this.prettyName
            : "Not cached on object");
        log.info("Artifacts Added:", this.artifactsAdded
            ? this.artifactsAdded
            : "Not cached on object");
        log.info("Highest Page:", this.highestPage
            ? this.highestPage
            : "Not cached on object");
        log.info("Aritfacts Cached:", this.artifactsCached
            ? this.artifactsCached
            : "Not cached on object");
        log.info("Permissiveness Settings: {");
        log.info(`\tNamespace Permissiveness: ${Object.keys(this.permissivenessSettings.namespacePermissiveness).join(", ")}`);
        log.info(`\tItem Permissiveness: ${Object.keys(this.permissivenessSettings.itemPermissiveness).join(", ")}`);
        log.info(`\tPlayer Permissiveness: ${Object.keys(this.permissivenessSettings.playerPermissiveness).join(", ")}`);
        log.info(`\tMatch Permissiveness: ${Object.keys(this.permissivenessSettings.matchPermissiveness).join(", ")}`);
        log.info(`\tMission Permissiveness: ${Object.keys(this.permissivenessSettings.missionPermissiveness).join(", ")}`);
        log.info(`\tCache Permissiveness: ${Object.keys(this.permissivenessSettings.cachePermissiveness).join(", ")}`);
        log.info("}");
        log.info("Bump:", this.bump ? this.bump : "Not cached on object");
        log.info(`Whitelist Staking Mints: [${((_a = this.whitelistedStakingMints) === null || _a === void 0 ? void 0 : _a.length) > 0 ? "" : "]"}`);
        if (((_b = this.whitelistedStakingMints) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            this.whitelistedStakingMints.map((wlStakingMint) => {
                log.info(`\t${wlStakingMint.toBase58()}`);
            });
            log.info("]");
        }
    }
}
exports.Namespace = Namespace;
