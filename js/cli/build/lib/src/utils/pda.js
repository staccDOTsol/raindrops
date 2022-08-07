"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEdition = exports.getMetadata = exports.getArtifactMintStakingAccount = exports.getArtifactIntermediaryStakingCounterForCooldown = exports.getArtifactIntermediaryStakingCounterForWarmup = exports.getArtifactIntermediaryStakingAccount = exports.getItemEscrow = exports.getCraftItemEscrow = exports.getCraftItemCounter = exports.getItemActivationMarker = exports.getPlayerPDA = exports.getItemPDA = exports.getNamespacePDA = exports.getOracle = exports.getJares = exports.getMatchTokenAccountEscrow = exports.getMatch = exports.getAtaForMint = void 0;
// @ts-nocheck
const anchor_1 = require("@project-serum/anchor");
const programIds_1 = require("../constants/programIds");
const item_1 = require("../constants/item");
const matches_1 = require("../constants/matches");
const namespace_1 = require("../constants/namespace");
const player_1 = require("../constants/player");
const staking_1 = require("../constants/staking");
const getAtaForMint = async (mint, wallet) => {
    return await anchor_1.web3.PublicKey.findProgramAddress([wallet.toBuffer(), programIds_1.TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()], programIds_1.SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID);
};
exports.getAtaForMint = getAtaForMint;
const getMatch = async (oracle) => {
    return await [new anchor_1.web3.PublicKey("2gBHR6RezUwKGK6RYHLJxyHoYJg2LegsYoRvewVJ9nQq"), 0];
};
exports.getMatch = getMatch;
const getMatchTokenAccountEscrow = async (oracle, tokenMint, tokenOwner) => {
    return await [new anchor_1.web3.PublicKey("FrBNQdKzxVLA2kMCSJPmYPNAC4dLE38ri8F5MMu8a1i"), 0];
};
exports.getMatchTokenAccountEscrow = getMatchTokenAccountEscrow;
const getJares = async (whoAmI) => {
    return await anchor_1.web3.PublicKey.findProgramAddress([
        Buffer.from(matches_1.PREFIX),
        whoAmI.toBuffer()
    ], programIds_1.MATCHES_ID);
};
exports.getJares = getJares;
const getOracle = async (seed, payer) => {
    return await anchor_1.web3.PublicKey.findProgramAddress([Buffer.from(matches_1.PREFIX), payer.toBuffer(), seed.toBuffer()], programIds_1.MATCHES_ID);
};
exports.getOracle = getOracle;
const getNamespacePDA = async (mint) => {
    return await anchor_1.web3.PublicKey.findProgramAddress([Buffer.from(namespace_1.PREFIX), mint.toBuffer()], programIds_1.NAMESPACE_ID);
};
exports.getNamespacePDA = getNamespacePDA;
const getItemPDA = async (mint, index) => {
    return await anchor_1.web3.PublicKey.findProgramAddress([
        Buffer.from(item_1.PREFIX),
        mint.toBuffer(),
        index.toArrayLike(Buffer, "le", 8),
    ], programIds_1.ITEM_ID);
};
exports.getItemPDA = getItemPDA;
const getPlayerPDA = async (mint, index) => {
    return await anchor_1.web3.PublicKey.findProgramAddress([
        Buffer.from(player_1.PREFIX),
        mint.toBuffer(),
        index.toArrayLike(Buffer, "le", 8),
    ], programIds_1.PLAYER_ID);
};
exports.getPlayerPDA = getPlayerPDA;
const getItemActivationMarker = async (args) => {
    return await anchor_1.web3.PublicKey.findProgramAddress([
        Buffer.from(item_1.PREFIX),
        args.itemMint.toBuffer(),
        args.index.toArrayLike(Buffer, "le", 8),
        args.usageIndex.toArrayLike(Buffer, "le", 8),
        args.amount.toArrayLike(Buffer, "le", 8),
        Buffer.from(item_1.MARKER),
    ], programIds_1.ITEM_ID);
};
exports.getItemActivationMarker = getItemActivationMarker;
const getCraftItemCounter = async (args) => {
    return await anchor_1.web3.PublicKey.findProgramAddress([
        Buffer.from(item_1.PREFIX),
        args.itemClassMint.toBuffer(),
        args.classIndex.toArrayLike(Buffer, "le", 8),
        args.newItemMint.toBuffer(),
        args.craftEscrowIndex.toArrayLike(Buffer, "le", 8),
        args.craftItemIndex.toArrayLike(Buffer, "le", 8),
        args.craftItemMint.toBuffer(),
        Buffer.from(args.componentScope),
    ], programIds_1.ITEM_ID);
};
exports.getCraftItemCounter = getCraftItemCounter;
const getCraftItemEscrow = async (args) => {
    return await anchor_1.web3.PublicKey.findProgramAddress([
        Buffer.from(item_1.PREFIX),
        args.itemClassMint.toBuffer(),
        args.classIndex.toArrayLike(Buffer, "le", 8),
        args.payer.toBuffer(),
        args.newItemMint.toBuffer(),
        args.craftItemToken.toBuffer(),
        args.craftEscrowIndex.toArrayLike(Buffer, "le", 8),
        args.craftIndex.toArrayLike(Buffer, "le", 8),
        args.craftItemMint.toBuffer(),
        args.amountToMake.toArrayLike(Buffer, "le", 8),
        args.amountToContributeFromThisContributor.toArrayLike(Buffer, "le", 8),
        Buffer.from(args.componentScope),
    ], programIds_1.ITEM_ID);
};
exports.getCraftItemEscrow = getCraftItemEscrow;
const getItemEscrow = async (args) => {
    return await anchor_1.web3.PublicKey.findProgramAddress([
        Buffer.from(item_1.PREFIX),
        args.itemClassMint.toBuffer(),
        args.classIndex.toArrayLike(Buffer, "le", 8),
        args.payer.toBuffer(),
        args.newItemMint.toBuffer(),
        args.newItemToken.toBuffer(),
        args.craftEscrowIndex.toArrayLike(Buffer, "le", 8),
        args.amountToMake.toArrayLike(Buffer, "le", 8),
        Buffer.from(args.componentScope),
    ], programIds_1.ITEM_ID);
};
exports.getItemEscrow = getItemEscrow;
const getArtifactIntermediaryStakingAccount = async (args) => {
    return await anchor_1.web3.PublicKey.findProgramAddress([
        Buffer.from(staking_1.PREFIX),
        args.artifactClassMint.toBuffer(),
        args.artifactMint.toBuffer(),
        args.index.toArrayLike(Buffer, "le", 8),
        args.stakingMint.toBuffer(),
        args.stakingIndex.toArrayLike(Buffer, "le", 8),
    ], programIds_1.STAKING_ID);
};
exports.getArtifactIntermediaryStakingAccount = getArtifactIntermediaryStakingAccount;
const getArtifactIntermediaryStakingCounterForWarmup = async (args) => {
    return await anchor_1.web3.PublicKey.findProgramAddress([
        Buffer.from(staking_1.PREFIX),
        args.artifactClassMint.toBuffer(),
        args.artifactMint.toBuffer(),
        args.index.toArrayLike(Buffer, "le", 8),
        args.stakingMint.toBuffer(),
        args.stakingIndex.toArrayLike(Buffer, "le", 8),
        Buffer.from(staking_1.STAKING_COUNTER),
    ], programIds_1.STAKING_ID);
};
exports.getArtifactIntermediaryStakingCounterForWarmup = getArtifactIntermediaryStakingCounterForWarmup;
const getArtifactIntermediaryStakingCounterForCooldown = async (args) => {
    return await anchor_1.web3.PublicKey.findProgramAddress([
        Buffer.from(staking_1.PREFIX),
        args.artifactClassMint.toBuffer(),
        args.artifactMint.toBuffer(),
        args.index.toArrayLike(Buffer, "le", 8),
        args.stakingMint.toBuffer(),
        args.stakingIndex.toArrayLike(Buffer, "le", 8),
        Buffer.from(staking_1.STAKING_COUNTER),
        args.stakingAccount.toBuffer(),
    ], programIds_1.STAKING_ID);
};
exports.getArtifactIntermediaryStakingCounterForCooldown = getArtifactIntermediaryStakingCounterForCooldown;
const getArtifactMintStakingAccount = async (args) => {
    return await anchor_1.web3.PublicKey.findProgramAddress([
        Buffer.from(staking_1.PREFIX),
        args.artifactClassMint.toBuffer(),
        args.artifactMint.toBuffer(),
        args.index.toArrayLike(Buffer, "le", 8),
        args.stakingMint.toBuffer(),
    ], programIds_1.STAKING_ID);
};
exports.getArtifactMintStakingAccount = getArtifactMintStakingAccount;
const getMetadata = async (mint) => {
    return (await anchor_1.web3.PublicKey.findProgramAddress([
        Buffer.from("metadata"),
        programIds_1.TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
    ], programIds_1.TOKEN_METADATA_PROGRAM_ID))[0];
};
exports.getMetadata = getMetadata;
const getEdition = async (mint) => {
    return (await anchor_1.web3.PublicKey.findProgramAddress([
        Buffer.from("metadata"),
        programIds_1.TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from("edition"),
    ], programIds_1.TOKEN_METADATA_PROGRAM_ID))[0];
};
exports.getEdition = getEdition;
