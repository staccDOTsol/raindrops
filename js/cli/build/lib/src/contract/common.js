"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractCommon = void 0;
const pda_1 = require("../utils/pda");
var ContractCommon;
(function (ContractCommon) {
    async function generateRemainingAccountsGivenPermissivenessToUse(args) {
        const { permissivenessToUse, program, tokenMint, parentMint, parent, parentIndex, metadataUpdateAuthority, } = args;
        const remainingAccounts = [];
        if (permissivenessToUse === null || permissivenessToUse === void 0 ? void 0 : permissivenessToUse.tokenHolder) {
            const tokenAccount = (await (0, pda_1.getAtaForMint)(tokenMint, program.provider.wallet.publicKey))[0];
            const tokenHolder = program.provider.wallet.publicKey;
            remainingAccounts.push({
                pubkey: tokenAccount,
                isWritable: false,
                isSigner: false,
            });
            remainingAccounts.push({
                pubkey: tokenHolder,
                isWritable: false,
                isSigner: true,
            });
        }
        else if ((permissivenessToUse === null || permissivenessToUse === void 0 ? void 0 : permissivenessToUse.parentTokenHolder) &&
            parentMint &&
            parentIndex) {
            const parentToken = (await (0, pda_1.getAtaForMint)(parentMint, program.provider.wallet.publicKey))[0];
            const parentHolder = program.provider.wallet
                .publicKey;
            const parentClass = parent || (await (0, pda_1.getItemPDA)(parentMint, parentIndex))[0];
            remainingAccounts.push({
                pubkey: parentToken,
                isWritable: false,
                isSigner: false,
            });
            remainingAccounts.push({
                pubkey: parentHolder,
                isWritable: false,
                isSigner: true,
            });
            remainingAccounts.push({
                pubkey: parentClass,
                isWritable: false,
                isSigner: false,
            });
            remainingAccounts.push({
                pubkey: parentMint,
                isWritable: false,
                isSigner: false,
            });
        }
        else if ((permissivenessToUse === null || permissivenessToUse === void 0 ? void 0 : permissivenessToUse.updateAuthority) || !permissivenessToUse) {
            remainingAccounts.push({
                pubkey: metadataUpdateAuthority ||
                    program.provider.wallet.publicKey,
                isWritable: false,
                isSigner: true,
            });
            remainingAccounts.push({
                pubkey: await (0, pda_1.getMetadata)(tokenMint),
                isWritable: false,
                isSigner: false,
            });
        }
        return remainingAccounts;
    }
    ContractCommon.generateRemainingAccountsGivenPermissivenessToUse = generateRemainingAccountsGivenPermissivenessToUse;
    async function generateRemainingAccountsForGivenPermissivenessToUse(args) {
        const { permissivenessToUse, tokenMint, parentClassMint, parentClass, metadataUpdateAuthority, owner, program, } = args;
        const remainingAccounts = [];
        if (!permissivenessToUse) {
            remainingAccounts.push({
                pubkey: metadataUpdateAuthority || owner,
                isWritable: false,
                isSigner: true,
            });
            remainingAccounts.push({
                pubkey: await (0, pda_1.getMetadata)(tokenMint),
                isWritable: false,
                isSigner: false,
            });
            return remainingAccounts;
        }
        if (permissivenessToUse.tokenHolder) {
            remainingAccounts.push({
                pubkey: await getTokenAccountForMint({
                    mint: tokenMint,
                    owner,
                    program,
                }),
                isWritable: false,
                isSigner: false,
            });
            remainingAccounts.push({
                pubkey: owner,
                isWritable: false,
                isSigner: true,
            });
        }
        else if (permissivenessToUse.parentTokenHolder) {
            remainingAccounts.push({
                pubkey: await getTokenAccountForMint({
                    mint: parentClassMint,
                    owner,
                    program,
                }),
                isWritable: false,
                isSigner: false,
            });
            remainingAccounts.push({
                pubkey: owner,
                isWritable: false,
                isSigner: true,
            });
            remainingAccounts.push({
                pubkey: parentClass,
                isWritable: false,
                isSigner: false,
            });
            remainingAccounts.push({
                pubkey: parentClassMint,
                isWritable: false,
                isSigner: false,
            });
        }
        else if (permissivenessToUse.updateAuthority || !permissivenessToUse) {
            remainingAccounts.push({
                pubkey: metadataUpdateAuthority || owner,
                isWritable: false,
                isSigner: true,
            });
            remainingAccounts.push({
                pubkey: await (0, pda_1.getMetadata)(tokenMint),
                isWritable: false,
                isSigner: false,
            });
        }
        return remainingAccounts;
    }
    ContractCommon.generateRemainingAccountsForGivenPermissivenessToUse = generateRemainingAccountsForGivenPermissivenessToUse;
    // Creating a class uses the parent (if set) update permissivenesses and as such
    // produces slightly different remainingAccounts. So this method is used instead for class creation.
    // If parent is set, defaults to using update authority as a permissiveness to make the new token class.
    async function generateRemainingAccountsForCreateClass(args) {
        const { permissivenessToUse, program, tokenMint, parentMint, parent, metadataUpdateAuthority, parentOfParentClassMint, parentOfParentClassIndex, parentOfParentClass, parentUpdateAuthority, } = args;
        const remainingAccounts = [];
        if (!parent || !parentMint) {
            remainingAccounts.push({
                pubkey: metadataUpdateAuthority ||
                    program.client.provider.wallet.publicKey,
                isWritable: false,
                isSigner: true,
            });
            remainingAccounts.push({
                pubkey: await (0, pda_1.getMetadata)(tokenMint),
                isWritable: false,
                isSigner: false,
            });
        }
        else if (permissivenessToUse === null || permissivenessToUse === void 0 ? void 0 : permissivenessToUse.tokenHolder) {
            const tokenAccount = (await (0, pda_1.getAtaForMint)(parentMint, program.client.provider.wallet.publicKey))[0];
            const tokenHolder = program.client.provider.wallet
                .publicKey;
            remainingAccounts.push({
                pubkey: tokenAccount,
                isWritable: false,
                isSigner: false,
            });
            remainingAccounts.push({
                pubkey: tokenHolder,
                isWritable: false,
                isSigner: true,
            });
            remainingAccounts.push({
                pubkey: parentMint,
                isWritable: false,
                isSigner: false,
            });
        }
        else if ((permissivenessToUse === null || permissivenessToUse === void 0 ? void 0 : permissivenessToUse.parentTokenHolder) &&
            parentOfParentClassMint &&
            parentOfParentClassIndex) {
            const parentToken = (await (0, pda_1.getAtaForMint)(parentOfParentClassMint, program.client.provider.wallet.publicKey))[0];
            const parentHolder = program.client.provider.wallet
                .publicKey;
            const parentClass = parentOfParentClass ||
                (await (0, pda_1.getItemPDA)(parentOfParentClassMint, parentOfParentClassIndex))[0];
            remainingAccounts.push({
                pubkey: parentToken,
                isWritable: false,
                isSigner: false,
            });
            remainingAccounts.push({
                pubkey: parentHolder,
                isWritable: false,
                isSigner: true,
            });
            remainingAccounts.push({
                pubkey: parentClass,
                isWritable: false,
                isSigner: false,
            });
            remainingAccounts.push({
                pubkey: parentOfParentClassMint,
                isWritable: false,
                isSigner: false,
            });
        }
        else if (permissivenessToUse === null || permissivenessToUse === void 0 ? void 0 : permissivenessToUse.updateAuthority) {
            remainingAccounts.push({
                pubkey: parentUpdateAuthority ||
                    program.client.provider.wallet.publicKey,
                isWritable: false,
                isSigner: true,
            });
            remainingAccounts.push({
                pubkey: await (0, pda_1.getMetadata)(parentMint),
                isWritable: false,
                isSigner: false,
            });
            remainingAccounts.push({
                pubkey: parentMint,
                isWritable: false,
                isSigner: false,
            });
        }
        return remainingAccounts;
    }
    ContractCommon.generateRemainingAccountsForCreateClass = generateRemainingAccountsForCreateClass;
    // Token can be minted to both ATA or non-ATA.
    // If token is an NFT, there's only one token account that holds this nft.
    // If it's not an NFT, this function returns the first token account.
    // In most cases, this util function is used for NFT token account.
    async function getTokenAccountForMint(args) {
        const { mint, owner, program } = args;
        const tokenAccounts = (await program.provider.connection.getParsedTokenAccountsByOwner(owner, {
            mint,
        }, "confirmed")).value.filter((account) => account.account.data.parsed.info.tokenAmount.amount === "1" &&
            account.account.data.parsed.info.tokenAmount.decimals === 0);
        if (tokenAccounts.length < 1) {
            throw Error("Cannot find token account");
        }
        return tokenAccounts[0].pubkey;
    }
    ContractCommon.getTokenAccountForMint = getTokenAccountForMint;
})(ContractCommon = exports.ContractCommon || (exports.ContractCommon = {}));
