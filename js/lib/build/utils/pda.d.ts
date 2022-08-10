import { web3, BN } from "@project-serum/anchor";
export declare const getAtaForMint: (mint: web3.PublicKey, wallet: web3.PublicKey) => Promise<[web3.PublicKey, number]>;
export declare const getMatch: (oracle: web3.PublicKey) => Promise<[web3.PublicKey, number]>;
export declare const getMatchTokenAccountEscrow: (oracle: web3.PublicKey, tokenMint: web3.PublicKey, tokenOwner: web3.PublicKey) => Promise<[web3.PublicKey, number]>;
export declare const getJares: (whoAmI: web3.PublicKey, match: web3.PublicKey) => Promise<[web3.PublicKey, number]>;
export declare const getJares2: (whoIsJare: web3.PublicKey) => Promise<[web3.PublicKey, number]>;
export declare const getOracle: (seed: web3.PublicKey, payer: web3.PublicKey) => Promise<[web3.PublicKey, number]>;
export declare const getNamespacePDA: (mint: web3.PublicKey) => Promise<[web3.PublicKey, number]>;
export declare const getItemPDA: (mint: web3.PublicKey, index: BN) => Promise<[web3.PublicKey, number]>;
export declare const getPlayerPDA: (mint: web3.PublicKey, index: BN) => Promise<[web3.PublicKey, number]>;
export declare const getItemActivationMarker: (args: {
    itemMint: web3.PublicKey;
    index: BN;
    usageIndex: BN;
    amount: BN;
}) => Promise<[web3.PublicKey, number]>;
export declare const getCraftItemCounter: (args: {
    itemClassMint: web3.PublicKey;
    newItemMint: web3.PublicKey;
    craftItemMint: web3.PublicKey;
    componentScope: String;
    craftItemIndex: BN;
    craftEscrowIndex: BN;
    classIndex: BN;
}) => Promise<[web3.PublicKey, number]>;
export declare const getCraftItemEscrow: (args: {
    itemClassMint: web3.PublicKey;
    payer: web3.PublicKey;
    newItemMint: web3.PublicKey;
    craftItemToken: web3.PublicKey;
    craftItemMint: web3.PublicKey;
    amountToMake: BN;
    amountToContributeFromThisContributor: BN;
    componentScope: String;
    craftIndex: BN;
    classIndex: BN;
    craftEscrowIndex: BN;
}) => Promise<[web3.PublicKey, number]>;
export declare const getItemEscrow: (args: {
    itemClassMint: web3.PublicKey;
    payer: web3.PublicKey;
    newItemMint: web3.PublicKey;
    newItemToken: web3.PublicKey;
    amountToMake: BN;
    componentScope: String;
    craftEscrowIndex: BN;
    classIndex: BN;
}) => Promise<[web3.PublicKey, number]>;
export declare const getArtifactIntermediaryStakingAccount: (args: {
    artifactClassMint: web3.PublicKey;
    artifactMint: web3.PublicKey;
    index: BN;
    stakingMint: web3.PublicKey;
    stakingIndex: BN;
}) => Promise<[web3.PublicKey, number]>;
export declare const getArtifactIntermediaryStakingCounterForWarmup: (args: {
    artifactClassMint: web3.PublicKey;
    artifactMint: web3.PublicKey;
    index: BN;
    stakingMint: web3.PublicKey;
    stakingIndex: BN;
}) => Promise<[web3.PublicKey, number]>;
export declare const getArtifactIntermediaryStakingCounterForCooldown: (args: {
    artifactClassMint: web3.PublicKey;
    artifactMint: web3.PublicKey;
    index: BN;
    stakingAccount: web3.PublicKey;
    stakingMint: web3.PublicKey;
    stakingIndex: BN;
}) => Promise<[web3.PublicKey, number]>;
export declare const getArtifactMintStakingAccount: (args: {
    artifactClassMint: web3.PublicKey;
    artifactMint: web3.PublicKey;
    index: BN;
    stakingMint: web3.PublicKey;
}) => Promise<[web3.PublicKey, number]>;
export declare const getMetadata: (mint: web3.PublicKey) => Promise<web3.PublicKey>;
export declare const getEdition: (mint: web3.PublicKey) => Promise<web3.PublicKey>;
//# sourceMappingURL=pda.d.ts.map