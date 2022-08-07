#!/usr/bin/env ts-node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const commander_1 = require("commander");
const loglevel_1 = __importDefault(require("loglevel"));
const bn_js_1 = __importDefault(require("bn.js"));
const anchor_1 = require("@project-serum/anchor");
const sol_command_1 = require("@raindrop-studios/sol-command");
const main_1 = require("../../lib/src/main");
const { loadWalletKey } = sol_command_1.Wallet;
const { PDA } = main_1.Utils;
var MatchesState = main_1.State.Matches;
programCommand("create_match")
    .requiredOption("-cp, --config-path <string>", "JSON file with match settings")
    .action(async (files, cmd) => {
    const { keypair, env, configPath, rpcUrl } = cmd.opts();
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await (0, main_1.getMatchesProgram)(walletKeyPair, env, rpcUrl);
    if (configPath === undefined) {
        throw new Error("The configPath is undefined");
    }
    const configString = fs.readFileSync(configPath);
    //@ts-ignore
    const config = JSON.parse(configString);
    await anchorProgram.createMatch(walletKeyPair, {
        winOracle: config.winOracle
            ? new anchor_1.web3.PublicKey(config.winOracle)
            : (await PDA.getOracle(new anchor_1.web3.PublicKey(config.oracleState.seed), config.oracleState.authority
                ? new anchor_1.web3.PublicKey(config.oracleState.authority)
                : walletKeyPair.publicKey))[0],
        matchState: config.matchState || { draft: true },
        tokenEntryValidationRoot: null,
        tokenEntryValidation: config.tokenEntryValidation
            ? config.tokenEntryValidation
            : null,
        winOracleCooldown: new bn_js_1.default(config.winOracleCooldown || 0),
        authority: config.authority
            ? new anchor_1.web3.PublicKey(config.authority)
            : walletKeyPair.publicKey,
        space: config.space ? new bn_js_1.default(config.space) : new bn_js_1.default(150),
        leaveAllowed: config.leaveAllowed,
        joinAllowedDuringStart: config.joinAllowedDuringStart,
        minimumAllowedEntryTime: config.minimumAllowedEntryTime
            ? new bn_js_1.default(config.minimumAllowedEntryTime)
            : null,
    }, {}, config.oracleState);
});
programCommand("update_match")
    .requiredOption("-cp, --config-path <string>", "JSON file with match settings")
    .action(async (files, cmd) => {
    const { keypair, env, configPath, rpcUrl } = cmd.opts();
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await (0, main_1.getMatchesProgram)(walletKeyPair, env, rpcUrl);
    if (configPath === undefined) {
        throw new Error("The configPath is undefined");
    }
    const configString = fs.readFileSync(configPath);
    //@ts-ignore
    const config = JSON.parse(configString);
    await anchorProgram.updateMatch(walletKeyPair, {
        matchState: config.matchState || { draft: true },
        tokenEntryValidationRoot: null,
        tokenEntryValidation: config.tokenEntryValidation
            ? config.tokenEntryValidation
            : null,
        winOracleCooldown: new bn_js_1.default(config.winOracleCooldown || 0),
        authority: config.authority
            ? new anchor_1.web3.PublicKey(config.authority)
            : walletKeyPair.publicKey,
        leaveAllowed: config.leaveAllowed,
        joinAllowedDuringStart: config.joinAllowedDuringStart,
        minimumAllowedEntryTime: config.minimumAllowedEntryTime
            ? new bn_js_1.default(config.minimumAllowedEntryTime)
            : null,
    }, {
        winOracle: config.winOracle
            ? new anchor_1.web3.PublicKey(config.winOracle)
            : (await PDA.getOracle(new anchor_1.web3.PublicKey(config.oracleState.seed), config.oracleState.authority
                ? new anchor_1.web3.PublicKey(config.oracleState.authority)
                : walletKeyPair.publicKey))[0],
    }, {});
});
programCommand("join_match")
    .requiredOption("-cp, --config-path <string>", "JSON file with match settings")
    .option("-i, --index <string>", "Index of token you want to join with in settings file")
    .action(async (files, cmd) => {
    const { keypair, env, configPath, rpcUrl, index } = cmd.opts();
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await (0, main_1.getMatchesProgram)(walletKeyPair, env, rpcUrl);
    if (configPath === undefined) {
        throw new Error("The configPath is undefined");
    }
    const configString = fs.readFileSync(configPath);
    //@ts-ignore
    const config = JSON.parse(configString);
    const indices = [];
    if (index != undefined && index != null)
        indices.push(index);
    else
        config.tokensToJoin.forEach((_, i) => indices.push(i));
    let winOracle = config.winOracle
        ? new anchor_1.web3.PublicKey(config.winOracle)
        : (await PDA.getOracle(new anchor_1.web3.PublicKey(config.oracleState.seed), config.oracleState.authority
            ? new anchor_1.web3.PublicKey(config.oracleState.authority)
            : walletKeyPair.publicKey))[0];
    const matchInstance = await anchorProgram.fetchMatch(winOracle);
    const oracleInstance = await anchorProgram.fetchOracle(winOracle);
    const u = matchInstance.object;
    const o = oracleInstance.object;
    loglevel_1.default.info("lastplay:", u.lastplay.toNumber());
    loglevel_1.default.info("winningnow:", u.winning.toBase58());
    loglevel_1.default.info("win at:", u.lastthousand.toNumber());
    loglevel_1.default.info('seconds til next winna can be chosen', parseInt((u.lastthousand.toNumber() - new Date().getTime() / 1000).toString()));
    const winning = matchInstance.object.winning;
    for (let i = 0; i < indices.length; i++) {
        const setup = config.tokensToJoin[indices[i]];
        await anchorProgram.joinMatch(walletKeyPair, {
            amount: new bn_js_1.default(setup.amount),
            tokenEntryValidation: null,
            tokenEntryValidationProof: null,
        }, {
            tokenMint: new anchor_1.web3.PublicKey(setup.mint),
            sourceTokenAccount: null,
            tokenTransferAuthority: null,
            validationProgram: setup.validationProgram
                ? new anchor_1.web3.PublicKey(setup.validationProgram)
                : null,
        }, {
            winOracle: config.winOracle
                ? new anchor_1.web3.PublicKey(config.winOracle)
                : (await PDA.getOracle(new anchor_1.web3.PublicKey(config.oracleState.seed), config.oracleState.authority
                    ? new anchor_1.web3.PublicKey(config.oracleState.authority)
                    : walletKeyPair.publicKey))[0],
            sourceType: setup.sourceType,
            index: setup.index != null && setup.index != undefined
                ? new bn_js_1.default(setup.index)
                : null,
        });
    }
});
programCommand("leave_match")
    .requiredOption("-cp, --config-path <string>", "JSON file with match settings")
    .option("-i, --index <string>", "Index of token you want to join with in settings file")
    .action(async (files, cmd) => {
    const { keypair, env, configPath, rpcUrl, index } = cmd.opts();
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await (0, main_1.getMatchesProgram)(walletKeyPair, env, rpcUrl);
    if (configPath === undefined) {
        throw new Error("The configPath is undefined");
    }
    const configString = fs.readFileSync(configPath);
    //@ts-ignore
    const config = JSON.parse(configString);
    const indices = [];
    if (index != undefined && index != null)
        indices.push(index);
    else
        config.tokensToJoin.forEach((_, i) => indices.push(i));
    for (let i = 0; i < indices.length; i++) {
        const setup = config.tokensToJoin[indices[i]];
        await anchorProgram.leaveMatch({
            amount: new bn_js_1.default(setup.amount),
        }, {
            tokenMint: new anchor_1.web3.PublicKey(setup.mint),
            receiver: walletKeyPair.publicKey,
        }, {
            winOracle: config.winOracle
                ? new anchor_1.web3.PublicKey(config.winOracle)
                : (await PDA.getOracle(new anchor_1.web3.PublicKey(config.oracleState.seed), config.oracleState.authority
                    ? new anchor_1.web3.PublicKey(config.oracleState.authority)
                    : walletKeyPair.publicKey))[0],
        });
    }
});
programCommand("update_match_from_oracle")
    .requiredOption("-cp, --config-path <string>", "JSON file with match settings")
    .action(async (files, cmd) => {
    const { keypair, env, configPath, rpcUrl } = cmd.opts();
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await (0, main_1.getMatchesProgram)(walletKeyPair, env, rpcUrl);
    if (configPath === undefined) {
        throw new Error("The configPath is undefined");
    }
    const configString = fs.readFileSync(configPath);
    //@ts-ignore
    const config = JSON.parse(configString);
    await anchorProgram.updateMatchFromOracle(walletKeyPair, {}, {
        winOracle: config.winOracle
            ? new anchor_1.web3.PublicKey(config.winOracle)
            : (await PDA.getOracle(new anchor_1.web3.PublicKey(config.oracleState.seed), config.oracleState.authority
                ? new anchor_1.web3.PublicKey(config.oracleState.authority)
                : walletKeyPair.publicKey))[0],
    }, {});
});
programCommand("disburse_tokens_by_oracle")
    .requiredOption("-cp, --config-path <string>", "JSON file with match settings")
    .action(async (files, cmd) => {
    const { keypair, env, configPath, rpcUrl } = cmd.opts();
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await (0, main_1.getMatchesProgram)(walletKeyPair, env, rpcUrl);
    if (configPath === undefined) {
        throw new Error("The configPath is undefined");
    }
    const configString = fs.readFileSync(configPath);
    //@ts-ignore
    const config = JSON.parse(configString);
    const winOracle = config.winOracle
        ? new anchor_1.web3.PublicKey(config.winOracle)
        : (await PDA.getOracle(new anchor_1.web3.PublicKey(config.oracleState.seed), config.oracleState.authority
            ? new anchor_1.web3.PublicKey(config.oracleState.authority)
            : walletKeyPair.publicKey))[0];
    const oracleInstance = await anchorProgram.fetchOracle(winOracle);
    for (let i = 0; i < oracleInstance.object.tokenTransfers.length; i++) {
        const tfer = oracleInstance.object.tokenTransfers[i];
        await anchorProgram.disburseTokensByOracle({
            tokenDeltaProofInfo: null,
        }, {
            winOracle,
        }, {
            tokenDelta: tfer,
        });
    }
});
programCommand("drain_match")
    .requiredOption("-cp, --config-path <string>", "JSON file with match settings")
    .action(async (files, cmd) => {
    const { keypair, env, configPath, rpcUrl } = cmd.opts();
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await (0, main_1.getMatchesProgram)(walletKeyPair, env, rpcUrl);
    if (configPath === undefined) {
        throw new Error("The configPath is undefined");
    }
    const configString = fs.readFileSync(configPath);
    //@ts-ignore
    const config = JSON.parse(configString);
    await anchorProgram.drainMatch({}, {
        receiver: walletKeyPair.publicKey,
    }, {
        winOracle: config.winOracle
            ? new anchor_1.web3.PublicKey(config.winOracle)
            : (await PDA.getOracle(new anchor_1.web3.PublicKey(config.oracleState.seed), config.oracleState.authority
                ? new anchor_1.web3.PublicKey(config.oracleState.authority)
                : walletKeyPair.publicKey))[0],
    });
});
programCommand("drain_oracle")
    .requiredOption("-cp, --config-path <string>", "JSON file with match settings")
    .action(async (files, cmd) => {
    const { keypair, env, configPath, rpcUrl } = cmd.opts();
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await (0, main_1.getMatchesProgram)(walletKeyPair, env, rpcUrl);
    if (configPath === undefined) {
        throw new Error("The configPath is undefined");
    }
    const configString = fs.readFileSync(configPath);
    //@ts-ignore
    const config = JSON.parse(configString);
    await anchorProgram.drainOracle({
        seed: config.oracleState.seed,
        authority: config.oracleState.authority
            ? new anchor_1.web3.PublicKey(config.oracleState.authority)
            : walletKeyPair.publicKey,
    }, {
        receiver: walletKeyPair.publicKey,
    });
});
programCommand("create_or_update_oracle")
    .requiredOption("-cp, --config-path <string>", "JSON file with match settings")
    .action(async (files, cmd) => {
    const { keypair, env, configPath, rpcUrl } = cmd.opts();
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await (0, main_1.getMatchesProgram)(walletKeyPair, env, rpcUrl);
    if (configPath === undefined) {
        throw new Error("The configPath is undefined");
    }
    const configString = fs.readFileSync(configPath);
    //@ts-ignore
    const config = JSON.parse(configString);
    await anchorProgram.createOrUpdateOracle(walletKeyPair, {
        seed: config.oracleState.seed,
        authority: config.oracleState.authority
            ? new anchor_1.web3.PublicKey(config.oracleState.authority)
            : walletKeyPair.publicKey,
        tokenTransferRoot: config.oracleState.tokenTransferRoot,
        tokenTransfers: config.oracleState.tokenTransfers,
        space: config.space ? new bn_js_1.default(config.space) : new bn_js_1.default(150),
        finalized: config.oracleState.finalized,
    });
});
programCommand("show_match")
    .option("-cp, --config-path <string>", "JSON file with match settings")
    .option("-o, --oracle <string>", "Oracle ID")
    .action(async (files, cmd) => {
    const { keypair, env, configPath, rpcUrl, oracle } = cmd.opts();
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await (0, main_1.getMatchesProgram)(walletKeyPair, env, rpcUrl);
    let actualOracle = oracle ? new anchor_1.web3.PublicKey(oracle) : null;
    if (configPath !== undefined) {
        const configString = fs.readFileSync(configPath);
        //@ts-ignore
        const config = JSON.parse(configString);
        actualOracle = config.winOracle
            ? new anchor_1.web3.PublicKey(config.winOracle)
            : (await PDA.getOracle(new anchor_1.web3.PublicKey(config.oracleState.seed), config.oracleState.authority
                ? new anchor_1.web3.PublicKey(config.oracleState.authority)
                : walletKeyPair.publicKey))[0];
    }
    const matchInstance = await anchorProgram.fetchMatch(actualOracle);
    const oracleInstance = await anchorProgram.fetchOracle(actualOracle);
    const u = matchInstance.object;
    const o = oracleInstance.object;
    loglevel_1.default.setLevel("info");
    loglevel_1.default.info("Match ", matchInstance.key.toBase58());
    loglevel_1.default.info("Namespaces:", u.namespaces
        ? u.namespaces.map((u) => {
            if (!u.namespace.equals(anchor_1.web3.SystemProgram.programId))
                loglevel_1.default.info(`--> ${main_1.State.InheritanceState[u.inherited]} ${u.namespace.toBase58()} Indexed: ${u.indexed}`);
        })
        : "Not Set");
    loglevel_1.default.info("State:", Object.keys(u.state)[0]);
    loglevel_1.default.info("Win Oracle:", actualOracle);
    loglevel_1.default.info("Oracle Cooldown:", u.winOracleCooldown.toNumber());
    loglevel_1.default.info("Last Oracle Check:", u.lastOracleCheck.toNumber() > 0
        ? new Date(u.lastOracleCheck.toNumber() * 1000)
        : "Never Checked");
    loglevel_1.default.info("Oracle Finalized:", o.finalized);
    loglevel_1.default.info("Oracle Token Transfer Root:", o.tokenTransferRoot ? o.tokenTransferRoot.root.toBase58() : "Unset");
    loglevel_1.default.info("Oracle Token Transfers:");
    if (o.tokenTransfers) {
        o.tokenTransfers.map((k) => {
            loglevel_1.default.info("--> From:", k.from.toBase58());
            loglevel_1.default.info("--> To:", k.to ? k.to.toBase58() : "Burn");
            loglevel_1.default.info("--> Transfer Type:", MatchesState.TokenTransferType[k.tokenTransferType]);
            loglevel_1.default.info("--> Mint:", k.mint.toBase58());
            loglevel_1.default.info("--> Amount:", k.amount.toNumber());
        });
    }
    loglevel_1.default.info("Authority:", u.authority.toBase58());
    loglevel_1.default.info("Leaving Match Allowed?:", u.leaveAllowed ? "Yes" : "No");
    loglevel_1.default.info("Joining Match Allowed?:", u.joinAllowedDuringStart ? "Yes" : "No");
    loglevel_1.default.info("Minimum Allowed Entry Time:", u.minimumAllowedEntryTime
        ? new Date(u.minimumAllowedEntryTime.toNumber() * 1000)
        : "Unset");
    loglevel_1.default.info("Current token transfer index:", u.currentTokenTransferIndex.toNumber());
    loglevel_1.default.info("Token Types Added:", u.tokenTypesAdded.toNumber());
    loglevel_1.default.info("Token Types Removed:", u.tokenTypesRemoved.toNumber());
    loglevel_1.default.info("Token Entry Validations:");
    if (u.tokenEntryValidation) {
        u.tokenEntryValidation.map((k) => {
            loglevel_1.default.info("--> Filter:");
            if (k.filter.mint)
                loglevel_1.default.info("----> Mint:", k.filter.mint.mint.toBase58());
            if (k.filter.namespace)
                loglevel_1.default.info("----> Namespace:", k.filter.namespace.namespace.toBase58());
            if (k.filter.parent)
                loglevel_1.default.info("----> Parent:", k.filter.parent.key.toBase58());
            if (k.filter.all)
                loglevel_1.default.info("----> All allowed");
            if (k.filter.none)
                loglevel_1.default.info("----> None allowed");
            loglevel_1.default.info("--> Blacklist?:", k.isBlacklist);
            loglevel_1.default.info("--> Validation:", k.validation
                ? `Call ${k.validation.key.toBase58()} with ${k.validation.code}`
                : "Not Set");
        });
    }
    loglevel_1.default.info("Token Entry Validation Root:", u.tokenEntryValidationRoot
        ? u.tokenEntryValidationRoot.root.toBase58()
        : "Unset");
    loglevel_1.default.info("lastplay:", u.lastplay.toNumber());
    loglevel_1.default.info("winningnow:", u.winning.toBase58());
    loglevel_1.default.info("win at:", u.lastthousand.toNumber());
    loglevel_1.default.info('seconds from lastplay til next winna can be chosen', u.lastthousand.toNumber() - u.lastplay.toNumber());
});
function programCommand(name) {
    return commander_1.program
        .command(name)
        .option("-e, --env <string>", "Solana cluster env name", "devnet" //mainnet-beta, testnet, devnet
    )
        .requiredOption("-k, --keypair <path>", `Solana wallet location`)
        .option("-l, --log-level <string>", "log level", setLogLevel);
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setLogLevel(value, prev) {
    if (value === undefined || value === null) {
        return;
    }
    loglevel_1.default.info("setting the log value to: " + value);
    loglevel_1.default.setLevel(value);
}
commander_1.program.parse(process.argv);
