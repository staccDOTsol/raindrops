"use strict";
//  @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instruction = void 0;
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const sol_kit_1 = require("@raindrop-studios/sol-kit");
const pda_1 = require("../utils/pda");
const programIds_1 = require("../constants/programIds");
const common_1 = require("../contract/common");
const { generateRemainingAccountsForCreateClass, generateRemainingAccountsGivenPermissivenessToUse, } = common_1.ContractCommon;
const ITEM_CLASS_DATA_ARGS_CONVERT_TO_BNS = [
    "itemClassData.settings.stakingWarmUpDuration",
    "itemClassData.settings.stakingCooldownDuration",
    "itemClassData.config.components.[].timeToBuild",
    "itemClassData.config.usages.[].validation.code",
    "itemClassData.config.usages.[].callback.code",
    "itemClassData.config.usages.[].itemClassType.consumable.maxUses",
    "itemClassData.config.usages.[].itemClassType.consumable.maxPlayersPerUse",
    "itemClassData.config.usages.[].itemClassType.consumable.warmupDuration",
    "itemClassData.config.usages.[].itemClassType.consumable.cooldownDuration",
    "itemClassData.config.usages.[].itemClassType.wearable.limitPerPart",
];
const ITEM_CLASS_DATA_ARGS_CONVERT_TO_PUBKEYS = [
    "itemClassData.config.usages.[].validation.key",
    "itemClassData.config.usages.[].callback.key",
];
class Instruction extends sol_kit_1.Instruction {
    constructor(args) {
        super(args);
    }
    async createItemClass(args, accounts, additionalArgs) {
        const [itemClassKey, itemClassBump] = await (0, pda_1.getItemPDA)(accounts.itemMint, args.classIndex);
        sol_kit_1.InstructionUtils.convertNumbersToBNs(args, [
            "desiredNamespaceArraySize",
            ...ITEM_CLASS_DATA_ARGS_CONVERT_TO_BNS,
        ]);
        sol_kit_1.InstructionUtils.convertStringsToPublicKeys(args, ITEM_CLASS_DATA_ARGS_CONVERT_TO_PUBKEYS);
        const remainingAccounts = await generateRemainingAccountsForCreateClass({
            permissivenessToUse: args.updatePermissivenessToUse,
            tokenMint: accounts.itemMint,
            parentMint: accounts.parentMint,
            parent: accounts.parent,
            parentOfParentClassMint: accounts.parentOfParentClassMint,
            parentOfParentClassIndex: args.parentOfParentClassIndex,
            parentOfParentClass: args.parentOfParentClassIndex && accounts.parentOfParentClassMint
                ? (await (0, pda_1.getItemPDA)(accounts.parentOfParentClassMint, args.parentOfParentClassIndex))[0]
                : null,
            metadataUpdateAuthority: accounts.metadataUpdateAuthority,
            parentUpdateAuthority: accounts.parentUpdateAuthority,
            program: this.program,
        });
        return [
            await this.program.client.methods
                .createItemClass(args)
                .accounts({
                itemClass: itemClassKey,
                itemMint: accounts.itemMint,
                metadata: await (0, pda_1.getMetadata)(accounts.itemMint),
                edition: await (0, pda_1.getEdition)(accounts.itemMint),
                parent: accounts.parent || itemClassKey,
                payer: this.program.client.provider.wallet
                    .publicKey,
                systemProgram: web3_js_1.SystemProgram.programId,
                rent: anchor_1.web3.SYSVAR_RENT_PUBKEY,
            })
                .remainingAccounts(remainingAccounts)
                .instruction(),
        ];
    }
    async updateItemClass(args, accounts, additionalArgs) {
        const remainingAccounts = additionalArgs.permissionless && accounts.parent
            ? [{ pubkey: accounts.parent, isWritable: false, isSigner: false }]
            : await generateRemainingAccountsGivenPermissivenessToUse({
                permissivenessToUse: args.updatePermissivenessToUse,
                tokenMint: accounts.itemMint,
                parentMint: accounts.parentMint,
                parentIndex: args.parentClassIndex,
                parent: accounts.parent,
                metadataUpdateAuthority: accounts.metadataUpdateAuthority,
                program: this.program.client,
            });
        sol_kit_1.InstructionUtils.convertNumbersToBNs(args, ITEM_CLASS_DATA_ARGS_CONVERT_TO_BNS);
        sol_kit_1.InstructionUtils.convertStringsToPublicKeys(args, ITEM_CLASS_DATA_ARGS_CONVERT_TO_PUBKEYS);
        const [itemClassKey, itemClassBump] = await (0, pda_1.getItemPDA)(accounts.itemMint, args.classIndex);
        return [
            await this.program.client.methods
                .updateItemClass(args)
                .accounts({
                itemClass: itemClassKey,
                parent: accounts.parent || anchor_1.web3.SystemProgram.programId,
                itemMint: accounts.itemMint,
            })
                .remainingAccounts(remainingAccounts)
                .instruction(),
        ];
    }
    async createItemEscrow(args, accounts, additionalArgs) {
        const remainingAccounts = await generateRemainingAccountsGivenPermissivenessToUse({
            permissivenessToUse: args.buildPermissivenessToUse,
            tokenMint: accounts.itemClassMint,
            parentMint: accounts.parentMint,
            parentIndex: args.parentClassIndex,
            parent: accounts.parentMint && !!args.parentClassIndex
                ? (await (0, pda_1.getItemPDA)(accounts.parentMint, args.parentClassIndex))[0]
                : null,
            metadataUpdateAuthority: accounts.metadataUpdateAuthority,
            program: this.program.client,
        });
        const itemClassKey = (await (0, pda_1.getItemPDA)(accounts.itemClassMint, args.classIndex))[0];
        const [itemEscrow, _] = await (0, pda_1.getItemEscrow)({
            itemClassMint: accounts.itemClassMint,
            craftEscrowIndex: args.craftEscrowIndex,
            classIndex: args.classIndex,
            newItemMint: accounts.newItemMint,
            newItemToken: accounts.newItemToken ||
                (await (0, pda_1.getAtaForMint)(accounts.newItemMint, this.program.client.provider.wallet.publicKey))[0],
            payer: this.program.client.provider.wallet.publicKey,
            amountToMake: args.amountToMake,
            componentScope: args.componentScope,
        });
        return [
            await this.program.client.methods
                .createItemEscrow(args)
                .accounts({
                itemClass: itemClassKey,
                itemClassMetadata: await (0, pda_1.getMetadata)(accounts.itemClassMint),
                newItemMint: accounts.newItemMint,
                newItemMetadata: await (0, pda_1.getMetadata)(accounts.newItemMint),
                newItemEdition: await (0, pda_1.getEdition)(accounts.newItemMint),
                itemEscrow,
                newItemToken: accounts.newItemToken ||
                    (await (0, pda_1.getAtaForMint)(accounts.newItemMint, this.program.client.provider.wallet
                        .publicKey))[0],
                newItemTokenHolder: accounts.newItemTokenHolder ||
                    this.program.client.provider.wallet.publicKey,
                payer: this.program.client.provider.wallet
                    .publicKey,
                systemProgram: web3_js_1.SystemProgram.programId,
                rent: anchor_1.web3.SYSVAR_RENT_PUBKEY,
            })
                .remainingAccounts(remainingAccounts)
                .instruction(),
        ];
    }
    async completeItemEscrowBuildPhase(args, accounts, additionalArgs) {
        const remainingAccounts = await generateRemainingAccountsGivenPermissivenessToUse({
            permissivenessToUse: args.buildPermissivenessToUse,
            tokenMint: accounts.itemClassMint,
            parentMint: accounts.parentMint,
            parentIndex: args.parentClassIndex,
            parent: accounts.parentMint && !!args.parentClassIndex
                ? (await (0, pda_1.getItemPDA)(accounts.parentMint, args.parentClassIndex))[0]
                : null,
            metadataUpdateAuthority: accounts.metadataUpdateAuthority,
            program: this.program.client,
        });
        const itemClassKey = (await (0, pda_1.getItemPDA)(accounts.itemClassMint, args.classIndex))[0];
        const [newItem, _] = await (0, pda_1.getItemPDA)(accounts.newItemMint, args.newItemIndex);
        const itemEscrow = (await (0, pda_1.getItemEscrow)({
            itemClassMint: accounts.itemClassMint,
            classIndex: args.classIndex,
            craftEscrowIndex: args.craftEscrowIndex,
            newItemMint: accounts.newItemMint,
            newItemToken: accounts.newItemToken ||
                (await (0, pda_1.getAtaForMint)(accounts.newItemMint, args.originator ||
                    this.program.client.provider.wallet
                        .publicKey))[0],
            payer: args.originator ||
                this.program.client.provider.wallet.publicKey,
            amountToMake: args.amountToMake,
            componentScope: args.componentScope,
        }))[0];
        return [
            await this.program.client.methods
                .completeItemEscrowBuildPhase(args)
                .accounts({
                itemClass: itemClassKey,
                itemEscrow,
                newItem,
                newItemMint: accounts.newItemMint,
                newItemMetadata: await (0, pda_1.getMetadata)(accounts.newItemMint),
                newItemEdition: await (0, pda_1.getEdition)(accounts.newItemMint),
                newItemToken: accounts.newItemToken ||
                    (await (0, pda_1.getAtaForMint)(accounts.newItemMint, args.originator ||
                        this.program.client.provider.wallet
                            .publicKey))[0],
                newItemTokenHolder: accounts.newItemTokenHolder ||
                    args.originator ||
                    this.program.client.provider.wallet.publicKey,
                payer: this.program.client.provider.wallet
                    .publicKey,
                systemProgram: web3_js_1.SystemProgram.programId,
                tokenProgram: programIds_1.TOKEN_PROGRAM_ID,
                rent: anchor_1.web3.SYSVAR_RENT_PUBKEY,
                clock: anchor_1.web3.SYSVAR_CLOCK_PUBKEY,
            })
                .remainingAccounts(remainingAccounts)
                .instruction(),
        ];
    }
    async deactivateItemEscrow(args, accounts, additionalArgs) {
        args.newItemToken =
            args.newItemToken ||
                (await (0, pda_1.getAtaForMint)(args.newItemMint, this.program.client.provider.wallet.publicKey))[0];
        const itemEscrow = (await (0, pda_1.getItemEscrow)({
            itemClassMint: args.itemClassMint,
            classIndex: args.classIndex,
            craftEscrowIndex: args.craftEscrowIndex,
            newItemMint: args.newItemMint,
            newItemToken: args.newItemToken,
            payer: this.program.client.provider.wallet
                .publicKey,
            amountToMake: args.amountToMake,
            componentScope: args.componentScope,
        }))[0];
        return [
            await this.program.client.methods
                .deactivateItemEscrow(args)
                .accounts({
                itemEscrow,
                originator: this.program.client.provider.wallet
                    .publicKey,
            })
                .instruction(),
        ];
    }
    async updateValidForUseIfWarmupPassed(args, accounts = {}, additionalArgs = {}) {
        const itemActivationMarker = (await (0, pda_1.getItemActivationMarker)({
            itemMint: args.itemMint,
            index: args.index,
            usageIndex: new anchor_1.BN(args.usageIndex),
            amount: args.amount,
        }))[0];
        return [
            await this.program.client.methods
                .updateValidForUseIfWarmupPassed(args)
                .accounts({
                item: (await (0, pda_1.getItemPDA)(args.itemMint, args.index))[0],
                itemClass: (await (0, pda_1.getItemPDA)(args.itemClassMint, args.classIndex))[0],
                itemActivationMarker,
                clock: anchor_1.web3.SYSVAR_CLOCK_PUBKEY,
            })
                .instruction(),
        ];
    }
    async addCraftItemToEscrow(args, accounts, additionalArgs) {
        const remainingAccounts = await generateRemainingAccountsGivenPermissivenessToUse({
            permissivenessToUse: args.buildPermissivenessToUse,
            tokenMint: accounts.itemClassMint,
            parentMint: accounts.parentMint,
            parentIndex: args.parentClassIndex,
            parent: accounts.parentMint && !!args.parentClassIndex
                ? (await (0, pda_1.getItemPDA)(accounts.parentMint, args.parentClassIndex))[0]
                : null,
            metadataUpdateAuthority: accounts.metadataUpdateAuthority,
            program: this.program.client,
        });
        const itemClassKey = (await (0, pda_1.getItemPDA)(accounts.itemClassMint, args.classIndex))[0];
        const craftItemTokenAccount = (await (0, pda_1.getAtaForMint)(accounts.craftItemTokenMint, this.program.client.provider.wallet.publicKey))[0];
        const [craftItemEscrow, _itemEscrowBump] = await (0, pda_1.getCraftItemEscrow)({
            itemClassMint: accounts.itemClassMint,
            classIndex: args.classIndex,
            craftIndex: args.craftItemIndex,
            craftEscrowIndex: args.craftEscrowIndex,
            newItemMint: args.newItemMint,
            craftItemMint: accounts.craftItemTokenMint,
            craftItemToken: craftItemTokenAccount,
            payer: this.program.client.provider.wallet.publicKey,
            amountToMake: args.amountToMake,
            amountToContributeFromThisContributor: args.amountToContributeFromThisContributor,
            componentScope: args.componentScope,
        });
        const [craftItemCounter, _craftBump] = await (0, pda_1.getCraftItemCounter)({
            itemClassMint: accounts.itemClassMint,
            classIndex: args.classIndex,
            craftItemIndex: args.craftItemIndex,
            craftEscrowIndex: args.craftEscrowIndex,
            newItemMint: args.newItemMint,
            craftItemMint: accounts.craftItemTokenMint,
            componentScope: args.componentScope,
        });
        const itemEscrow = (await (0, pda_1.getItemEscrow)({
            itemClassMint: accounts.itemClassMint,
            classIndex: args.classIndex,
            craftEscrowIndex: args.craftEscrowIndex,
            newItemMint: args.newItemMint,
            newItemToken: accounts.newItemToken ||
                (await (0, pda_1.getAtaForMint)(args.newItemMint, args.originator ||
                    this.program.client.provider.wallet
                        .publicKey))[0],
            payer: args.originator ||
                this.program.client.provider.wallet.publicKey,
            amountToMake: args.amountToMake,
            componentScope: args.componentScope,
        }))[0];
        const craftItem = (await (0, pda_1.getItemPDA)(accounts.craftItemTokenMint, args.craftItemIndex))[0];
        const craftItemObj = await this.program.client.account.item.fetch(craftItem);
        let instructions = [];
        instructions.push(spl_token_1.Token.createApproveInstruction(programIds_1.TOKEN_PROGRAM_ID, craftItemTokenAccount, accounts.craftItemTransferAuthority, this.program.client.provider.wallet.publicKey, [], args.amountToContributeFromThisContributor.toNumber()));
        instructions.push(await this.program.client.methods
            .addCraftItemToEscrow(args)
            .accounts({
            itemClass: itemClassKey,
            itemEscrow,
            craftItemCounter,
            newItemToken: accounts.newItemToken ||
                (await (0, pda_1.getAtaForMint)(args.newItemMint, args.originator ||
                    this.program.client.provider.wallet
                        .publicKey))[0],
            newItemTokenHolder: accounts.newItemTokenHolder ||
                args.originator ||
                this.program.client.provider.wallet.publicKey,
            craftItemTokenAccountEscrow: craftItemEscrow,
            craftItemTokenMint: accounts.craftItemTokenMint,
            craftItemTokenAccount,
            craftItem,
            craftItemClass: craftItemObj.parent,
            craftItemTransferAuthority: accounts.craftItemTransferAuthority,
            payer: this.program.client.provider.wallet
                .publicKey,
            systemProgram: web3_js_1.SystemProgram.programId,
            tokenProgram: programIds_1.TOKEN_PROGRAM_ID,
            rent: anchor_1.web3.SYSVAR_RENT_PUBKEY,
            clock: anchor_1.web3.SYSVAR_CLOCK_PUBKEY,
        })
            .remainingAccounts(remainingAccounts)
            .instruction());
        instructions.push(spl_token_1.Token.createRevokeInstruction(programIds_1.TOKEN_PROGRAM_ID, craftItemTokenAccount, this.program.client.provider.wallet.publicKey, []));
        return instructions;
    }
    async removeCraftItemFromEscrow(args, accounts, additionalArgs) {
        const remainingAccounts = await generateRemainingAccountsGivenPermissivenessToUse({
            permissivenessToUse: args.buildPermissivenessToUse,
            tokenMint: accounts.itemClassMint,
            parentMint: accounts.parentMint,
            parentIndex: args.parentClassIndex,
            parent: accounts.parentMint && !!args.parentClassIndex
                ? (await (0, pda_1.getItemPDA)(accounts.parentMint, args.parentClassIndex))[0]
                : null,
            metadataUpdateAuthority: accounts.metadataUpdateAuthority,
            program: this.program.client,
        });
        const itemClassKey = (await (0, pda_1.getItemPDA)(accounts.itemClassMint, args.classIndex))[0];
        const craftItemTokenAccount = (await (0, pda_1.getAtaForMint)(args.craftItemTokenMint, this.program.client.provider.wallet.publicKey))[0];
        const [craftItemEscrow, _itemEscrowBump] = await (0, pda_1.getCraftItemEscrow)({
            itemClassMint: accounts.itemClassMint,
            classIndex: args.classIndex,
            craftIndex: args.craftItemIndex,
            craftEscrowIndex: args.craftEscrowIndex,
            newItemMint: args.newItemMint,
            craftItemMint: args.craftItemTokenMint,
            craftItemToken: craftItemTokenAccount,
            payer: this.program.client.provider.wallet.publicKey,
            amountToMake: args.amountToMake,
            amountToContributeFromThisContributor: args.amountContributedFromThisContributor,
            componentScope: args.componentScope,
        });
        const [craftItemCounter, _craftBump] = await (0, pda_1.getCraftItemCounter)({
            itemClassMint: accounts.itemClassMint,
            classIndex: args.classIndex,
            craftItemIndex: args.craftItemIndex,
            craftEscrowIndex: args.craftEscrowIndex,
            newItemMint: args.newItemMint,
            craftItemMint: args.craftItemTokenMint,
            componentScope: args.componentScope,
        });
        const itemEscrow = (await (0, pda_1.getItemEscrow)({
            itemClassMint: accounts.itemClassMint,
            classIndex: args.classIndex,
            craftEscrowIndex: args.craftEscrowIndex,
            newItemMint: args.newItemMint,
            newItemToken: accounts.newItemToken ||
                (await (0, pda_1.getAtaForMint)(args.newItemMint, args.originator ||
                    this.program.client.provider.wallet
                        .publicKey))[0],
            payer: args.originator ||
                this.program.client.provider.wallet.publicKey,
            amountToMake: args.amountToMake,
            componentScope: args.componentScope,
        }))[0];
        return [
            await this.program.client.methods
                .removeCraftItemFromEscrow(args)
                .accounts({
                itemClass: itemClassKey,
                itemEscrow,
                craftItemCounter,
                newItemToken: accounts.newItemToken ||
                    (await (0, pda_1.getAtaForMint)(args.newItemMint, args.originator ||
                        this.program.client.provider.wallet
                            .publicKey))[0],
                newItemTokenHolder: accounts.newItemTokenHolder ||
                    args.originator ||
                    this.program.client.provider.wallet.publicKey,
                craftItemTokenAccountEscrow: craftItemEscrow,
                craftItemTokenAccount,
                craftItem: (await (0, pda_1.getItemPDA)(args.craftItemTokenMint, args.craftItemIndex))[0],
                craftItemClass: (await (0, pda_1.getItemPDA)(args.craftItemClassMint, args.craftItemClassIndex))[0],
                receiver: this.program.client.provider.wallet
                    .publicKey,
                systemProgram: web3_js_1.SystemProgram.programId,
                tokenProgram: programIds_1.TOKEN_PROGRAM_ID,
            })
                .remainingAccounts(remainingAccounts)
                .instruction(),
        ];
    }
    async beginItemActivation(args, accounts, _additionalArgs = {}) {
        var _a, _b;
        const remainingAccounts = await generateRemainingAccountsGivenPermissivenessToUse({
            permissivenessToUse: args.usagePermissivenessToUse,
            tokenMint: accounts.itemMint,
            parentMint: args.itemClassMint,
            parentIndex: args.classIndex,
            parent: (await (0, pda_1.getItemPDA)(args.itemClassMint, args.classIndex))[0],
            metadataUpdateAuthority: accounts.metadataUpdateAuthority,
            program: this.program.client,
        });
        const itemClassKey = (await (0, pda_1.getItemPDA)(args.itemClassMint, args.classIndex))[0];
        const [itemActivationMarker, itemActivationBump] = await (0, pda_1.getItemActivationMarker)({
            itemMint: accounts.itemMint,
            index: args.index,
            usageIndex: new anchor_1.BN(args.usageIndex),
            amount: args.amount,
        });
        const instructions = [];
        const itemTransferAuthority = accounts.itemTransferAuthority;
        if (accounts.itemAccount &&
            accounts.itemAccount.equals((await (0, pda_1.getAtaForMint)(accounts.itemMint, this.program.client.provider.wallet.publicKey))[0])) {
            if (!itemTransferAuthority) {
                throw new Error("itemTransferAuthority must be specified if itemAccount is itemMint's ATA");
            }
            instructions.push(spl_token_1.Token.createApproveInstruction(programIds_1.TOKEN_PROGRAM_ID, accounts.itemAccount, itemTransferAuthority.publicKey, this.program.client.provider.wallet.publicKey, [], args.amount.toNumber()));
        }
        const itemKey = (await (0, pda_1.getItemPDA)(accounts.itemMint, args.index))[0];
        const validationKey = (_b = (_a = args.itemClass.object.itemClassData.config.usages) === null || _a === void 0 ? void 0 : _a[args.usageIndex].validation) === null || _b === void 0 ? void 0 : _b.key;
        const validationProgram = !!validationKey
            ? new anchor_1.web3.PublicKey(validationKey)
            : web3_js_1.SystemProgram.programId;
        instructions.push(await this.program.client.methods
            .beginItemActivation(args)
            .accounts({
            itemClass: itemClassKey,
            itemMint: accounts.itemMint,
            item: itemKey,
            itemAccount: accounts.itemAccount,
            itemTransferAuthority: itemTransferAuthority === null || itemTransferAuthority === void 0 ? void 0 : itemTransferAuthority.publicKey,
            itemActivationMarker,
            payer: this.program.client.provider.wallet
                .publicKey,
            playerProgram: programIds_1.PLAYER_ID,
            systemProgram: web3_js_1.SystemProgram.programId,
            tokenProgram: programIds_1.TOKEN_PROGRAM_ID,
            rent: anchor_1.web3.SYSVAR_RENT_PUBKEY,
            clock: anchor_1.web3.SYSVAR_CLOCK_PUBKEY,
            validationProgram,
        })
            .remainingAccounts(remainingAccounts)
            .instruction());
        if (accounts.itemAccount &&
            accounts.itemAccount.equals((await (0, pda_1.getAtaForMint)(accounts.itemMint, this.program.client.provider.wallet.publicKey))[0])) {
            instructions.push(spl_token_1.Token.createRevokeInstruction(programIds_1.TOKEN_PROGRAM_ID, accounts.itemAccount, this.program.client.provider.wallet.publicKey, []));
        }
        return instructions;
    }
    async endItemActivation(args, accounts, _additionalArgs = {}) {
        const remainingAccounts = await generateRemainingAccountsGivenPermissivenessToUse({
            permissivenessToUse: args.usagePermissivenessToUse,
            tokenMint: args.itemMint,
            parentMint: args.itemClassMint,
            parentIndex: args.classIndex,
            parent: (await (0, pda_1.getItemPDA)(args.itemClassMint, args.classIndex))[0],
            metadataUpdateAuthority: accounts.metadataUpdateAuthority,
            program: this.program.client,
        });
        const itemClassKey = (await (0, pda_1.getItemPDA)(args.itemClassMint, args.classIndex))[0];
        const itemActivationMarker = (await (0, pda_1.getItemActivationMarker)({
            itemMint: args.itemMint,
            index: args.index,
            usageIndex: new anchor_1.BN(args.usageIndex),
            amount: args.amount,
        }))[0];
        const itemKey = (await (0, pda_1.getItemPDA)(args.itemMint, args.index))[0];
        return [
            await this.program.client.methods
                .endItemActivation(args)
                .accounts({
                itemClass: itemClassKey,
                item: itemKey,
                itemActivationMarker,
                receiver: accounts.originator ||
                    this.program.client.provider.wallet.publicKey,
            })
                .remainingAccounts(remainingAccounts)
                .instruction(),
        ];
    }
    async drainItemEscrow(args, accounts, _additionalArgs = {}) {
        if (!args.newItemToken) {
            args.newItemToken = (await (0, pda_1.getAtaForMint)(args.newItemMint, this.program.client.provider.wallet.publicKey))[0];
        }
        const itemEscrow = (await (0, pda_1.getItemEscrow)({
            itemClassMint: args.itemClassMint,
            classIndex: args.classIndex,
            craftEscrowIndex: args.craftEscrowIndex,
            newItemMint: args.newItemMint,
            newItemToken: args.newItemToken,
            payer: this.program.client.provider.wallet
                .publicKey,
            amountToMake: args.amountToMake,
            componentScope: args.componentScope,
        }))[0];
        return [
            await this.program.client.methods
                .drainItemEscrow(args)
                .accounts({
                itemEscrow,
                originator: accounts.originator,
            })
                .instruction(),
        ];
    }
    async startItemEscrowBuildPhase(args, accounts, additionalArgs) {
        const remainingAccounts = await generateRemainingAccountsGivenPermissivenessToUse({
            permissivenessToUse: args.buildPermissivenessToUse,
            tokenMint: accounts.itemClassMint,
            parentMint: accounts.parentMint,
            parentIndex: args.parentClassIndex,
            parent: accounts.parentMint && !!args.parentClassIndex
                ? (await (0, pda_1.getItemPDA)(accounts.parentMint, args.parentClassIndex))[0]
                : null,
            metadataUpdateAuthority: accounts.metadataUpdateAuthority,
            program: this.program.client,
        });
        const itemClassKey = (await (0, pda_1.getItemPDA)(accounts.itemClassMint, args.classIndex))[0];
        const itemEscrow = (await (0, pda_1.getItemEscrow)({
            itemClassMint: accounts.itemClassMint,
            classIndex: args.classIndex,
            craftEscrowIndex: args.craftEscrowIndex,
            newItemMint: args.newItemMint,
            newItemToken: accounts.newItemToken ||
                (await (0, pda_1.getAtaForMint)(args.newItemMint, args.originator ||
                    this.program.client.provider.wallet
                        .publicKey))[0],
            payer: args.originator ||
                this.program.client.provider.wallet.publicKey,
            amountToMake: args.amountToMake,
            componentScope: args.componentScope,
        }))[0];
        return [
            await this.program.client.methods
                .startItemEscrowBuildPhase(args)
                .accounts({
                itemClass: itemClassKey,
                itemEscrow,
                newItemToken: accounts.newItemToken ||
                    (await (0, pda_1.getAtaForMint)(args.newItemMint, args.originator ||
                        this.program.client.provider.wallet
                            .publicKey))[0],
                newItemTokenHolder: accounts.newItemTokenHolder ||
                    args.originator ||
                    this.program.client.provider.wallet.publicKey,
                clock: anchor_1.web3.SYSVAR_CLOCK_PUBKEY,
            })
                .remainingAccounts(remainingAccounts)
                .instruction(),
        ];
    }
    async updateItem(args, accounts, additionalArgs) {
        const itemClassKey = (await (0, pda_1.getItemPDA)(args.itemClassMint, args.classIndex))[0];
        const itemKey = (await (0, pda_1.getItemPDA)(args.itemMint, args.index))[0];
        return [
            await this.program.client.methods
                .updateItem(args)
                .accounts({
                accounts: {
                    itemClass: itemClassKey,
                    item: itemKey,
                },
            })
                .instruction(),
        ];
    }
}
exports.Instruction = Instruction;
