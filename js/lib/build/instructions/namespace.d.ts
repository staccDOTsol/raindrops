import { web3, BN } from "@project-serum/anchor";
import { Program, Instruction as SolKitInstruction } from "@raindrop-studios/sol-kit";
import { PermissivenessSettings } from "../state/namespace";
export interface InitializeNamespaceAccounts {
    namespace?: web3.PublicKey;
    mint: web3.PublicKey;
    metadata: web3.PublicKey;
    masterEdition: web3.PublicKey;
}
export interface InitializeNamespaceArgs {
    desiredNamespaceArraySize: BN;
    uuid: string;
    prettyName: string;
    permissivenessSettings: PermissivenessSettings;
    whitelistedStakingMints: web3.PublicKey[];
}
export interface UpdateNamespaceArgs {
    prettyName: string | null;
    permissivenessSettings: PermissivenessSettings | null;
    whitelistedStakingMints: web3.PublicKey[] | null;
}
export interface UpdateNamespaceAccounts {
    mint: web3.PublicKey;
    namespaceToken: web3.PublicKey;
    tokenHolder: web3.PublicKey;
}
export declare class Instruction extends SolKitInstruction {
    constructor(args: {
        program: Program.Program;
    });
    initializeNamespace(args: InitializeNamespaceArgs, accounts: InitializeNamespaceAccounts): Promise<web3.TransactionInstruction[]>;
    updateNamespace(args: UpdateNamespaceArgs, accounts: UpdateNamespaceAccounts): Promise<web3.TransactionInstruction[]>;
}
//# sourceMappingURL=namespace.d.ts.map