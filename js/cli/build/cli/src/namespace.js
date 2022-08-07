"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const sol_command_1 = require("@raindrop-studios/sol-command");
const anchor_1 = require("@project-serum/anchor");
const loglevel_1 = __importDefault(require("loglevel"));
const raindrops_1 = require("@raindrops-protocol/raindrops");
sol_command_1.CLI.programCommandWithConfig("initialize_namespace", async (config, options, _files) => {
    const { keypair, env, rpcUrl } = options;
    const namespaceProgram = await raindrops_1.NamespaceProgram.getProgramWithWalletKeyPair(raindrops_1.NamespaceProgram, await sol_command_1.Wallet.loadWalletKey(keypair), env, rpcUrl);
    const whitelistedStakingMints = config.whitelistedStakingMints.map((mint) => new anchor_1.web3.PublicKey(mint));
    await namespaceProgram.initializeNamespace({
        desiredNamespaceArraySize: config.desiredNamespaceArraySize,
        uuid: config.uuid,
        prettyName: config.prettyName,
        permissivenessSettings: config.permissivenessSettings,
        whitelistedStakingMints: whitelistedStakingMints,
    }, {
        mint: new anchor_1.web3.PublicKey(config.mint),
        metadata: new anchor_1.web3.PublicKey(config.metadata),
        masterEdition: new anchor_1.web3.PublicKey(config.masterEdition),
    });
    loglevel_1.default.info("Namespace Initialized :: Run `show_namespace` command to view");
});
const showNamespaceArgument = new sol_command_1.CLI.Argument("<mint>", "The mint associated with the namepace to show")
    .argParser((mint) => new anchor_1.web3.PublicKey(mint));
sol_command_1.CLI.programCommandWithArgs("show_namespace", [showNamespaceArgument], async (mint, options, _cmd) => {
    const { keypair, env, rpcUrl } = options;
    const namespaceProgram = await raindrops_1.NamespaceProgram.getProgramWithWalletKeyPair(raindrops_1.NamespaceProgram, await sol_command_1.Wallet.loadWalletKey(keypair), env, rpcUrl);
    const namespace = await namespaceProgram.fetchNamespace(mint);
    loglevel_1.default.setLevel("info");
    namespace.print(loglevel_1.default);
});
sol_command_1.CLI.programCommandWithConfig("update_namespace", async (config, options, _files) => {
    const { keypair, env, rpcUrl } = options;
    const namespaceProgram = await raindrops_1.NamespaceProgram.getProgramWithWalletKeyPair(raindrops_1.NamespaceProgram, await sol_command_1.Wallet.loadWalletKey(keypair), env, rpcUrl);
    const whitelistedStakingMints = config.whitelistedStakingMints.map((mint) => new anchor_1.web3.PublicKey(mint));
    console.log(namespaceProgram.client.provider.wallet.publicKey.toString());
    await namespaceProgram.updateNamespace({
        prettyName: config.prettyName || null,
        permissivenessSettings: config.permissivenessSettings || null,
        whitelistedStakingMints: whitelistedStakingMints || null,
    }, {
        mint: new anchor_1.web3.PublicKey(config.mint),
        namespaceToken: new anchor_1.web3.PublicKey(config.namespaceToken),
        tokenHolder: namespaceProgram.client.provider.wallet.publicKey,
    });
    loglevel_1.default.info("Namespace updated :: Run `show_namespace` command to see the changes");
});
sol_command_1.CLI.Program.parseAsync(process.argv);
