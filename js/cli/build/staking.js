"use strict";
// @ts-nocheck
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const anchor_1 = require("@project-serum/anchor");
const sol_command_1 = require("@raindrop-studios/sol-command");
const loglevel_1 = __importDefault(require("loglevel"));
const raindrops_1 = require("@raindrops-protocol/raindrops");
sol_command_1.CLI.programCommandWithConfig("begin_artifact_stake_warmup", async (config, options, _files) => {
    const { keypair, env, rpcUrl } = options;
    const stakingProgram = await raindrops_1.StakingProgram.getProgramWithWalletKeyPair(raindrops_1.StakingProgram, await sol_command_1.Wallet.loadWalletKey(keypair), env, rpcUrl);
    const { txid } = await stakingProgram.beginArtifactStakeWarmup({
        classIndex: new anchor_1.BN(config.classIndex),
        parentClassIndex: config.parentClassIndex
            ? new anchor_1.BN(config.parentClassIndex)
            : null,
        index: new anchor_1.BN(config.index),
        stakingIndex: new anchor_1.BN(config.stakingIndex),
        artifactClassMint: new anchor_1.web3.PublicKey(config.artifactClassMint),
        artifactMint: new anchor_1.web3.PublicKey(config.artifactMint),
        stakingAmount: new anchor_1.BN(config.stakingAmount),
        stakingPermissivenessToUse: config.stakingPermissivenessToUse || null,
    }, {
        artifactClass: new anchor_1.web3.PublicKey(config.artifactClass),
        artifact: new anchor_1.web3.PublicKey(config.artifact),
        stakingAccount: new anchor_1.web3.PublicKey(config.stakingAccount),
        stakingMint: new anchor_1.web3.PublicKey(config.stakingMint),
        stakingTransferAuthority: anchor_1.web3.Keypair.generate(),
        parentClassMint: config.parentClassMint
            ? new anchor_1.web3.PublicKey(config.parentClassMint)
            : null,
        parentClass: config.parentClass
            ? new anchor_1.web3.PublicKey(config.parentClass)
            : null,
        metadataUpdateAuthority: config.metadataUpdateAuthority
            ? new anchor_1.web3.PublicKey(config.metadataUpdateAuthority)
            : null,
        namespace: new anchor_1.web3.PublicKey(config.namespace),
    });
    loglevel_1.default.setLevel("info");
    loglevel_1.default.info(`Transaction signature: ${txid}`);
});
sol_command_1.CLI.programCommandWithConfig("end_artifact_stake_warmup", async (config, options, _files) => {
    const { keypair, env, rpcUrl } = options;
    const stakingProgram = await raindrops_1.StakingProgram.getProgramWithWalletKeyPair(raindrops_1.StakingProgram, await sol_command_1.Wallet.loadWalletKey(keypair), env, rpcUrl);
    const { txid } = await stakingProgram.endArtifactStakeWarmup({
        classIndex: new anchor_1.BN(config.classIndex),
        index: new anchor_1.BN(config.index),
        stakingIndex: new anchor_1.BN(config.stakingIndex),
        artifactClassMint: new anchor_1.web3.PublicKey(config.artifactClassMint),
        artifactMint: new anchor_1.web3.PublicKey(config.artifactMint),
    }, {
        artifactClass: new anchor_1.web3.PublicKey(config.artifactClass),
        artifact: new anchor_1.web3.PublicKey(config.artifact),
        stakingMint: new anchor_1.web3.PublicKey(config.stakingMint),
    });
    loglevel_1.default.setLevel("info");
    loglevel_1.default.info(`Transaction signature: ${txid}`);
});
sol_command_1.CLI.programCommandWithConfig("begin_artifact_stake_cooldown", async (config, options, _files) => {
    const { keypair, env, rpcUrl } = options;
    const stakingProgram = await raindrops_1.StakingProgram.getProgramWithWalletKeyPair(raindrops_1.StakingProgram, await sol_command_1.Wallet.loadWalletKey(keypair), env, rpcUrl);
    const { txid } = await stakingProgram.beginArtifactStakeCooldown({
        classIndex: new anchor_1.BN(config.classIndex),
        parentClassIndex: config.parentClassIndex
            ? new anchor_1.BN(config.parentClassIndex)
            : null,
        index: new anchor_1.BN(config.index),
        stakingIndex: new anchor_1.BN(config.stakingIndex),
        artifactClassMint: new anchor_1.web3.PublicKey(config.artifactClassMint),
        artifactMint: new anchor_1.web3.PublicKey(config.artifactMint),
        stakingPermissivenessToUse: config.stakingPermissivenessToUse || null,
    }, {
        artifactClass: new anchor_1.web3.PublicKey(config.artifactClass),
        artifact: new anchor_1.web3.PublicKey(config.artifact),
        stakingAccount: new anchor_1.web3.PublicKey(config.stakingAccount),
        stakingMint: new anchor_1.web3.PublicKey(config.stakingMint),
        parentClassAccount: config.parentClassAccount
            ? new anchor_1.web3.PublicKey(config.parentClassAccount)
            : null,
        parentClassMint: config.parentClassMint
            ? new anchor_1.web3.PublicKey(config.parentClassMint)
            : null,
        parentClass: config.parentClass
            ? new anchor_1.web3.PublicKey(config.parentClass)
            : null,
        metadataUpdateAuthority: config.metadataUpdateAuthority
            ? new anchor_1.web3.PublicKey(config.metadataUpdateAuthority)
            : null,
    });
    loglevel_1.default.setLevel("info");
    loglevel_1.default.info(`Transaction signature: ${txid}`);
});
sol_command_1.CLI.programCommandWithConfig("end_artifact_stake_cooldown", async (config, options, _files) => {
    const { keypair, env, rpcUrl } = options;
    const stakingProgram = await raindrops_1.StakingProgram.getProgramWithWalletKeyPair(raindrops_1.StakingProgram, await sol_command_1.Wallet.loadWalletKey(keypair), env, rpcUrl);
    const { txid } = await stakingProgram.endArtifactStakeCooldown({
        classIndex: new anchor_1.BN(config.classIndex),
        index: new anchor_1.BN(config.index),
        stakingIndex: new anchor_1.BN(config.stakingIndex),
        artifactClassMint: new anchor_1.web3.PublicKey(config.artifactClassMint),
        artifactMint: new anchor_1.web3.PublicKey(config.artifactMint),
    }, {
        artifactClass: new anchor_1.web3.PublicKey(config.artifactClass),
        artifact: new anchor_1.web3.PublicKey(config.artifact),
        stakingAccount: new anchor_1.web3.PublicKey(config.stakingAccount),
        stakingMint: new anchor_1.web3.PublicKey(config.stakingMint),
    });
    loglevel_1.default.setLevel("info");
    loglevel_1.default.info(`Transaction signature: ${txid}`);
});
sol_command_1.CLI.Program.parseAsync(process.argv);
