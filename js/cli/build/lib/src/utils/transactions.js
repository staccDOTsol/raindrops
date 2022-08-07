"use strict";
// @ts-nocheck
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSignedTransaction = exports.sendTransactionWithRetry = exports.sendTransactionWithRetryWithKeypair = exports.sleep = exports.getUnixTs = exports.DEFAULT_TIMEOUT = void 0;
const web3_js_1 = require("@solana/web3.js");
const loglevel_1 = __importDefault(require("loglevel"));
exports.DEFAULT_TIMEOUT = 15000;
const getUnixTs = () => {
    return new Date().getTime() / 1000;
};
exports.getUnixTs = getUnixTs;
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.sleep = sleep;
const sendTransactionWithRetryWithKeypair = async (connection, wallet, instructions, signers, commitment = "singleGossip", includesFeePayer = false, block, beforeSend) => {
    const transaction = new web3_js_1.Transaction();
    instructions.forEach((instruction) => transaction.add(instruction));
    transaction.recentBlockhash = (block || (await connection.getRecentBlockhash(commitment))).blockhash;
    if (includesFeePayer) {
        transaction.setSigners(...signers.map((s) => s.publicKey));
    }
    else {
        transaction.setSigners(
        // fee payed by the wallet owner
        wallet.publicKey, ...signers.map((s) => s.publicKey));
    }
    if (signers.length > 0) {
        transaction.sign(...[wallet, ...signers]);
    }
    else {
        transaction.sign(wallet);
    }
    if (beforeSend) {
        beforeSend();
    }
    const { txid, slot } = await sendSignedTransaction({
        connection,
        signedTransaction: transaction,
    });
    return { txid, slot };
};
exports.sendTransactionWithRetryWithKeypair = sendTransactionWithRetryWithKeypair;
async function sendTransactionWithRetry(connection, wallet, instructions, signers, commitment = "singleGossip") {
    const transaction = new web3_js_1.Transaction();
    instructions.forEach((instruction) => transaction.add(instruction));
    transaction.recentBlockhash = (await connection.getLatestBlockhash(commitment)).blockhash;
    transaction.feePayer = wallet.publicKey;
    if (signers.length > 0) {
        transaction.partialSign(...signers);
    }
    wallet.signTransaction(transaction);
    return sendSignedTransaction({
        connection,
        signedTransaction: transaction,
    });
}
exports.sendTransactionWithRetry = sendTransactionWithRetry;
async function sendSignedTransaction({ signedTransaction, connection, timeout = exports.DEFAULT_TIMEOUT, }) {
    const rawTransaction = signedTransaction.serialize();
    const startTime = (0, exports.getUnixTs)();
    let slot = 0;
    const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
    });
    loglevel_1.default.debug("Started awaiting confirmation for", txid);
    let done = false;
    (async () => {
        while (!done && (0, exports.getUnixTs)() - startTime < timeout) {
            connection.sendRawTransaction(rawTransaction, {
                skipPreflight: true,
            });
            await sleep(500);
        }
    })();
    try {
        const confirmation = await awaitTransactionSignatureConfirmation(txid, timeout, connection, "confirmed", true);
        if (!confirmation)
            throw new Error("Timed out awaiting confirmation on transaction");
        if (confirmation.err) {
            loglevel_1.default.error(confirmation.err);
            throw new Error("Transaction failed: Custom instruction error");
        }
        slot = (confirmation === null || confirmation === void 0 ? void 0 : confirmation.slot) || 0;
    }
    catch (err) {
        loglevel_1.default.error("Timeout Error caught", err);
        if (err.timeout) {
            throw new Error("Timed out awaiting confirmation on transaction");
        }
        loglevel_1.default.error("Got this far.");
        // throw new Error('Transaction failed');
    }
    finally {
        done = true;
    }
    loglevel_1.default.debug("Latency (ms)", txid, (0, exports.getUnixTs)() - startTime);
    return { txid, slot };
}
exports.sendSignedTransaction = sendSignedTransaction;
async function simulateTransaction(connection, transaction, commitment) {
    transaction.recentBlockhash = await connection.getLatestBlockhash();
    const signData = transaction.serializeMessage();
    // @ts-ignore
    const wireTransaction = transaction._serialize(signData);
    const encodedTransaction = wireTransaction.toString("base64");
    const config = { encoding: "base64", commitment };
    const args = [encodedTransaction, config];
    // @ts-ignore
    const res = await connection._rpcRequest("simulateTransaction", args);
    if (res.error) {
        throw new Error("failed to simulate transaction: " + res.error.message);
    }
    return res.result;
}
async function awaitTransactionSignatureConfirmation(txid, timeout, connection, commitment = "recent", queryStatus = false) {
    let done = false;
    let status = {
        slot: 0,
        confirmations: 0,
        err: null,
    };
    let subId = 0;
    // eslint-disable-next-line no-async-promise-executor
    status = await new Promise(async (resolve, reject) => {
        setTimeout(() => {
            if (done) {
                return;
            }
            done = true;
            loglevel_1.default.warn("Rejecting for timeout...");
            reject({ timeout: true });
        }, timeout);
        try {
            subId = connection.onSignature(txid, (result, context) => {
                done = true;
                status = {
                    err: result.err,
                    slot: context.slot,
                    confirmations: 0,
                };
                if (result.err) {
                    loglevel_1.default.warn("Rejected via websocket", result.err);
                    reject(status);
                }
                else {
                    loglevel_1.default.debug("Resolved via websocket", result);
                    resolve(status);
                }
            }, commitment);
        }
        catch (e) {
            done = true;
            loglevel_1.default.error("WS error in setup", txid, e);
        }
        while (!done && queryStatus) {
            // eslint-disable-next-line no-loop-func
            (async () => {
                try {
                    const signatureStatuses = await connection.getSignatureStatuses([
                        txid,
                    ]);
                    status = signatureStatuses && signatureStatuses.value[0];
                    if (!done) {
                        if (!status) {
                            loglevel_1.default.debug("REST null result for", txid, status);
                        }
                        else if (status.err) {
                            loglevel_1.default.error("REST error for", txid, status);
                            done = true;
                            reject(status.err);
                        }
                        else if (!status.confirmations) {
                            loglevel_1.default.debug("REST no confirmations for", txid, status);
                        }
                        else {
                            loglevel_1.default.debug("REST confirmation for", txid, status);
                            done = true;
                            resolve(status);
                        }
                    }
                }
                catch (e) {
                    if (!done) {
                        loglevel_1.default.error("REST connection error: txid", txid, e);
                    }
                }
            })();
            await sleep(2000);
        }
    });
    //@ts-ignore
    if (connection._subscriptionsByHash[subId])
        connection.removeSignatureListener(subId);
    done = true;
    loglevel_1.default.debug("Returning status", status);
    return status;
}
