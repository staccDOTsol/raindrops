import { Wallet } from "@project-serum/anchor/dist/cjs/provider";
import { Blockhash, Commitment, Connection, FeeCalculator, Keypair, Transaction, TransactionInstruction } from "@solana/web3.js";
export declare const DEFAULT_TIMEOUT = 15000;
export declare const getUnixTs: () => number;
export declare function sleep(ms: number): Promise<void>;
interface BlockhashAndFeeCalculator {
    blockhash: Blockhash;
    feeCalculator: FeeCalculator;
}
export declare const sendTransactionWithRetryWithKeypair: (connection: Connection, wallet: Keypair, instructions: TransactionInstruction[], signers: Keypair[], commitment?: Commitment, includesFeePayer?: boolean, block?: BlockhashAndFeeCalculator, beforeSend?: () => void) => Promise<{
    txid: string;
    slot: number;
}>;
export declare function sendTransactionWithRetry(connection: Connection, wallet: Wallet, instructions: Array<TransactionInstruction>, signers: Array<Keypair>, commitment?: Commitment): Promise<string | {
    txid: string;
    slot: number;
}>;
export declare function sendSignedTransaction({ signedTransaction, connection, timeout, }: {
    signedTransaction: Transaction;
    connection: Connection;
    sendingMessage?: string;
    sentMessage?: string;
    successMessage?: string;
    timeout?: number;
}): Promise<{
    txid: string;
    slot: number;
}>;
export {};
//# sourceMappingURL=transactions.d.ts.map