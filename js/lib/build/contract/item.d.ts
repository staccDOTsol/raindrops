/// <reference types="node" />
import { ObjectWrapper, Program, Transaction, SendOptions } from "@raindrop-studios/sol-kit";
import { web3, BN } from "@project-serum/anchor";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import * as ItemInstruction from "../instructions/item";
import { ItemClass } from "../state/item";
export declare class ItemProgram extends Program.Program {
    instruction: ItemInstruction.Instruction;
    static PREFIX: string;
    PROGRAM_ID: web3.PublicKey;
    constructor();
    fetchItemClass(mint: web3.PublicKey, index: BN): Promise<ItemClassWrapper | null>;
    createItemClass(args: ItemInstruction.CreateItemClassArgs, accounts: ItemInstruction.CreateItemClassAccounts, additionalArgs: ItemInstruction.CreateItemClassAdditionalArgs, options?: SendOptions): Promise<Transaction.SendTransactionResult>;
    updateItemClass(args: ItemInstruction.UpdateItemClassArgs, accounts: ItemInstruction.UpdateItemClassAccounts, additionalArgs: ItemInstruction.UpdateItemClassAdditionalArgs, options?: SendOptions): Promise<Transaction.SendTransactionResult>;
    createItemEscrow(args: ItemInstruction.CreateItemEscrowArgs, accounts: ItemInstruction.CreateItemEscrowAccounts, additionalArgs: ItemInstruction.CreateItemEscrowAdditionalArgs, options?: SendOptions): Promise<Transaction.SendTransactionResult>;
    completeItemEscrowBuildPhase(args: ItemInstruction.CompleteItemEscrowBuildPhaseArgs, accounts: ItemInstruction.CompleteItemEscrowBuildPhaseAccounts, additionalArgs: ItemInstruction.CompleteItemEscrowBuildPhaseAdditionalArgs, options?: SendOptions): Promise<Transaction.SendTransactionResult>;
    deactivateItemEscrow(args: ItemInstruction.DeactivateItemEscrowArgs, accounts: ItemInstruction.DeactivateItemEscrowAccounts, additionalArgs: ItemInstruction.DeactivateItemEscrowAdditionalArgs, options?: SendOptions): Promise<Transaction.SendTransactionResult>;
    updateValidForUseIfWarmupPassed(args: ItemInstruction.UpdateValidForUseIfWarmupPassedArgs, accounts?: ItemInstruction.UpdateValidForUseIfWarmupPassedAccounts, additionalArgs?: ItemInstruction.UpdateValidForUseIfWarmupPassedAdditionalArgs, options?: SendOptions): Promise<Transaction.SendTransactionResult>;
    addCraftItemToEscrow(args: ItemInstruction.AddCraftItemToEscrowArgs, accounts: Omit<ItemInstruction.AddCraftItemToEscrowAccounts, 'craftItemTransferAuthority'>, additionalArgs: ItemInstruction.AddCraftItemToEscrowAdditionalArgs, options?: SendOptions): Promise<Transaction.SendTransactionResult>;
    removeCraftItemFromEscrow(args: ItemInstruction.RemoveCraftItemFromEscrowArgs, accounts: ItemInstruction.RemoveCraftItemFromEscrowAccounts, additionalArgs: ItemInstruction.RemoveCraftItemFromEscrowAdditionalArgs, options?: SendOptions): Promise<Transaction.SendTransactionResult>;
    beginItemActivation(args: Omit<ItemInstruction.BeginItemActivationArgs, "itemClass">, accounts: ItemInstruction.BeginItemActivationAccounts, additionalArgs?: ItemInstruction.BeginItemActivationAdditionalArgs, options?: SendOptions): Promise<Transaction.SendTransactionResult>;
    endItemActivation(args: ItemInstruction.EndItemActivationArgs, accounts: ItemInstruction.EndItemActivationAccounts, additionalArgs?: ItemInstruction.EndItemActivationAdditionalArgs, options?: SendOptions): Promise<Transaction.SendTransactionResult>;
    drainItemEscrow(args: ItemInstruction.DrainItemEscrowArgs, accounts: ItemInstruction.DrainItemEscrowAccounts, additionalArgs?: ItemInstruction.DrainItemEscrowAdditionalArgs, options?: SendOptions): Promise<Transaction.SendTransactionResult>;
    startItemEscrowBuildPhase(args: ItemInstruction.StartItemEscrowBuildPhaseArgs, accounts: ItemInstruction.StartItemEscrowBuildPhaseAccounts, additionalArgs: ItemInstruction.StartItemEscrowBuildPhaseAdditionalArgs, options?: SendOptions): Promise<Transaction.SendTransactionResult>;
    updateItem(args: ItemInstruction.UpdateItemArgs, accounts: ItemInstruction.UpdateItemAccounts, additionalArgs: ItemInstruction.UpdateItemAdditionalArgs, options?: SendOptions): Promise<Transaction.SendTransactionResult>;
}
export declare class ItemClassWrapper implements ObjectWrapper<ItemClass, ItemProgram> {
    program: ItemProgram;
    key: web3.PublicKey;
    object: ItemClass;
    data: Buffer;
    constructor(args: {
        program: ItemProgram;
        key: web3.PublicKey;
        object: ItemClass;
        data: Buffer;
    });
}
export declare function getItemProgram(anchorWallet: NodeWallet | web3.Keypair, env: string, customRpcUrl: string): Promise<ItemProgram>;
export declare class ItemClassNotFoundError extends Error {
    constructor(message: string);
}
//# sourceMappingURL=item.d.ts.map