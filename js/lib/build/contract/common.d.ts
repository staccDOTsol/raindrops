/// <reference types="node" />
import { AnchorPermissivenessType } from "../state/common";
import { Program as SolKitProgram } from "@raindrop-studios/sol-kit";
import { Program, web3, BN } from "@project-serum/anchor";
export interface ObjectWrapper<T, V> {
    program: V;
    key: web3.PublicKey;
    object: T;
    data: Buffer;
}
export declare namespace ContractCommon {
    function generateRemainingAccountsGivenPermissivenessToUse(args: {
        permissivenessToUse: AnchorPermissivenessType | null;
        tokenMint: web3.PublicKey;
        parentMint: web3.PublicKey | null;
        parentIndex: BN | null;
        parent: web3.PublicKey | null;
        metadataUpdateAuthority: web3.PublicKey | null;
        program: Program;
    }): Promise<{
        pubkey: web3.PublicKey;
        isWritable: boolean;
        isSigner: boolean;
    }[]>;
    function generateRemainingAccountsForGivenPermissivenessToUse(args: {
        permissivenessToUse: AnchorPermissivenessType | null;
        tokenMint: web3.PublicKey;
        parentClassMint: web3.PublicKey | null;
        parentClass: web3.PublicKey | null;
        metadataUpdateAuthority: web3.PublicKey | null;
        owner: web3.PublicKey;
        program: Program;
    }): Promise<{
        pubkey: web3.PublicKey;
        isWritable: boolean;
        isSigner: boolean;
    }[]>;
    function generateRemainingAccountsForCreateClass(args: {
        permissivenessToUse: AnchorPermissivenessType | null;
        tokenMint: web3.PublicKey;
        parentMint: web3.PublicKey | null;
        parent: web3.PublicKey | null;
        parentOfParentClassMint: web3.PublicKey | null;
        parentOfParentClassIndex: BN | null;
        parentOfParentClass: web3.PublicKey | null;
        metadataUpdateAuthority: web3.PublicKey | null;
        parentUpdateAuthority: web3.PublicKey | null;
        program: SolKitProgram.Program;
    }): Promise<{
        pubkey: web3.PublicKey;
        isWritable: boolean;
        isSigner: boolean;
    }[]>;
    function getTokenAccountForMint(args: {
        mint: web3.PublicKey;
        owner: web3.PublicKey;
        program: Program;
    }): Promise<web3.PublicKey>;
}
//# sourceMappingURL=common.d.ts.map