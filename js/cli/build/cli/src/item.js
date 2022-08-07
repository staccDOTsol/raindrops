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
// @ts-nocheck
const fs = __importStar(require("fs"));
const loglevel_1 = __importDefault(require("loglevel"));
const commander_1 = require("commander");
const utils_1 = require("./utils");
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const anchor_1 = require("@project-serum/anchor");
const sol_command_1 = require("@raindrop-studios/sol-command");
const raindrops_1 = require("@raindrops-protocol/raindrops");
const { PDA } = raindrops_1.Utils;
const { loadWalletKey } = sol_command_1.Wallet;
var ItemState = raindrops_1.State.Item;
var InheritanceState = raindrops_1.State;
var PermissivenessType = raindrops_1.State;
(0, utils_1.programCommand)("create_item_class")
    .requiredOption("-cp, --config-path <string>", "JSON file with item class settings")
    .action(async (files, cmd) => {
    var _a, _b;
    const { keypair, env, configPath, rpcUrl } = cmd.opts();
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await (0, raindrops_1.getItemProgram)(walletKeyPair, env, rpcUrl);
    if (configPath === undefined) {
        throw new Error("The configPath is undefined");
    }
    const configString = fs.readFileSync(configPath);
    //@ts-ignore
    const config = JSON.parse(configString);
    if (config.data.config.components)
        config.data.config.components = config.data.config.components.map((c) => ({
            ...c,
            mint: new anchor_1.web3.PublicKey(c.mint),
            classIndex: new bn_js_1.default(c.classIndex),
            amount: new bn_js_1.default(c.amount),
        }));
    await anchorProgram.createItemClass({
        classIndex: new bn_js_1.default(config.index || 0),
        parentClassIndex: config.parent ? new bn_js_1.default(config.parent.index) : null,
        space: new bn_js_1.default(config.totalSpaceBytes),
        desiredNamespaceArraySize: config.namespaceRequirement,
        updatePermissivenessToUse: config.updatePermissivenessToUse,
        storeMint: config.storeMint,
        storeMetadataFields: config.storeMetadataFields,
        itemClassData: config.data,
        parentOfParentClassIndex: ((_a = config.parent) === null || _a === void 0 ? void 0 : _a.parent)
            ? config.parent.parent.index
            : null,
    }, {
        itemMint: new anchor_1.web3.PublicKey(config.mint),
        parent: config.parent
            ? (await PDA.getItemPDA(new anchor_1.web3.PublicKey(config.parent.mint), new bn_js_1.default(config.parent.index)))[0]
            : null,
        parentMint: config.parent
            ? new anchor_1.web3.PublicKey(config.parent.mint)
            : null,
        parentOfParentClassMint: ((_b = config.parent) === null || _b === void 0 ? void 0 : _b.parent)
            ? new anchor_1.web3.PublicKey(config.parent.parent.mint)
            : null,
        metadataUpdateAuthority: config.metadataUpdateAuthority
            ? new anchor_1.web3.PublicKey(config.metadataUpdateAuthority)
            : walletKeyPair.publicKey,
        parentUpdateAuthority: config.parent
            ? config.parent.metadataUpdateAuthority
            : null,
    }, {});
});
(0, utils_1.programCommand)("create_item_escrow")
    .requiredOption("-cp, --config-path <string>", "JSON file with item class settings")
    .action(async (files, cmd) => {
    const { keypair, env, configPath, rpcUrl } = cmd.opts();
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await (0, raindrops_1.getItemProgram)(walletKeyPair, env, rpcUrl);
    if (configPath === undefined) {
        throw new Error("The configPath is undefined");
    }
    const configString = fs.readFileSync(configPath);
    //@ts-ignore
    const config = JSON.parse(configString);
    await anchorProgram.createItemEscrow({
        classIndex: new bn_js_1.default(config.classIndex || 0),
        craftEscrowIndex: new bn_js_1.default(config.craftEscrowIndex || 0),
        componentScope: config.componentScope || "none",
        buildPermissivenessToUse: config.buildPermissivenessToUse,
        namespaceIndex: config.namespaceIndex
            ? new bn_js_1.default(config.namespaceIndex)
            : null,
        itemClassMint: new anchor_1.web3.PublicKey(config.itemClassMint),
        amountToMake: new bn_js_1.default(config.amountToMake || 1),
        parentClassIndex: config.parent ? new bn_js_1.default(config.parent.index) : null,
    }, {
        newItemMint: new anchor_1.web3.PublicKey(config.newItemMint),
        newItemToken: config.newItemToken
            ? new anchor_1.web3.PublicKey(config.newItemToken)
            : null,
        newItemTokenHolder: config.newItemTokenHolder
            ? new anchor_1.web3.PublicKey(config.config.newItemTokenHolder)
            : null,
        parentMint: config.parent
            ? new anchor_1.web3.PublicKey(config.parent.mint)
            : null,
        itemClassMint: new anchor_1.web3.PublicKey(config.itemClassMint),
        metadataUpdateAuthority: config.metadataUpdateAuthority
            ? new anchor_1.web3.PublicKey(config.metadataUpdateAuthority)
            : walletKeyPair.publicKey,
    }, {});
});
(0, utils_1.programCommand)("deactivate_item_escrow")
    .requiredOption("-cp, --config-path <string>", "JSON file with item class settings")
    .action(async (files, cmd) => {
    const { keypair, env, configPath, rpcUrl } = cmd.opts();
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await (0, raindrops_1.getItemProgram)(walletKeyPair, env, rpcUrl);
    if (configPath === undefined) {
        throw new Error("The configPath is undefined");
    }
    const configString = fs.readFileSync(configPath);
    //@ts-ignore
    const config = JSON.parse(configString);
    await anchorProgram.deactivateItemEscrow({
        classIndex: new bn_js_1.default(config.classIndex || 0),
        craftEscrowIndex: new bn_js_1.default(config.craftEscrowIndex || 0),
        componentScope: config.componentScope || "none",
        itemClassMint: new anchor_1.web3.PublicKey(config.itemClassMint),
        amountToMake: new bn_js_1.default(config.amountToMake || 1),
        newItemMint: new anchor_1.web3.PublicKey(config.newItemMint),
        newItemToken: config.newItemToken
            ? new anchor_1.web3.PublicKey(config.newItemToken)
            : null,
        parentClassIndex: config.parent ? new bn_js_1.default(config.parent.index) : null,
    }, {}, {});
});
(0, utils_1.programCommand)("add_craft_item_to_escrow")
    .requiredOption("-cp, --config-path <string>", "JSON file with item class settings")
    .requiredOption("-i, --index <string>", "component index to add (0 based)")
    .option("-a, --amount <string>", "How much to give")
    .action(async (files, cmd) => {
    const { keypair, env, configPath, rpcUrl, index, amount } = cmd.opts();
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await (0, raindrops_1.getItemProgram)(walletKeyPair, env, rpcUrl);
    if (configPath === undefined) {
        throw new Error("The configPath is undefined");
    }
    const configString = fs.readFileSync(configPath);
    //@ts-ignore
    const config = JSON.parse(configString);
    const actualIndex = parseInt(index);
    const itemClass = await anchorProgram.fetchItemClass(new anchor_1.web3.PublicKey(config.itemClassMint), new bn_js_1.default(config.classIndex));
    const component = itemClass.object.itemClassData.config.components.filter((c) => c.componentScope == config.componentScope)[actualIndex];
    const amountToContribute = amount
        ? parseInt(amount)
        : component.amount.toNumber();
    await anchorProgram.addCraftItemToEscrow({
        newItemMint: new anchor_1.web3.PublicKey(config.newItemMint),
        originator: config.originator
            ? new anchor_1.web3.PublicKey(config.originator)
            : walletKeyPair.publicKey,
        component: null,
        componentProof: null,
        craftUsageInfo: null,
        craftItemIndex: new bn_js_1.default(config.components[actualIndex].index || 0),
        craftEscrowIndex: new bn_js_1.default(config.craftEscrowIndex || 0),
        classIndex: new bn_js_1.default(config.classIndex || 0),
        componentScope: config.componentScope || "none",
        buildPermissivenessToUse: config.buildPermissivenessToUse,
        namespaceIndex: config.namespaceIndex
            ? new bn_js_1.default(config.namespaceIndex)
            : null,
        itemClassMint: new anchor_1.web3.PublicKey(config.itemClassMint),
        amountToMake: new bn_js_1.default(config.amountToMake || 1),
        amountToContributeFromThisContributor: new bn_js_1.default(amountToContribute),
        craftItemClassIndex: new bn_js_1.default(component.classIndex),
        craftItemClassMint: component.mint,
        parentClassIndex: config.parent ? new bn_js_1.default(config.parent.index) : null,
    }, {
        newItemToken: config.newItemToken
            ? new anchor_1.web3.PublicKey(config.newItemToken)
            : null,
        newItemTokenHolder: config.newItemTokenHolder
            ? new anchor_1.web3.PublicKey(config.config.newItemTokenHolder)
            : null,
        parentMint: config.parent
            ? new anchor_1.web3.PublicKey(config.parent.mint)
            : null,
        craftItemTokenMint: new anchor_1.web3.PublicKey(config.components[actualIndex].mint),
        itemClassMint: new anchor_1.web3.PublicKey(config.itemClassMint),
        metadataUpdateAuthority: config.metadataUpdateAuthority
            ? new anchor_1.web3.PublicKey(config.metadataUpdateAuthority)
            : walletKeyPair.publicKey,
    }, {});
});
(0, utils_1.programCommand)("remove_craft_item_from_escrow")
    .requiredOption("-cp, --config-path <string>", "JSON file with item class settings")
    .requiredOption("-i, --index <string>", "component index to add (0 based)")
    .option("-a, --amount <string>", "How much to remove")
    .action(async (files, cmd) => {
    const { keypair, env, configPath, rpcUrl, index, amount } = cmd.opts();
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await (0, raindrops_1.getItemProgram)(walletKeyPair, env, rpcUrl);
    if (configPath === undefined) {
        throw new Error("The configPath is undefined");
    }
    const configString = fs.readFileSync(configPath);
    //@ts-ignore
    const config = JSON.parse(configString);
    const actualIndex = parseInt(index);
    const itemClass = await anchorProgram.fetchItemClass(new anchor_1.web3.PublicKey(config.itemClassMint), new bn_js_1.default(config.classIndex));
    const component = itemClass.object.itemClassData.config.components.filter((c) => c.componentScope == config.componentScope)[actualIndex];
    const amountToContribute = amount
        ? parseInt(amount)
        : component.amount.toNumber();
    await anchorProgram.removeCraftItemFromEscrow({
        newItemMint: new anchor_1.web3.PublicKey(config.newItemMint),
        originator: config.originator
            ? new anchor_1.web3.PublicKey(config.originator)
            : walletKeyPair.publicKey,
        component: null,
        componentProof: null,
        craftItemIndex: new bn_js_1.default(config.components[actualIndex].index || 0),
        craftEscrowIndex: new bn_js_1.default(config.craftEscrowIndex || 0),
        classIndex: new bn_js_1.default(config.classIndex || 0),
        componentScope: config.componentScope || "none",
        buildPermissivenessToUse: config.buildPermissivenessToUse,
        namespaceIndex: config.namespaceIndex
            ? new bn_js_1.default(config.namespaceIndex)
            : null,
        itemClassMint: new anchor_1.web3.PublicKey(config.itemClassMint),
        amountToMake: new bn_js_1.default(config.amountToMake || 1),
        amountContributedFromThisContributor: new bn_js_1.default(amountToContribute),
        craftItemClassMint: component.mint,
        craftItemClassIndex: component.classIndex,
        craftItemTokenMint: new anchor_1.web3.PublicKey(config.components[actualIndex].mint),
        parentClassIndex: config.parent ? new bn_js_1.default(config.parent.index) : null,
    }, {
        newItemToken: config.newItemToken
            ? new anchor_1.web3.PublicKey(config.newItemToken)
            : null,
        newItemTokenHolder: config.newItemTokenHolder
            ? new anchor_1.web3.PublicKey(config.config.newItemTokenHolder)
            : null,
        parentMint: config.parent
            ? new anchor_1.web3.PublicKey(config.parent.mint)
            : null,
        itemClassMint: new anchor_1.web3.PublicKey(config.itemClassMint),
        metadataUpdateAuthority: config.metadataUpdateAuthority
            ? new anchor_1.web3.PublicKey(config.metadataUpdateAuthority)
            : walletKeyPair.publicKey,
    }, {
        parentClassIndex: config.parent ? new bn_js_1.default(config.parent.index) : null,
    });
});
(0, utils_1.programCommand)("start_item_escrow_build_phase")
    .requiredOption("-cp, --config-path <string>", "JSON file with item class settings")
    .action(async (files, cmd) => {
    const { keypair, env, configPath, rpcUrl } = cmd.opts();
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await (0, raindrops_1.getItemProgram)(walletKeyPair, env, rpcUrl);
    if (configPath === undefined) {
        throw new Error("The configPath is undefined");
    }
    const configString = fs.readFileSync(configPath);
    //@ts-ignore
    const config = JSON.parse(configString);
    await anchorProgram.startItemEscrowBuildPhase({
        classIndex: new bn_js_1.default(config.classIndex || 0),
        craftEscrowIndex: new bn_js_1.default(config.craftEscrowIndex || 0),
        componentScope: config.componentScope || "none",
        buildPermissivenessToUse: config.buildPermissivenessToUse,
        newItemMint: new anchor_1.web3.PublicKey(config.newItemMint),
        itemClassMint: new anchor_1.web3.PublicKey(config.itemClassMint),
        amountToMake: new bn_js_1.default(config.amountToMake || 1),
        originator: config.originator
            ? new anchor_1.web3.PublicKey(config.originator)
            : walletKeyPair.publicKey,
        totalSteps: config.merkleInfo ? config.merkleInfo.totalSteps : null,
        endNodeProof: config.merkleInfo
            ? new anchor_1.web3.PublicKey(config.merkleInfo.endNodeProof)
            : null,
        parentClassIndex: config.parent ? new bn_js_1.default(config.parent.index) : null,
    }, {
        newItemToken: config.newItemToken
            ? new anchor_1.web3.PublicKey(config.newItemToken)
            : null,
        newItemTokenHolder: config.newItemTokenHolder
            ? new anchor_1.web3.PublicKey(config.config.newItemTokenHolder)
            : null,
        parentMint: config.parent
            ? new anchor_1.web3.PublicKey(config.parent.mint)
            : null,
        itemClassMint: new anchor_1.web3.PublicKey(config.itemClassMint),
        metadataUpdateAuthority: config.metadataUpdateAuthority
            ? new anchor_1.web3.PublicKey(config.metadataUpdateAuthority)
            : walletKeyPair.publicKey,
    }, {});
});
(0, utils_1.programCommand)("complete_item_escrow_build_phase")
    .requiredOption("-cp, --config-path <string>", "JSON file with item class settings")
    .action(async (files, cmd) => {
    const { keypair, env, configPath, rpcUrl } = cmd.opts();
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await (0, raindrops_1.getItemProgram)(walletKeyPair, env, rpcUrl);
    if (configPath === undefined) {
        throw new Error("The configPath is undefined");
    }
    const configString = fs.readFileSync(configPath);
    //@ts-ignore
    const config = JSON.parse(configString);
    await anchorProgram.completeItemEscrowBuildPhase({
        classIndex: new bn_js_1.default(config.classIndex || 0),
        newItemIndex: new bn_js_1.default(config.newItemIndex || 0),
        craftEscrowIndex: new bn_js_1.default(config.craftEscrowIndex || 0),
        componentScope: config.componentScope || "none",
        buildPermissivenessToUse: config.buildPermissivenessToUse,
        itemClassMint: new anchor_1.web3.PublicKey(config.itemClassMint),
        amountToMake: new bn_js_1.default(config.amountToMake || 1),
        originator: config.originator
            ? new anchor_1.web3.PublicKey(config.originator)
            : walletKeyPair.publicKey,
        space: new bn_js_1.default(config.totalSpaceBytes),
        storeMetadataFields: !!config.storeMetadataFields,
        storeMint: !!config.storeMint,
        parentClassIndex: config.parent ? new bn_js_1.default(config.parent.index) : null,
    }, {
        newItemMint: new anchor_1.web3.PublicKey(config.newItemMint),
        newItemToken: config.newItemToken
            ? new anchor_1.web3.PublicKey(config.newItemToken)
            : null,
        newItemTokenHolder: config.newItemTokenHolder
            ? new anchor_1.web3.PublicKey(config.config.newItemTokenHolder)
            : null,
        parentMint: config.parent
            ? new anchor_1.web3.PublicKey(config.parent.mint)
            : null,
        itemClassMint: new anchor_1.web3.PublicKey(config.itemClassMint),
        metadataUpdateAuthority: config.metadataUpdateAuthority
            ? new anchor_1.web3.PublicKey(config.metadataUpdateAuthority)
            : walletKeyPair.publicKey,
    }, {});
});
(0, utils_1.programCommand)("drain_item_escrow")
    .requiredOption("-cp, --config-path <string>", "JSON file with item class settings")
    .action(async (files, cmd) => {
    const { keypair, env, configPath, rpcUrl } = cmd.opts();
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await (0, raindrops_1.getItemProgram)(walletKeyPair, env, rpcUrl);
    if (configPath === undefined) {
        throw new Error("The configPath is undefined");
    }
    const configString = fs.readFileSync(configPath);
    //@ts-ignore
    const config = JSON.parse(configString);
    await anchorProgram.drainItemEscrow({
        classIndex: new bn_js_1.default(config.classIndex || 0),
        craftEscrowIndex: new bn_js_1.default(config.craftEscrowIndex || 0),
        componentScope: config.componentScope || "none",
        itemClassMint: new anchor_1.web3.PublicKey(config.itemClassMint),
        amountToMake: new bn_js_1.default(config.amountToMake || 1),
        newItemMint: new anchor_1.web3.PublicKey(config.newItemMint),
        newItemToken: config.newItemToken
            ? new anchor_1.web3.PublicKey(config.newItemToken)
            : null,
        parentClassIndex: config.parent ? new bn_js_1.default(config.parent.index) : null,
    }, {
        originator: config.originator
            ? new anchor_1.web3.PublicKey(config.originator)
            : walletKeyPair.publicKey,
    });
});
(0, utils_1.programCommand)("begin_item_activation")
    .requiredOption("-cp, --config-path <string>", "JSON file with item class settings")
    .option("-ta, --transfer-authority", "Keypair to use for tfer authority (if unset, defaults to you)")
    .action(async (files, cmd) => {
    const { keypair, env, configPath, rpcUrl, transferAuthority } = cmd.opts();
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await (0, raindrops_1.getItemProgram)(walletKeyPair, env, rpcUrl);
    if (configPath === undefined) {
        throw new Error("The configPath is undefined");
    }
    const configString = fs.readFileSync(configPath);
    //@ts-ignore
    const config = JSON.parse(configString);
    await anchorProgram.beginItemActivation({
        classIndex: new bn_js_1.default(config.classIndex || 0),
        itemClassMint: new anchor_1.web3.PublicKey(config.itemClassMint),
        amount: new bn_js_1.default(config.amount || 1),
        index: new bn_js_1.default(config.index),
        itemMarkerSpace: config.itemMarkerSpace,
        usageInfo: null,
        usageIndex: config.usageIndex,
        usagePermissivenessToUse: config.usagePermissivenessToUse,
    }, {
        itemMint: new anchor_1.web3.PublicKey(config.itemMint),
        itemAccount: config.itemAccount
            ? new anchor_1.web3.PublicKey(config.itemAccount)
            : (await PDA.getAtaForMint(new anchor_1.web3.PublicKey(config.itemMint), walletKeyPair.publicKey))[0],
        itemTransferAuthority: transferAuthority
            ? loadWalletKey(transferAuthority)
            : null,
        metadataUpdateAuthority: new anchor_1.web3.PublicKey(config.metadataUpdateAuthority),
    });
});
(0, utils_1.programCommand)("end_item_activation")
    .requiredOption("-cp, --config-path <string>", "JSON file with item class settings")
    .action(async (files, cmd) => {
    const { keypair, env, configPath, rpcUrl, transferAuthority } = cmd.opts();
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await (0, raindrops_1.getItemProgram)(walletKeyPair, env, rpcUrl);
    if (configPath === undefined) {
        throw new Error("The configPath is undefined");
    }
    const configString = fs.readFileSync(configPath);
    //@ts-ignore
    const config = JSON.parse(configString);
    await anchorProgram.endItemActivation({
        classIndex: new bn_js_1.default(config.classIndex || 0),
        itemClassMint: new anchor_1.web3.PublicKey(config.itemClassMint),
        amount: new bn_js_1.default(config.amount || 1),
        index: new bn_js_1.default(config.index),
        usageIndex: config.usageIndex,
        itemMint: new anchor_1.web3.PublicKey(config.itemMint),
        usageProof: null,
        usage: null,
        usagePermissivenessToUse: config.usagePermissivenessToUse,
    }, {
        originator: config.originator || walletKeyPair.publicKey,
        metadataUpdateAuthority: new anchor_1.web3.PublicKey(config.metadataUpdateAuthority),
    });
});
(0, utils_1.programCommand)("update_valid_for_use_if_warmup_passed")
    .requiredOption("-cp, --config-path <string>", "JSON file with item class settings")
    .action(async (files, cmd) => {
    const { keypair, env, configPath, rpcUrl, transferAuthority } = cmd.opts();
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await (0, raindrops_1.getItemProgram)(walletKeyPair, env, rpcUrl);
    if (configPath === undefined) {
        throw new Error("The configPath is undefined");
    }
    const configString = fs.readFileSync(configPath);
    //@ts-ignore
    const config = JSON.parse(configString);
    await anchorProgram.updateValidForUseIfWarmupPassed({
        classIndex: new bn_js_1.default(config.classIndex || 0),
        itemClassMint: new anchor_1.web3.PublicKey(config.itemClassMint),
        amount: new bn_js_1.default(config.amount || 1),
        index: new bn_js_1.default(config.index),
        usageIndex: config.usageIndex,
        itemMint: new anchor_1.web3.PublicKey(config.itemMint),
        usageProof: null,
        usage: null,
    });
});
(0, utils_1.programCommand)("show_item_build")
    .option("-cp, --config-path <string>", "JSON file with item class settings")
    .action(async (files, cmd) => {
    const { keypair, env, configPath, rpcUrl } = cmd.opts();
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await (0, raindrops_1.getItemProgram)(walletKeyPair, env, rpcUrl);
    const configString = fs.readFileSync(configPath);
    //@ts-ignore
    const config = JSON.parse(configString);
    const itemClassMint = new anchor_1.web3.PublicKey(config.itemClassMint);
    const classIndex = new bn_js_1.default(config.classIndex);
    const newItemMint = new anchor_1.web3.PublicKey(config.newItemMint);
    const craftEscrowIndex = new bn_js_1.default(config.craftEscrowIndex);
    const itemEscrowKey = (await PDA.getItemEscrow({
        itemClassMint,
        classIndex,
        craftEscrowIndex,
        newItemMint,
        newItemToken: config.newItemToken
            ? new anchor_1.web3.PublicKey(config.newItemToken)
            : (await PDA.getAtaForMint(newItemMint, config.originator
                ? new anchor_1.web3.PublicKey(config.originator)
                : walletKeyPair.publicKey))[0],
        payer: config.originator
            ? new anchor_1.web3.PublicKey(config.originator)
            : walletKeyPair.publicKey,
        amountToMake: new bn_js_1.default(config.amountToMake),
        componentScope: config.componentScope || "none",
    }))[0];
    const itemEscrow = (await anchorProgram.client.account.itemEscrow.fetch(itemEscrowKey));
    loglevel_1.default.setLevel("info");
    loglevel_1.default.info("Build status:");
    loglevel_1.default.info("Deactivated:", itemEscrow.deactivated);
    loglevel_1.default.info("Build Step:", itemEscrow.step.toNumber());
    loglevel_1.default.info("Time to build:", itemEscrow.timeToBuild);
    loglevel_1.default.info("Build Began:", itemEscrow.buildBegan
        ? new Date(itemEscrow.buildBegan.toNumber() * 1000)
        : "Still assembling components");
});
(0, utils_1.programCommand)("show_item")
    .option("-m, --mint <string>", "If no json file, provide mint directly")
    .option("-i, --index <string>", "index. Normally is 0, defaults to 0. Allows for more than one item class def per nft.")
    .action(async (files, cmd) => {
    const { keypair, env, configPath, rpcUrl, mint, index } = cmd.opts();
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await (0, raindrops_1.getItemProgram)(walletKeyPair, env, rpcUrl);
    let actualMint, actualIndex;
    actualMint = new anchor_1.web3.PublicKey(mint);
    actualIndex = new bn_js_1.default(index);
    const itemKey = (await PDA.getItemPDA(actualMint, actualIndex))[0];
    const item = (await anchorProgram.client.account.item.fetch(itemKey));
    const itemParent = (await anchorProgram.client.account.itemClass.fetch(item.parent));
    loglevel_1.default.setLevel("info");
    loglevel_1.default.info("Item", itemKey.toBase58());
    loglevel_1.default.info("Namespaces:", item.namespaces
        ? item.namespaces.map((u) => {
            if (!u.namespace.equals(web3_js_1.SystemProgram.programId))
                loglevel_1.default.info(`--> ${InheritanceState[u.inherited]} ${u.namespace.toBase58()} Indexed: ${u.indexed}`);
        })
        : "Not Set");
    loglevel_1.default.info("Parent:", item.parent.toBase58(), "Index:", item.classIndex.toNumber(), "Mint:", itemParent.mint ? itemParent.mint.toBase58() : "Not cached on object");
    loglevel_1.default.info("Mint:", item.mint ? item.mint.toBase58() : "Not cached on object");
    loglevel_1.default.info("Metadata:", item.metadata ? item.metadata.toBase58() : "Not cached on object");
    loglevel_1.default.info("Edition:", item.edition ? item.edition.toBase58() : "Not cached on object");
    loglevel_1.default.info("tokensStaked:", item.tokensStaked.toNumber());
    loglevel_1.default.info("Item Data:");
    loglevel_1.default.info("--> Usage State Root:", item.data.usageStateRoot
        ? `(${InheritanceState[item.data.usageStateRoot.inherited]}) ${item.data.usageStateRoot.root.toBase58()}`
        : "Not Set");
    loglevel_1.default.info("--> Usage States:");
    if (item.data.usageStates)
        item.data.usageStates.map((u) => {
            loglevel_1.default.info("----> Index:", u.index);
            loglevel_1.default.info("----> # Times Used:", u.uses);
            loglevel_1.default.info("----> Activated At:", u.activatedAt
                ? new Date(u.activatedAt.toNumber() * 1000)
                : "Not Active");
        });
});
(0, utils_1.programCommand)("show_item_class")
    .option("-cp, --config-path <string>", "JSON file with item class settings")
    .option("-m, --mint <string>", "If no json file, provide mint directly")
    .option("-i, --index <string>", "Class index. Normally is 0, defaults to 0. Allows for more than one item class def per nft.")
    .action(async (files, cmd) => {
    const { keypair, env, configPath, rpcUrl, mint, index } = cmd.opts();
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await (0, raindrops_1.getItemProgram)(walletKeyPair, env, rpcUrl);
    let actualMint, actualIndex;
    if (configPath === undefined) {
        actualMint = new anchor_1.web3.PublicKey(mint);
        actualIndex = new bn_js_1.default(index);
    }
    else {
        const configString = fs.readFileSync(configPath);
        //@ts-ignore
        const config = JSON.parse(configString);
        actualMint = new anchor_1.web3.PublicKey(config.mint);
        actualIndex = new bn_js_1.default(config.index);
    }
    const itemClass = await anchorProgram.fetchItemClass(actualMint, actualIndex);
    loglevel_1.default.setLevel("info");
    if (!itemClass) {
        loglevel_1.default.info("Item Class not found with mint:", actualMint.toString());
        return;
    }
    loglevel_1.default.info("Item Class", itemClass.key.toBase58());
    loglevel_1.default.info("Namespaces:", itemClass.object.namespaces
        ? itemClass.object.namespaces.map((u) => {
            if (!u.namespace.equals(web3_js_1.SystemProgram.programId))
                loglevel_1.default.info(`--> ${InheritanceState[u.inherited]} ${u.namespace.toBase58()} Indexed: ${u.indexed}`);
        })
        : "Not Set");
    loglevel_1.default.info("Parent:", itemClass.object.parent ? itemClass.object.parent.toBase58() : "None");
    loglevel_1.default.info("Mint:", (itemClass.object.mint || actualMint).toBase58());
    loglevel_1.default.info("Metadata:", (itemClass.object.metadata || (await PDA.getMetadata(actualMint))).toBase58());
    loglevel_1.default.info("Edition:", (itemClass.object.edition || (await PDA.getEdition(actualMint))).toBase58());
    loglevel_1.default.info("Existing Children:", itemClass.object.existingChildren.toNumber());
    const icd = itemClass.object.itemClassData;
    const settings = icd.settings;
    const config = icd.config;
    loglevel_1.default.info("Item Class Data:");
    loglevel_1.default.info("--> Item Class Settings:");
    loglevel_1.default.info("----> Can use free build:", settings.freeBuild ? settings.freeBuild.boolean : "Not Set");
    loglevel_1.default.info("----> Children must be editions:", settings.childrenMustBeEditions
        ? settings.childrenMustBeEditions.boolean
        : "Not Set");
    loglevel_1.default.info("----> Builder must be holder:", settings.builderMustBeHolder
        ? settings.builderMustBeHolder.boolean
        : "Not Set");
    loglevel_1.default.info("----> Staking warm up duration:", settings.stakingWarmUpDuration
        ? settings.stakingWarmUpDuration.toNumber()
        : "Not Set");
    loglevel_1.default.info("----> Staking cooldown duration:", settings.stakingCooldownDuration
        ? settings.stakingCooldownDuration.toNumber()
        : "Not Set");
    loglevel_1.default.info("----> Update Permissiveness:");
    settings.updatePermissiveness
        ? settings.updatePermissiveness.forEach((u) => {
            loglevel_1.default.info(`------> ${InheritanceState[u.inherited]} ${PermissivenessType[u.permissivenessType]}`);
        })
        : "Default to Update Authority on Metadata";
    loglevel_1.default.info("----> Build Permissiveness:");
    settings.buildPermissiveness
        ? settings.buildPermissiveness.forEach((u) => {
            loglevel_1.default.info(`------> (${InheritanceState[u.inherited]}) ${PermissivenessType[u.permissivenessType]}`);
        })
        : "Not Set";
    loglevel_1.default.info("----> Staking Permissiveness:", settings.stakingPermissiveness
        ? settings.stakingPermissiveness.forEach((u) => {
            loglevel_1.default.info(`------> ${InheritanceState[u.inherited]} ${PermissivenessType[u.permissivenessType]}`);
        })
        : "Not Set");
    loglevel_1.default.info("----> Unstaking Permissiveness:");
    settings.unstakingPermissiveness
        ? settings.unstakingPermissiveness.forEach((u) => {
            loglevel_1.default.info(`------> ${InheritanceState[u.inherited]} ${PermissivenessType[u.permissivenessType]}`);
        })
        : "Not Set";
    loglevel_1.default.info("----> Child Update Propagation Permissiveness:");
    settings.childUpdatePropagationPermissiveness
        ? settings.childUpdatePropagationPermissiveness.map((u) => {
            loglevel_1.default.info(`------> ${InheritanceState[u.inherited]} ${ItemState.ChildUpdatePropagationPermissivenessType[u.childUpdatePropagationPermissivenessType]} - is overridable? ${u.overridable}`);
        })
        : "Not Set";
    loglevel_1.default.info("--> Item Class Config:");
    loglevel_1.default.info("----> Usage Root:", config.usageRoot
        ? `(${InheritanceState[config.usageRoot.inherited]}) ${config.usageRoot.root.toBase58()}`
        : "Not Set");
    loglevel_1.default.info("----> Usage State Root:", config.usageStateRoot
        ? `(${InheritanceState[config.usageStateRoot.inherited]}) ${config.usageStateRoot.root.toBase58()}`
        : "Not Set");
    loglevel_1.default.info("----> Component Root:", config.componentRoot
        ? `(${InheritanceState[config.componentRoot.inherited]}) ${config.componentRoot.root.toBase58()}`
        : "Not Set");
    loglevel_1.default.info("----> Components to Build:");
    if (config.components)
        config.components.forEach((c) => {
            loglevel_1.default.info("------> Mint:", c.mint.toBase58());
            loglevel_1.default.info("------> Amount:", c.amount.toNumber());
            loglevel_1.default.info("------> Time to Build:", c.timeToBuild ? c.timeToBuild.toNumber() : "None");
            loglevel_1.default.info("------> Component Scope:", c.componentScope);
            loglevel_1.default.info("------> Use Usage Index (to check cooldown status for crafting):", c.useUsageIndex);
            loglevel_1.default.info("------> Condition:", ItemState.ComponentCondition[c.condition]);
            loglevel_1.default.info("------> Inherited:", InheritanceState[c.inherited]);
        });
    loglevel_1.default.info("----> Usages:");
    if (config.usages)
        config.usages.forEach((u) => {
            loglevel_1.default.info("------> Index:", u.index);
            loglevel_1.default.info("------> Inherited:", InheritanceState[u.inherited]);
            loglevel_1.default.info("------> Do Not Pair With Self:", u.doNotPairWithSelf ? u.doNotPairWithSelf : "Not Set");
            loglevel_1.default.info("------> Do Not Pair With:", u.dnp
                ? u.dnp.map((d) => {
                    loglevel_1.default.info(`--------> (${InheritanceState[d.inherited]}) ${d.key.toBase58()}`);
                })
                : "Not Set");
            loglevel_1.default.info("------> Callback:", u.callback
                ? `Call ${u.callback.key.toBase58()} with ${u.callback.code}`
                : "Not Set");
            loglevel_1.default.info("------> Validation:", u.validation
                ? `Call ${u.validation.key.toBase58()} with ${u.validation.code}`
                : "Not Set");
            loglevel_1.default.info("------> Usage Permissiveness:");
            u.usagePermissiveness
                ? u.usagePermissiveness.map((d) => {
                    loglevel_1.default.info(`--------> ${PermissivenessType[d]}`);
                })
                : "Not Set";
            loglevel_1.default.info("------> Basic Item Effects:");
            if (u.basicItemEffects) {
                u.basicItemEffects.forEach((b) => {
                    loglevel_1.default.info("--------> Amount:", b.amount.toNumber());
                    loglevel_1.default.info("--------> Stat:", b.stat);
                    loglevel_1.default.info("--------> Item Effect Type:", ItemState.BasicItemEffectType[b.itemEffectType]);
                    loglevel_1.default.info("--------> Active Duration:", ItemState.BasicItemEffectType[b.itemEffectType]);
                    loglevel_1.default.info("--------> Staking Amount Numerator:", b.stakingAmountNumerator
                        ? b.stakingAmountNumerator.toNumber()
                        : "Not Set");
                    loglevel_1.default.info("--------> Staking Amount Divisor:", b.stakingAmountDivisor
                        ? b.stakingAmountDivisor.toNumber()
                        : "Not Set");
                    loglevel_1.default.info("--------> Staking Duration Numerator:", b.stakingDurationNumerator
                        ? b.stakingDurationNumerator.toNumber()
                        : "Not Set");
                    loglevel_1.default.info("--------> Staking Duration Divisor:", b.stakingDurationDivisor
                        ? b.stakingDurationDivisor.toNumber()
                        : "Not Set");
                    loglevel_1.default.info("--------> Max Uses:", b.maxUses ? b.maxUses.toNumber() : "Not Set");
                });
            }
            if (u.itemClassType.bodyPart) {
                const itemClassType = u.itemClassType.wearable;
                loglevel_1.default.info("------> Wearable:");
                loglevel_1.default.info("--------> Limit Per Part:", itemClassType.limitPerPart
                    ? itemClassType.limitPerPart.toNumber()
                    : "Not Set");
                loglevel_1.default.info("--------> Body Parts:", itemClassType.bodyPart.forEach((b) => {
                    loglevel_1.default.info(`----------> ${b}`);
                }));
            }
            else {
                const itemClassType = u.itemClassType
                    .consumable;
                loglevel_1.default.info("------> Consumable:");
                loglevel_1.default.info("--------> Max Uses:", itemClassType.maxUses ? itemClassType.maxUses.toNumber() : "Not Set");
                loglevel_1.default.info("--------> Max Players Per Use:", itemClassType.maxPlayersPerUse
                    ? itemClassType.maxPlayersPerUse.toNumber()
                    : "Not Set");
                loglevel_1.default.info("--------> Item Usage Type:", ItemState.ItemUsageType[itemClassType.itemUsageType.toString()]);
                loglevel_1.default.info("--------> Cooldown Duration:", itemClassType.cooldownDuration
                    ? itemClassType.cooldownDuration.toNumber()
                    : "Not Set");
                loglevel_1.default.info("--------> Warmup Duration:", itemClassType.warmupDuration
                    ? itemClassType.warmupDuration.toNumber()
                    : "Not Set");
            }
        });
});
(0, utils_1.programCommand)("update_item_class")
    .requiredOption("-cp, --config-path <string>", "JSON file with item class settings")
    .option("-iu, --inheritance-update", "Permissionlessly update inherited fields")
    .action(async (files, cmd) => {
    const { keypair, env, configPath, rpcUrl, inheritenceUpdate } = cmd.opts();
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await (0, raindrops_1.getItemProgram)(walletKeyPair, env, rpcUrl);
    if (configPath === undefined) {
        throw new Error("The configPath is undefined");
    }
    const configString = fs.readFileSync(configPath);
    //@ts-ignore
    const config = JSON.parse(configString);
    if (config.data.config.components)
        config.data.config.components = config.data.config.components.map((c) => ({
            ...c,
            mint: new anchor_1.web3.PublicKey(c.mint),
            classIndex: new bn_js_1.default(c.classIndex),
            amount: new bn_js_1.default(c.amount),
        }));
    await anchorProgram.updateItemClass({
        classIndex: new bn_js_1.default(config.index || 0),
        updatePermissivenessToUse: config.updatePermissivenessToUse,
        itemClassData: config.data,
        parentClassIndex: config.parent ? new bn_js_1.default(config.parent.index) : null,
    }, {
        itemMint: new anchor_1.web3.PublicKey(config.mint),
        parent: config.parent
            ? (await PDA.getItemPDA(new anchor_1.web3.PublicKey(config.parent.mint), new bn_js_1.default(config.parent.index)))[0]
            : null,
        parentMint: config.parent
            ? new anchor_1.web3.PublicKey(config.parent.mint)
            : null,
        metadataUpdateAuthority: config.metadataUpdateAuthority
            ? new anchor_1.web3.PublicKey(config.metadataUpdateAuthority)
            : walletKeyPair.publicKey,
    }, {
        permissionless: inheritenceUpdate,
    });
});
(0, utils_1.programCommand)("update_item")
    .requiredOption("-m, --item-mint <string>", "Item mint")
    .requiredOption("-cm, --item-class-mint <string>", "Item Class mint")
    .option("-i, --item-index <string>", "Item index")
    .action(async (files, cmd) => {
    const { keypair, env, rpcUrl, itemMint, itemIndex, itemClassMint } = cmd.opts();
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await (0, raindrops_1.getItemProgram)(walletKeyPair, env, rpcUrl);
    const item = (await PDA.getItemPDA(new anchor_1.web3.PublicKey(itemMint), new bn_js_1.default(itemIndex || 0)))[0];
    const itemObj = await anchorProgram.client.account.item.fetch(item);
    await anchorProgram.updateItem({
        index: new bn_js_1.default(itemIndex || 0),
        classIndex: itemObj.classIndex,
        itemMint: new anchor_1.web3.PublicKey(itemMint),
        itemClassMint: new anchor_1.web3.PublicKey(itemClassMint),
    }, {}, {});
});
commander_1.program.parse(process.argv);
