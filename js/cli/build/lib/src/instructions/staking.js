"use strict";
//  @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instruction = void 0;
const anchor_1 = require("@project-serum/anchor");
const sol_kit_1 = require("@raindrop-studios/sol-kit");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const programIds_1 = require("../constants/programIds");
const common_1 = require("../contract/common");
const pda_1 = require("../utils/pda");
const { generateRemainingAccountsForGivenPermissivenessToUse } = common_1.ContractCommon;
class Instruction extends sol_kit_1.Instruction {
    constructor(args) {
        super(args);
    }
    async beginArtifactStakeWarmup(args, accounts) {
        const [artifactIntermediaryStakingAccount, _artifactIntermediaryStakingAccountBump,] = await (0, pda_1.getArtifactIntermediaryStakingAccount)({
            artifactClassMint: args.artifactClassMint,
            artifactMint: args.artifactMint,
            index: args.index,
            stakingMint: accounts.stakingMint,
            stakingIndex: args.stakingIndex,
        });
        const [artifactIntermediaryStakingCounter, _artifactIntermediaryStakingCounterBump,] = await (0, pda_1.getArtifactIntermediaryStakingCounterForWarmup)({
            artifactClassMint: args.artifactClassMint,
            artifactMint: args.artifactMint,
            index: args.index,
            stakingMint: accounts.stakingMint,
            stakingIndex: args.stakingIndex,
        });
        const remainingAccounts = await generateRemainingAccountsForGivenPermissivenessToUse({
            permissivenessToUse: args.stakingPermissivenessToUse,
            tokenMint: args.artifactClassMint,
            parentClassMint: accounts.parentClassMint,
            parentClass: accounts.parentClass,
            metadataUpdateAuthority: accounts.metadataUpdateAuthority,
            owner: this.program.client.provider.wallet
                .publicKey,
            program: this.program.client,
        });
        return [
            spl_token_1.Token.createApproveInstruction(programIds_1.TOKEN_PROGRAM_ID, accounts.stakingAccount, accounts.stakingTransferAuthority.publicKey, this.program.client.provider.wallet.publicKey, [], args.stakingAmount.toNumber()),
            await this.program.client.methods
                .beginArtifactStakeWarmup(args)
                .accounts({
                artifactClass: accounts.artifactClass,
                artifact: accounts.artifact,
                artifactIntermediaryStakingAccount,
                artifactIntermediaryStakingCounter,
                stakingAccount: accounts.stakingAccount,
                stakingMint: accounts.stakingMint,
                stakingTransferAuthority: accounts.stakingTransferAuthority.publicKey,
                namespace: accounts.namespace,
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
    async endArtifactStakeWarmup(args, accounts) {
        const [artifactIntermediaryStakingAccount, _artifactIntermediaryStakingAccountBump,] = await (0, pda_1.getArtifactIntermediaryStakingAccount)({
            artifactClassMint: args.artifactClassMint,
            artifactMint: args.artifactMint,
            index: args.index,
            stakingMint: accounts.stakingMint,
            stakingIndex: args.stakingIndex,
        });
        const [artifactIntermediaryStakingCounter, _artifactIntermediaryStakingCounterBump,] = await (0, pda_1.getArtifactIntermediaryStakingCounterForWarmup)({
            artifactClassMint: args.artifactClassMint,
            artifactMint: args.artifactMint,
            index: args.index,
            stakingMint: accounts.stakingMint,
            stakingIndex: args.stakingIndex,
        });
        const [artifactMintStakingAccount, _artifactMintStakingAccountBump] = await (0, pda_1.getArtifactMintStakingAccount)({
            artifactClassMint: args.artifactClassMint,
            artifactMint: args.artifactMint,
            index: args.index,
            stakingMint: accounts.stakingMint,
        });
        return [
            await this.program.client.methods
                .endArtifactStakeWarmup(args)
                .accounts({
                artifactClass: accounts.artifactClass,
                artifact: accounts.artifact,
                artifactIntermediaryStakingAccount,
                artifactIntermediaryStakingCounter,
                artifactMintStakingAccount,
                stakingMint: accounts.stakingMint,
                payer: this.program.client.provider.wallet
                    .publicKey,
                systemProgram: web3_js_1.SystemProgram.programId,
                tokenProgram: programIds_1.TOKEN_PROGRAM_ID,
                rent: anchor_1.web3.SYSVAR_RENT_PUBKEY,
                clock: anchor_1.web3.SYSVAR_CLOCK_PUBKEY,
            })
                .instruction(),
        ];
    }
    async beginArtifactStakeCooldown(args, accounts) {
        const [artifactIntermediaryStakingAccount, _artifactIntermediaryStakingAccountBump,] = await (0, pda_1.getArtifactIntermediaryStakingAccount)({
            artifactClassMint: args.artifactClassMint,
            artifactMint: args.artifactMint,
            index: args.index,
            stakingMint: accounts.stakingMint,
            stakingIndex: args.stakingIndex,
        });
        const [artifactIntermediaryStakingCounter, _artifactIntermediaryStakingCounterBump,] = await (0, pda_1.getArtifactIntermediaryStakingCounterForCooldown)({
            artifactClassMint: args.artifactClassMint,
            artifactMint: args.artifactMint,
            index: args.index,
            stakingAccount: accounts.stakingAccount,
            stakingMint: accounts.stakingMint,
            stakingIndex: args.stakingIndex,
        });
        const [artifactMintStakingAccount, _artifactMintStakingAccountBump] = await (0, pda_1.getArtifactMintStakingAccount)({
            artifactClassMint: args.artifactClassMint,
            artifactMint: args.artifactMint,
            index: args.index,
            stakingMint: accounts.stakingMint,
        });
        const remainingAccounts = await generateRemainingAccountsForGivenPermissivenessToUse({
            permissivenessToUse: args.stakingPermissivenessToUse,
            tokenMint: args.artifactClassMint,
            parentClassMint: accounts.parentClassMint,
            parentClass: accounts.parentClass,
            metadataUpdateAuthority: accounts.metadataUpdateAuthority,
            owner: this.program.client.provider.wallet
                .publicKey,
            program: this.program.client,
        });
        return [
            await this.program.client.methods
                .beginArtifactStakeCooldown(args)
                .accounts({
                artifactClass: accounts.artifactClass,
                artifact: accounts.artifact,
                artifactIntermediaryStakingAccount,
                artifactIntermediaryStakingCounter,
                artifactMintStakingAccount,
                stakingAccount: accounts.stakingAccount,
                stakingMint: accounts.stakingMint,
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
    async endArtifactStakeCooldown(args, accounts) {
        const [artifactIntermediaryStakingAccount, _artifactIntermediaryStakingAccountBump,] = await (0, pda_1.getArtifactIntermediaryStakingAccount)({
            artifactClassMint: args.artifactClassMint,
            artifactMint: args.artifactMint,
            index: args.index,
            stakingMint: accounts.stakingMint,
            stakingIndex: args.stakingIndex,
        });
        const [artifactIntermediaryStakingCounter, _artifactIntermediaryStakingCounterBump,] = await (0, pda_1.getArtifactIntermediaryStakingCounterForCooldown)({
            artifactClassMint: args.artifactClassMint,
            artifactMint: args.artifactMint,
            stakingAccount: accounts.stakingAccount,
            index: args.index,
            stakingMint: accounts.stakingMint,
            stakingIndex: args.stakingIndex,
        });
        return [
            await this.program.client.methods
                .endArtifactStakeCooldown(args)
                .accounts({
                artifactClass: accounts.artifactClass,
                artifact: accounts.artifact,
                artifactIntermediaryStakingAccount,
                artifactIntermediaryStakingCounter,
                stakingAccount: accounts.stakingAccount,
                stakingMint: accounts.stakingMint,
                payer: this.program.client.provider.wallet
                    .publicKey,
                tokenProgram: programIds_1.TOKEN_PROGRAM_ID,
                clock: anchor_1.web3.SYSVAR_CLOCK_PUBKEY,
            })
                .instruction(),
        ];
    }
}
exports.Instruction = Instruction;
