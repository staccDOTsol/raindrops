"use strict";
// @ts-nocheck
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemClassNotFoundError = exports.getItemProgram = exports.ItemClassWrapper = exports.ItemProgram = void 0;
const sol_kit_1 = require("@raindrop-studios/sol-kit");
const anchor_1 = require("@project-serum/anchor");
const programIds_1 = require("../constants/programIds");
const ItemInstruction = __importStar(require("../instructions/item"));
const item_1 = require("../state/item");
const pda_1 = require("../utils/pda");
const item_2 = require("../constants/item");
class ItemProgram extends sol_kit_1.Program.Program {
    constructor() {
        super();
        this.PROGRAM_ID = programIds_1.ITEM_ID;
        this.instruction = new ItemInstruction.Instruction({ program: this });
    }
    async fetchItemClass(mint, index) {
        let itemClass = (await (0, pda_1.getItemPDA)(mint, index))[0];
        // Need a manual deserializer due to our hack we had to do.
        let itemClassObj = await this.client.provider.connection.getAccountInfo(itemClass);
        if (!(itemClassObj === null || itemClassObj === void 0 ? void 0 : itemClassObj.data)) {
            return Promise.resolve(null);
        }
        const ic = (0, item_1.decodeItemClass)(itemClassObj.data);
        return new ItemClassWrapper({
            program: this,
            key: itemClass,
            data: itemClassObj.data,
            object: ic,
        });
    }
    async createItemClass(args, accounts, additionalArgs, options) {
        const instruction = await this.instruction.createItemClass(args, accounts, additionalArgs);
        return this.sendWithRetry(instruction, [], options);
    }
    async updateItemClass(args, accounts, additionalArgs, options) {
        const instruction = await this.instruction.updateItemClass(args, accounts, additionalArgs);
        return this.sendWithRetry(instruction, [], options);
    }
    async createItemEscrow(args, accounts, additionalArgs, options) {
        const instruction = await this.instruction.createItemEscrow(args, accounts, additionalArgs);
        return this.sendWithRetry(instruction, [], options);
    }
    async completeItemEscrowBuildPhase(args, accounts, additionalArgs, options) {
        const instruction = await this.instruction.completeItemEscrowBuildPhase(args, accounts, additionalArgs);
        return this.sendWithRetry(instruction, [], options);
    }
    async deactivateItemEscrow(args, accounts, additionalArgs, options) {
        const instruction = await this.instruction.deactivateItemEscrow(args, accounts, additionalArgs);
        return this.sendWithRetry(instruction, [], options);
    }
    async updateValidForUseIfWarmupPassed(args, accounts = {}, additionalArgs = {}, options) {
        const instruction = await this.instruction.updateValidForUseIfWarmupPassed(args, accounts, additionalArgs);
        return this.sendWithRetry(instruction, [], options);
    }
    async addCraftItemToEscrow(args, accounts, additionalArgs, options) {
        const signers = [];
        const craftItemTransferAuthority = anchor_1.web3.Keypair.generate();
        signers.push(craftItemTransferAuthority);
        const instructions = await this.instruction.addCraftItemToEscrow(args, {
            ...accounts,
            craftItemTransferAuthority: craftItemTransferAuthority.publicKey,
        }, { additionalArgs });
        return this.sendWithRetry(instructions, signers, options);
    }
    async removeCraftItemFromEscrow(args, accounts, additionalArgs, options) {
        const instruction = await this.instruction.removeCraftItemFromEscrow(args, accounts, additionalArgs);
        return this.sendWithRetry(instruction, [], options);
    }
    async beginItemActivation(args, accounts, additionalArgs = {}, options) {
        const signers = [];
        const itemTransferAuthority = accounts.itemTransferAuthority || anchor_1.web3.Keypair.generate();
        if (accounts.itemAccount &&
            accounts.itemAccount.equals((await (0, pda_1.getAtaForMint)(accounts.itemMint, this.client.provider.wallet.publicKey))[0])) {
            signers.push(itemTransferAuthority);
        }
        const itemClass = await this.fetchItemClass(args.itemClassMint, args.classIndex);
        if (!itemClass) {
            throw new ItemClassNotFoundError("Please double check the specified itemClassMint and classIndex");
        }
        const instruction = await this.instruction.beginItemActivation({ ...args, itemClass }, { ...accounts, itemTransferAuthority }, additionalArgs);
        return this.sendWithRetry(instruction, signers, options);
    }
    async endItemActivation(args, accounts, additionalArgs = {}, options) {
        const instruction = await this.instruction.endItemActivation(args, accounts, additionalArgs);
        return this.sendWithRetry(instruction, [], options);
    }
    async drainItemEscrow(args, accounts, additionalArgs = {}, options) {
        const instruction = await this.instruction.drainItemEscrow(args, accounts, additionalArgs);
        return this.sendWithRetry(instruction, [], options);
    }
    async startItemEscrowBuildPhase(args, accounts, additionalArgs, options) {
        const instruction = await this.instruction.startItemEscrowBuildPhase(args, accounts, additionalArgs);
        return this.sendWithRetry(instruction, [], options);
    }
    async updateItem(args, accounts, additionalArgs, options) {
        const instruction = await this.instruction.updateItem(args, accounts, additionalArgs);
        return this.sendWithRetry(instruction, [], options);
    }
}
exports.ItemProgram = ItemProgram;
ItemProgram.PREFIX = item_2.PREFIX;
class ItemClassWrapper {
    constructor(args) {
        this.program = args.program;
        this.key = args.key;
        this.object = args.object;
        this.data = args.data;
    }
}
exports.ItemClassWrapper = ItemClassWrapper;
async function getItemProgram(anchorWallet, env, customRpcUrl) {
    if (anchorWallet.secretKey) {
        return ItemProgram.getProgramWithWalletKeyPair(ItemProgram, anchorWallet, env, customRpcUrl);
    }
    return ItemProgram.getProgramWithWallet(ItemProgram, anchorWallet, env, customRpcUrl);
}
exports.getItemProgram = getItemProgram;
class ItemClassNotFoundError extends Error {
    constructor(message) {
        super(`ItemClass Not Found: ${message}`);
        // Set the prototype explicitly
        // Ref: https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, Error.prototype);
    }
}
exports.ItemClassNotFoundError = ItemClassNotFoundError;
