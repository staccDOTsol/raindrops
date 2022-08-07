import { web3, BN } from "@project-serum/anchor";
import { Program, Instruction as SolKitInstruction } from "@raindrop-studios/sol-kit";
import { AnchorPermissivenessType } from "../../src/state/common";
import { ItemClassWrapper } from "../contract/item";
export declare class Instruction extends SolKitInstruction {
    constructor(args: {
        program: Program.Program;
    });
    createItemClass(args: CreateItemClassArgs, accounts: CreateItemClassAccounts, additionalArgs: CreateItemClassAdditionalArgs): Promise<web3.TransactionInstruction[]>;
    updateItemClass(args: UpdateItemClassArgs, accounts: UpdateItemClassAccounts, additionalArgs: UpdateItemClassAdditionalArgs): Promise<web3.TransactionInstruction[]>;
    createItemEscrow(args: CreateItemEscrowArgs, accounts: CreateItemEscrowAccounts, additionalArgs: CreateItemEscrowAdditionalArgs): Promise<web3.TransactionInstruction[]>;
    completeItemEscrowBuildPhase(args: CompleteItemEscrowBuildPhaseArgs, accounts: CompleteItemEscrowBuildPhaseAccounts, additionalArgs: CompleteItemEscrowBuildPhaseAdditionalArgs): Promise<web3.TransactionInstruction[]>;
    deactivateItemEscrow(args: DeactivateItemEscrowArgs, accounts: DeactivateItemEscrowAccounts, additionalArgs: DeactivateItemEscrowAdditionalArgs): Promise<web3.TransactionInstruction[]>;
    updateValidForUseIfWarmupPassed(args: UpdateValidForUseIfWarmupPassedArgs, accounts?: UpdateValidForUseIfWarmupPassedAccounts, additionalArgs?: UpdateValidForUseIfWarmupPassedAdditionalArgs): Promise<web3.TransactionInstruction[]>;
    addCraftItemToEscrow(args: AddCraftItemToEscrowArgs, accounts: AddCraftItemToEscrowAccounts, additionalArgs: AddCraftItemToEscrowAdditionalArgs): Promise<any[]>;
    removeCraftItemFromEscrow(args: RemoveCraftItemFromEscrowArgs, accounts: RemoveCraftItemFromEscrowAccounts, additionalArgs: RemoveCraftItemFromEscrowAdditionalArgs): Promise<web3.TransactionInstruction[]>;
    beginItemActivation(args: BeginItemActivationArgs, accounts: BeginItemActivationAccounts, _additionalArgs?: BeginItemActivationAdditionalArgs): Promise<web3.TransactionInstruction[]>;
    endItemActivation(args: EndItemActivationArgs, accounts: EndItemActivationAccounts, _additionalArgs?: EndItemActivationAdditionalArgs): Promise<web3.TransactionInstruction[]>;
    drainItemEscrow(args: DrainItemEscrowArgs, accounts: DrainItemEscrowAccounts, _additionalArgs?: DrainItemEscrowAdditionalArgs): Promise<web3.TransactionInstruction[]>;
    startItemEscrowBuildPhase(args: StartItemEscrowBuildPhaseArgs, accounts: StartItemEscrowBuildPhaseAccounts, additionalArgs: StartItemEscrowBuildPhaseAdditionalArgs): Promise<web3.TransactionInstruction[]>;
    updateItem(args: UpdateItemArgs, accounts: UpdateItemAccounts, additionalArgs: UpdateItemAdditionalArgs): Promise<web3.TransactionInstruction[]>;
}
export interface CreateItemClassArgs {
    classIndex: BN;
    parentOfParentClassIndex: null | BN;
    parentClassIndex: null | BN;
    space: BN;
    desiredNamespaceArraySize: number;
    updatePermissivenessToUse: null | AnchorPermissivenessType;
    storeMint: boolean;
    storeMetadataFields: boolean;
    itemClassData: any;
}
export interface CreateItemClassAccounts {
    itemMint: web3.PublicKey;
    parent: web3.PublicKey | null;
    parentMint: web3.PublicKey | null;
    parentOfParentClassMint: web3.PublicKey | null;
    metadataUpdateAuthority: web3.PublicKey | null;
    parentUpdateAuthority: web3.PublicKey | null;
}
export interface CreateItemClassAdditionalArgs {
}
export interface UpdateItemClassArgs {
    classIndex: BN;
    updatePermissivenessToUse: null | AnchorPermissivenessType;
    parentClassIndex: null | BN;
    itemClassData: any | null;
}
export interface UpdateItemClassAccounts {
    itemMint: web3.PublicKey;
    parent: web3.PublicKey | null;
    parentMint: web3.PublicKey | null;
    metadataUpdateAuthority: web3.PublicKey | null;
}
export interface UpdateItemClassAdditionalArgs {
    permissionless: boolean;
}
export interface CreateItemEscrowArgs {
    classIndex: BN;
    parentClassIndex: null | BN;
    craftEscrowIndex: BN;
    componentScope: String;
    amountToMake: BN;
    namespaceIndex: BN | null;
    buildPermissivenessToUse: null | AnchorPermissivenessType;
    itemClassMint: web3.PublicKey;
}
export interface CreateItemEscrowAccounts {
    itemClassMint: web3.PublicKey;
    newItemMint: web3.PublicKey;
    newItemToken: web3.PublicKey | null;
    newItemTokenHolder: web3.PublicKey | null;
    parentMint: web3.PublicKey | null;
    metadataUpdateAuthority: web3.PublicKey | null;
}
export interface CreateItemEscrowAdditionalArgs {
}
export interface CompleteItemEscrowBuildPhaseArgs {
    classIndex: BN;
    newItemIndex: BN;
    parentClassIndex: null | BN;
    craftEscrowIndex: BN;
    componentScope: String;
    amountToMake: BN;
    space: BN;
    itemClassMint: web3.PublicKey;
    originator: web3.PublicKey;
    buildPermissivenessToUse: null | AnchorPermissivenessType;
    storeMint: boolean;
    storeMetadataFields: boolean;
}
export interface CompleteItemEscrowBuildPhaseAccounts {
    itemClassMint: web3.PublicKey;
    newItemMint: web3.PublicKey;
    newItemToken: web3.PublicKey | null;
    newItemTokenHolder: web3.PublicKey | null;
    parentMint: web3.PublicKey | null;
    metadataUpdateAuthority: web3.PublicKey | null;
}
export interface CompleteItemEscrowBuildPhaseAdditionalArgs {
}
export interface DeactivateItemEscrowArgs {
    classIndex: BN;
    parentClassIndex: null | BN;
    craftEscrowIndex: BN;
    componentScope: String;
    amountToMake: BN;
    itemClassMint: web3.PublicKey;
    newItemMint: web3.PublicKey;
    newItemToken: web3.PublicKey;
}
export interface DeactivateItemEscrowAccounts {
}
export interface DeactivateItemEscrowAdditionalArgs {
}
export interface UpdateValidForUseIfWarmupPassedArgs {
    classIndex: BN;
    index: BN;
    usageIndex: number;
    itemClassMint: web3.PublicKey;
    itemMint: web3.PublicKey;
    amount: BN;
    usageProof: null | web3.PublicKey;
    usage: null;
}
export interface UpdateValidForUseIfWarmupPassedAccounts {
}
export interface UpdateValidForUseIfWarmupPassedAdditionalArgs {
}
export interface AddCraftItemToEscrowArgs {
    classIndex: BN;
    parentClassIndex: null | BN;
    craftItemIndex: BN;
    craftEscrowIndex: BN;
    craftItemClassIndex: BN;
    craftItemClassMint: web3.PublicKey;
    componentScope: String;
    amountToMake: BN;
    amountToContributeFromThisContributor: BN;
    newItemMint: web3.PublicKey;
    originator: web3.PublicKey;
    namespaceIndex: BN | null;
    buildPermissivenessToUse: null | AnchorPermissivenessType;
    itemClassMint: web3.PublicKey;
    componentProof: web3.PublicKey | null;
    component: any | null;
    craftUsageInfo: {
        craftUsageStateProof: web3.PublicKey;
        craftUsageState: {
            index: number;
            uses: BN;
            activatedAt: BN | null;
        };
        craftUsageProof: web3.PublicKey;
        craftUsage: any;
    } | null;
}
export interface AddCraftItemToEscrowAccounts {
    itemClassMint: web3.PublicKey;
    newItemToken: web3.PublicKey | null;
    newItemTokenHolder: web3.PublicKey | null;
    craftItemTokenMint: web3.PublicKey;
    parentMint: web3.PublicKey | null;
    metadataUpdateAuthority: web3.PublicKey | null;
    craftItemTransferAuthority: web3.PublicKey;
}
export interface AddCraftItemToEscrowAdditionalArgs {
}
export interface RemoveCraftItemFromEscrowArgs {
    craftItemTokenMint: web3.PublicKey;
    classIndex: BN;
    parentClassIndex: null | BN;
    craftItemIndex: BN;
    craftEscrowIndex: BN;
    craftItemClassIndex: BN;
    craftItemClassMint: web3.PublicKey;
    componentScope: String;
    amountToMake: BN;
    amountContributedFromThisContributor: BN;
    newItemMint: web3.PublicKey;
    originator: web3.PublicKey;
    namespaceIndex: BN | null;
    buildPermissivenessToUse: null | AnchorPermissivenessType;
    itemClassMint: web3.PublicKey;
    componentProof: web3.PublicKey | null;
    component: any | null;
}
export interface RemoveCraftItemFromEscrowAccounts {
    itemClassMint: web3.PublicKey;
    newItemToken: web3.PublicKey | null;
    newItemTokenHolder: web3.PublicKey | null;
    parentMint: web3.PublicKey | null;
    metadataUpdateAuthority: web3.PublicKey | null;
}
export interface RemoveCraftItemFromEscrowAdditionalArgs {
}
export interface BeginItemActivationArgs {
    classIndex: BN;
    index: BN;
    itemClassMint: web3.PublicKey;
    itemMarkerSpace: number;
    usagePermissivenessToUse: null | AnchorPermissivenessType;
    amount: BN;
    usageIndex: number;
    usageInfo: null;
    itemClass: ItemClassWrapper;
}
export interface BeginItemActivationAccounts {
    itemMint: web3.PublicKey;
    itemAccount: null | web3.PublicKey;
    itemTransferAuthority: null | web3.Keypair;
    metadataUpdateAuthority: web3.PublicKey | null;
}
export interface BeginItemActivationAdditionalArgs {
}
export interface EndItemActivationArgs {
    classIndex: BN;
    index: BN;
    itemMint: web3.PublicKey;
    itemClassMint: web3.PublicKey;
    usagePermissivenessToUse: null | AnchorPermissivenessType;
    amount: BN;
    usageIndex: number;
    usageProof: null | web3.PublicKey[];
    usage: null;
}
export interface EndItemActivationAccounts {
    originator: web3.PublicKey;
    metadataUpdateAuthority: web3.PublicKey | null;
}
export interface EndItemActivationAdditionalArgs {
}
export interface DrainItemEscrowArgs {
    classIndex: BN;
    parentClassIndex: null | BN;
    craftEscrowIndex: BN;
    componentScope: String;
    amountToMake: BN;
    itemClassMint: web3.PublicKey;
    newItemMint: web3.PublicKey;
    newItemToken: web3.PublicKey;
}
export interface DrainItemEscrowAccounts {
    originator: web3.PublicKey | null;
}
export interface DrainItemEscrowAdditionalArgs {
}
export interface StartItemEscrowBuildPhaseArgs {
    classIndex: BN;
    parentClassIndex: null | BN;
    craftEscrowIndex: BN;
    componentScope: String;
    amountToMake: BN;
    itemClassMint: web3.PublicKey;
    originator: web3.PublicKey;
    newItemMint: web3.PublicKey;
    buildPermissivenessToUse: null | AnchorPermissivenessType;
    endNodeProof: web3.PublicKey | null;
    totalSteps: BN | null;
}
export interface StartItemEscrowBuildPhaseAccounts {
    itemClassMint: web3.PublicKey;
    newItemToken: web3.PublicKey | null;
    newItemTokenHolder: web3.PublicKey | null;
    parentMint: web3.PublicKey | null;
    metadataUpdateAuthority: web3.PublicKey | null;
}
export interface StartItemEscrowBuildPhaseAdditionalArgs {
}
export interface UpdateItemArgs {
    classIndex: BN;
    index: BN;
    itemMint: web3.PublicKey;
    itemClassMint: web3.PublicKey;
}
export interface UpdateItemAccounts {
}
export interface UpdateItemAdditionalArgs {
}
//# sourceMappingURL=item.d.ts.map