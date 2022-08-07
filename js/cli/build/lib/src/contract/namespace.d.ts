import { Program } from "@raindrop-studios/sol-kit";
import { web3 } from "@project-serum/anchor";
import * as NamespaceInstruction from "../instructions/namespace";
import { Namespace } from "../state/namespace";
export declare class NamespaceProgram extends Program.Program {
    instruction: NamespaceInstruction.Instruction;
    static PREFIX: string;
    PROGRAM_ID: web3.PublicKey;
    constructor();
    initializeNamespace(args: NamespaceInstruction.InitializeNamespaceArgs, accounts: NamespaceInstruction.InitializeNamespaceAccounts): Promise<void>;
    fetchNamespace(mint: web3.PublicKey): Promise<Namespace>;
    updateNamespace(args: NamespaceInstruction.UpdateNamespaceArgs, accounts: NamespaceInstruction.UpdateNamespaceAccounts): Promise<void>;
}
