"use strict";
//  @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instruction = void 0;
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
const sol_kit_1 = require("@raindrop-studios/sol-kit");
const pda_1 = require("../utils/pda");
const programIds_1 = require("../constants/programIds");
class Instruction extends sol_kit_1.Instruction {
    constructor(args) {
        super(args);
    }
    async initializeNamespace(args, accounts) {
        const [namespacePDA, _namespaceBump] = await (0, pda_1.getNamespacePDA)(accounts.mint);
        sol_kit_1.InstructionUtils.convertNumbersToBNs(args, [
            "desiredNamespaceArraySize",
            "bump",
        ]);
        const remainingAccounts = args.whitelistedStakingMints.map((mint) => {
            return { pubkey: mint, isWritable: false, isSigner: false };
        });
        return [
            await this.program.client.methods
                .initializeNamespace(args)
                .accounts({
                namespace: namespacePDA,
                mint: accounts.mint,
                metadata: accounts.metadata,
                masterEdition: accounts.masterEdition,
                payer: this.program.client.provider.wallet
                    .publicKey,
                tokenProgram: programIds_1.TOKEN_PROGRAM_ID,
                systemProgram: web3_js_1.SystemProgram.programId,
                rent: anchor_1.web3.SYSVAR_RENT_PUBKEY,
            })
                .remainingAccounts(remainingAccounts)
                .instruction(),
        ];
    }
    async updateNamespace(args, accounts) {
        const [namespacePDA, _namespaceBump] = await (0, pda_1.getNamespacePDA)(accounts.mint);
        const remainingAccounts = args.whitelistedStakingMints.map((mint) => ({
            pubkey: mint,
            isWritable: false,
            isSigner: false,
        }));
        return [
            await this.program.client.methods
                .updateNamespace(args)
                .accounts({
                namespace: namespacePDA,
                namespaceToken: accounts.namespaceToken,
                tokenHolder: accounts.tokenHolder,
            })
                .remainingAccounts(remainingAccounts)
                .instruction(),
        ];
    }
}
exports.Instruction = Instruction;
