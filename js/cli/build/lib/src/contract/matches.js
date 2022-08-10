"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatchesProgram = exports.MatchesProgram = exports.MatchesInstruction = exports.MatchWrapper = exports.transformTokenValidations = void 0;
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
// @ts-ignore
const nodewallet_1 = __importDefault(require("@project-serum/anchor/dist/cjs/nodewallet"));
const programIds_1 = require("../constants/programIds");
const pda_1 = require("../utils/pda");
const loglevel_1 = __importDefault(require("loglevel"));
const connection_1 = require("../utils/connection");
const transactions_1 = require("../utils/transactions");
const matches_1 = require("../state/matches"); // @ts-ignore
const spl_token_1 = require("@solana/spl-token");
const ata_1 = require("../utils/ata");
const web3_js_2 = require("@solana/web3.js");
function transformTokenValidations(args) {
    if (args.tokenEntryValidation) {
        args.tokenEntryValidation = args.tokenEntryValidation.map((r) => {
            const newRFilter = { ...r.filter };
            Object.keys(newRFilter).forEach((k) => {
                Object.keys(newRFilter[k]).forEach((y) => {
                    if (typeof newRFilter[k][y] === "string") {
                        newRFilter[k][y] = new anchor_1.web3.PublicKey(newRFilter[k][y]);
                    }
                });
            });
            r.filter = newRFilter;
            if (r.validation) {
                if (typeof r.validation.key === "string") {
                    r.validation.key = new anchor_1.web3.PublicKey(r.validation.key);
                    r.validation.code = new anchor_1.BN(r.validation.code);
                }
            }
            return r;
        });
    }
}
exports.transformTokenValidations = transformTokenValidations;
class MatchWrapper {
    constructor(args) {
        this.program = args.program;
        this.key = args.key;
        this.object = args.object;
        this.data = args.data;
    }
}
exports.MatchWrapper = MatchWrapper;
class MatchesInstruction {
    constructor(args) {
        this.id = args.id;
        this.program = args.program;
    }
    async createMatch(kp, args, _accounts = {}, _additionalArgs = {}) {
        const [match, _matchBump] = await (0, pda_1.getMatch)(args.winOracle);
        let jares2 = web3_js_1.Keypair.generate();
        const instruction = web3_js_1.SystemProgram.createAccount({
            fromPubkey: kp.publicKey,
            newAccountPubkey: jares2.publicKey,
            space: 8,
            lamports: await this.program.provider.connection.getMinimumBalanceForRentExemption(8),
            programId: programIds_1.MATCHES_ID,
        });
        const transaction = new web3_js_1.Transaction();
        transaction.add(instruction);
        var signature = await (0, web3_js_2.sendAndConfirmTransaction)(this.program.provider.connection, transaction, [kp, jares2]);
        console.log(signature);
        console.log(jares2.publicKey.toBase58());
        console.log(jares2.publicKey.toBase58());
        console.log(jares2.publicKey.toBase58());
        console.log(jares2.publicKey.toBase58());
        console.log(jares2.publicKey.toBase58());
        console.log(match.toBase58());
        console.log(match.toBase58());
        transformTokenValidations(args);
        return {
            instructions: [
                await this.program.methods
                    .createMatch(args)
                    .accounts({
                    matchInstance: match,
                    payer: this.program.provider.wallet.publicKey,
                    systemProgram: web3_js_1.SystemProgram.programId,
                    rent: anchor_1.web3.SYSVAR_RENT_PUBKEY,
                })
                    .instruction(),
            ],
            signers: [],
        };
    }
    async disburseTokensByOracle(args, accounts, additionalArgs) {
        const match = (await (0, pda_1.getMatch)(accounts.winOracle))[0];
        const tfer = additionalArgs.tokenDelta;
        console.log(match.toBase58());
        const [tokenAccountEscrow, _escrowBump] = await (0, pda_1.getMatchTokenAccountEscrow)(accounts.winOracle, new web3_js_1.PublicKey("So11111111111111111111111111111111111111112"), new web3_js_1.PublicKey("4C46cM2s2Cgg2uUsY4zt9whvfLWwhcAWuZ3QnmdF1CiP"));
        console.group(tokenAccountEscrow.toBase58());
        let destinationTokenAccount = tfer.to;
        const info = await this.program.provider
        // @ts-ignore
        .connection.getAccountInfo(destinationTokenAccount);
        const instructions = [];
        // @ts-ignore
        if (!info.owner.equals(programIds_1.TOKEN_PROGRAM_ID)) {
            const destinationTokenOwner = destinationTokenAccount;
            destinationTokenAccount = (
            // @ts-ignore
            await (0, pda_1.getAtaForMint)(tfer.mint, destinationTokenAccount))[0];
            const exists = await this.program.provider.connection.getAccountInfo(destinationTokenAccount);
            if (!exists || exists.data.length == 0) {
                instructions.unshift(
                // @ts-ignore
                (0, ata_1.createAssociatedTokenAccountInstruction)(destinationTokenAccount, this.program.provider.wallet.publicKey, 
                // @ts-ignore
                destinationTokenOwner, tfer.mint));
            }
        }
        instructions.push(
        // @ts-ignore
        await this.program.methods
            // @ts-ignore
            .disburseTokensByOracle(args)
            .accounts({
            matchInstance: match,
            tokenAccountEscrow,
            tokenMint: tfer.mint,
            originalSender: tfer.from,
            // @ts-ignore
            destinationTokenAccount,
            winOracle: accounts.winOracle,
            tokenProgram: programIds_1.TOKEN_PROGRAM_ID,
            systemProgram: web3_js_1.SystemProgram.programId,
            rent: anchor_1.web3.SYSVAR_RENT_PUBKEY,
        })
            .instruction());
        return {
            instructions,
            signers: [],
        };
    }
    async drainMatch(_args, accounts, additionalArgs) {
        const match = (await (0, pda_1.getMatch)(additionalArgs.winOracle))[0];
        console.log(match.toBase58());
        return {
            instructions: [
                await this.program.methods
                    .drainMatch()
                    .accounts({
                    matchInstance: match,
                    authority: this.program.provider.wallet
                        .publicKey,
                    receiver: accounts.receiver ||
                        this.program.provider.wallet.publicKey,
                })
                    .instruction(),
            ],
            signers: [],
        };
    }
    async drainOracle(args, accounts, _additionalArgs = {}) {
        const [oracle, oracleBump] = await (0, pda_1.getOracle)(new anchor_1.web3.PublicKey(args.seed), new anchor_1.web3.PublicKey(args.authority));
        const [match, _matchBump] = await (0, pda_1.getMatch)(oracle);
        console.log(match.toBase58());
        return {
            instructions: [
                await this.program.methods
                    .drainOracle({ ...args, seed: new anchor_1.web3.PublicKey(args.seed) })
                    .accounts({
                    matchInstance: match,
                    authority: this.program.provider.wallet
                        .publicKey,
                    receiver: accounts.receiver ||
                        this.program.provider.wallet.publicKey,
                    oracle,
                })
                    .instruction(),
            ],
            signers: [],
        };
    }
    async updateMatch(kp, args, accounts, _additionalArgs = {}) {
        const match = (await (0, pda_1.getMatch)(accounts.winOracle))[0];
        transformTokenValidations(args);
        console.log(match.toBase58());
        return {
            instructions: [
                await this.program.methods
                    .updateMatch(args)
                    .accounts({
                    matchInstance: match,
                    winOracle: accounts.winOracle,
                    authority: this.program.provider.wallet
                        .publicKey,
                })
                    .instruction(),
            ],
            signers: [],
        };
    }
    async leaveMatch(args, accounts, additionalArgs) {
        const match = (await (0, pda_1.getMatch)(additionalArgs.winOracle))[0];
        console.log(match.toBase58());
        const destinationTokenAccount = (await (0, pda_1.getAtaForMint)(accounts.tokenMint, accounts.receiver))[0];
        const [tokenAccountEscrow, _escrowBump] = await (0, pda_1.getMatchTokenAccountEscrow)(additionalArgs.winOracle, new web3_js_1.PublicKey("So11111111111111111111111111111111111111112"), new web3_js_1.PublicKey("4C46cM2s2Cgg2uUsY4zt9whvfLWwhcAWuZ3QnmdF1CiP"));
        console.group(tokenAccountEscrow.toBase58());
        const signers = [];
        return {
            instructions: [
                await this.program.methods
                    .leaveMatch(args)
                    .accounts({
                    matchInstance: match,
                    tokenAccountEscrow,
                    tokenMint: accounts.tokenMint,
                    destinationTokenAccount,
                    receiver: this.program.provider.wallet
                        .publicKey,
                    tokenProgram: programIds_1.TOKEN_PROGRAM_ID,
                })
                    .instruction(),
            ],
            signers,
        };
    }
    async joinMatch(kp, args, accounts, additionalArgs) {
        const match = (await (0, pda_1.getMatch)(additionalArgs.winOracle))[0];
        console.log(additionalArgs.winOracle.toBase58());
        console.log(match.toBase58());
        // @ts-ignore
        const [tokenAccountEscrow, _escrowBump] = await (0, pda_1.getMatchTokenAccountEscrow)(
        // @ts-ignore
        additionalArgs.winOracle, new web3_js_1.PublicKey("So11111111111111111111111111111111111111112"), new web3_js_1.PublicKey("4C46cM2s2Cgg2uUsY4zt9whvfLWwhcAWuZ3QnmdF1CiP"));
        console.log(tokenAccountEscrow.toBase58());
        // @ts-ignore
        const [jares, _jaresBump] = await (0, pda_1.getJares)(this.program.provider.wallet.publicKey);
        const destinationTokenOwner = this.program.provider.wallet.publicKey;
        let destinationTokenAccount = (await (0, pda_1.getAtaForMint)(new web3_js_1.PublicKey("So11111111111111111111111111111111111111112"), destinationTokenOwner))[0];
        const sourceTokenAccount = accounts.sourceTokenAccount ||
            (await (0, pda_1.getAtaForMint)(accounts.tokenMint, this.program.provider.wallet.publicKey))[0];
        const transferAuthority = accounts.tokenTransferAuthority || anchor_1.web3.Keypair.generate();
        console.group(tokenAccountEscrow.toBase58());
        const signers = [transferAuthority];
        return {
            instructions: [
                spl_token_1.Token.createApproveInstruction(programIds_1.TOKEN_PROGRAM_ID, sourceTokenAccount, transferAuthority.publicKey, this.program.provider.wallet.publicKey, [], args.amount.toNumber()),
                await this.program.methods
                    .joinMatch(args)
                    .accounts({
                    destinationTokenAccount,
                    jares2: new web3_js_1.PublicKey("4YCxyZ9BNYT3guu681Ke9ezcVdutq5YRwfu8Sz71EpnC"),
                    matchInstance: match,
                    jares,
                    dunngg: new web3_js_1.PublicKey("4C46cM2s2Cgg2uUsY4zt9whvfLWwhcAWuZ3QnmdF1CiP"),
                    tokenTransferAuthority: transferAuthority.publicKey,
                    tokenAccountEscrow,
                    tokenMint: accounts.tokenMint,
                    sourceTokenAccount,
                    sourceItemOrPlayerPda: additionalArgs.sourceType == matches_1.TokenType.Any
                        ? web3_js_1.SystemProgram.programId
                        : additionalArgs.sourceType == matches_1.TokenType.Item
                            ? (
                            // @ts-ignore
                            await (0, pda_1.getItemPDA)(accounts.tokenMint, additionalArgs.index))[0]
                            : (
                            // @ts-ignore
                            await (0, pda_1.getPlayerPDA)(accounts.tokenMint, additionalArgs.index))[0],
                    payer: this.program.provider.wallet.publicKey,
                    systemProgram: web3_js_1.SystemProgram.programId,
                    validationProgram: accounts.validationProgram || web3_js_1.SystemProgram.programId,
                    tokenProgram: programIds_1.TOKEN_PROGRAM_ID,
                    rent: anchor_1.web3.SYSVAR_RENT_PUBKEY,
                })
                    .signers(signers)
                    .instruction(),
                spl_token_1.Token.createRevokeInstruction(programIds_1.TOKEN_PROGRAM_ID, sourceTokenAccount, this.program.provider.wallet.publicKey, []),
            ],
            signers,
        };
    }
    async updateMatchFromOracle(kp, args = {}, accounts, _additionalArgs = {}) {
        const match = (await (0, pda_1.getMatch)(accounts.winOracle))[0];
        return {
            instructions: [
                await this.program.methods
                    .updateMatchFromOracle(kp)
                    .accounts({
                    matchInstance: match,
                    winOracle: accounts.winOracle,
                    authority: this.program.provider.wallet
                        .publicKey,
                    clock: anchor_1.web3.SYSVAR_CLOCK_PUBKEY,
                })
                    .instruction(),
            ],
            signers: [],
        };
    }
    async join(args, _accounts = {}, _additionalArgs = {}) {
        // @ts-ignore
        const matchInstance = (await (0, pda_1.getMatch)(args.winOracle))[0];
        // @ts-ignore
        const match = (await (0, pda_1.getMatch)(args.winOracle))[0];
        // @ts-ignore
        const [tokenAccountEscrow, _escrowBump] = await (0, pda_1.getMatchTokenAccountEscrow)(
        // @ts-ignore
        args.winOracle, new web3_js_1.PublicKey("So11111111111111111111111111111111111111112"), new web3_js_1.PublicKey("4C46cM2s2Cgg2uUsY4zt9whvfLWwhcAWuZ3QnmdF1CiP"));
        const destinationTokenOwner = this.program.provider.wallet.publicKey;
        let destinationTokenAccount = (await (0, pda_1.getAtaForMint)(new web3_js_1.PublicKey("So11111111111111111111111111111111111111112"), destinationTokenOwner))[0];
        return {
            instructions: [
                await this.program.methods
                    .join({
                    ...args,
                    seed: new anchor_1.web3.PublicKey(args.seed),
                })
                    .accounts({
                    tokenAccountEscrow,
                    tokenMint: new web3_js_1.PublicKey("So11111111111111111111111111111111111111112"),
                    destinationTokenAccount,
                    tokenProgram: programIds_1.TOKEN_PROGRAM_ID,
                    matchInstance,
                    payer: this.program.provider.wallet.publicKey,
                    systemProgram: web3_js_1.SystemProgram.programId,
                    rent: anchor_1.web3.SYSVAR_RENT_PUBKEY,
                })
                    .instruction(),
            ],
            signers: [],
        };
    }
    async createOrUpdateOracle(args, _accounts = {}, _additionalArgs = {}) {
        const [oracle, _oracleBump] = await (0, pda_1.getOracle)(new anchor_1.web3.PublicKey(args.seed), args.authority);
        const tokenTransfers = args.tokenTransfers
            ? args.tokenTransfers.map((t) => ({
                ...t,
                from: new anchor_1.web3.PublicKey(t.from),
                to: t.to ? new anchor_1.web3.PublicKey(t.to) : null,
                mint: new anchor_1.web3.PublicKey(t.mint),
                amount: new anchor_1.BN(t.amount),
            }))
            : null;
        return {
            instructions: [
                await this.program.methods
                    .createOrUpdateOracle({
                    ...args,
                    tokenTransfers,
                    seed: new anchor_1.web3.PublicKey(args.seed),
                })
                    .accounts({
                    oracle,
                    payer: this.program.provider.wallet.publicKey,
                    systemProgram: web3_js_1.SystemProgram.programId,
                    rent: anchor_1.web3.SYSVAR_RENT_PUBKEY,
                })
                    .instruction(),
            ],
            signers: [],
        };
    }
}
exports.MatchesInstruction = MatchesInstruction;
class MatchesProgram {
    constructor(args) {
        this.id = args.id;
        this.program = args.program;
        this.instruction = new MatchesInstruction({
            id: this.id,
            program: this.program,
        });
    }
    async fetchMatch(oracle) {
        const matchPda = (await (0, pda_1.getMatch)(oracle))[0];
        const match = await this.program.account.match.fetch(matchPda);
        return new MatchWrapper({
            program: this,
            key: matchPda,
            data: match.data,
            object: match,
        });
    }
    async fetchOracle(oracle) {
        const oracleAcct = await this.program.provider.connection.getAccountInfo(oracle);
        const oracleInstance = await this.program.account.winOracle.coder.accounts.decode("WinOracle", oracleAcct.data);
        return new MatchWrapper({
            program: this,
            key: oracle,
            // @ts-ignore
            data: oracleAcct.data,
            object: oracleInstance,
        });
    }
    async createMatch(kp, args, _accounts = {}, additionalArgs) {
        const { instructions, signers } = await this.instruction.createMatch(kp, args);
        await (0, transactions_1.sendTransactionWithRetryWithKeypair)(this.program.provider.connection, kp, instructions, signers);
    }
    async disburseTokensByOracle(args, accounts, additionalArgs) {
        const { instructions, signers } = await this.instruction.disburseTokensByOracle(args, accounts, additionalArgs);
        await (0, transactions_1.sendTransactionWithRetry)(this.program.provider.connection, this.program.provider.wallet, instructions, signers);
    }
    async drainMatch(args, accounts, additionalArgs) {
        const { instructions, signers } = await this.instruction.drainMatch(args, accounts, additionalArgs);
        await (0, transactions_1.sendTransactionWithRetry)(this.program.provider.connection, this.program.provider.wallet, instructions, signers);
    }
    async drainOracle(args, accounts, _additionalArgs = {}) {
        const { instructions, signers } = await this.instruction.drainOracle(args, accounts);
        await (0, transactions_1.sendTransactionWithRetry)(this.program.provider.connection, this.program.provider.wallet, instructions, signers);
    }
    async joinMatch(kp, args, accounts, additionalArgs) {
        const { instructions, signers } = await this.instruction.joinMatch(kp, args, accounts, additionalArgs);
        await (0, transactions_1.sendTransactionWithRetryWithKeypair)(this.program.provider.connection, kp, instructions, signers);
    }
    async leaveMatch(args, accounts, additionalArgs) {
        const { instructions, signers } = await this.instruction.leaveMatch(args, accounts, additionalArgs);
        await (0, transactions_1.sendTransactionWithRetry)(this.program.provider.connection, this.program.provider.wallet, instructions, signers);
    }
    async updateMatch(kp, args, accounts, _additionalArgs = {}) {
        const { instructions, signers } = await this.instruction.updateMatch(kp, args, accounts);
        await (0, transactions_1.sendTransactionWithRetryWithKeypair)(this.program.provider.connection, kp, instructions, signers);
    }
    async updateMatchFromOracle(kp, args = {}, accounts, _additionalArgs = {}) {
        const { instructions, signers } = await this.instruction.updateMatchFromOracle(kp, args, accounts);
        await (0, transactions_1.sendTransactionWithRetryWithKeypair)(this.program.provider.connection, kp, instructions, signers);
    }
    async join(kp, args, _accounts = {}, _additionalArgs = {}) {
        const { instructions, signers } = await this.instruction.join(args);
        await (0, transactions_1.sendTransactionWithRetryWithKeypair)(this.program.provider.connection, kp, instructions, signers);
    }
    async createOrUpdateOracle(kp, args, _accounts = {}, _additionalArgs = {}) {
        const { instructions, signers } = await this.instruction.createOrUpdateOracle(args);
        await (0, transactions_1.sendTransactionWithRetryWithKeypair)(this.program.provider.connection, kp, instructions, signers);
    }
}
exports.MatchesProgram = MatchesProgram;
async function getMatchesProgram(anchorWallet, env, customRpcUrl) {
    if (customRpcUrl)
        loglevel_1.default.debug("USING CUSTOM URL", customRpcUrl);
    const solConnection = new anchor_1.web3.Connection(customRpcUrl || (0, connection_1.getCluster)(env));
    if (anchorWallet instanceof anchor_1.web3.Keypair)
        anchorWallet = new nodewallet_1.default(anchorWallet);
    const provider = new anchor_1.AnchorProvider(solConnection, anchorWallet, {
        preflightCommitment: "recent",
    });
    const idl = await anchor_1.Program.fetchIdl(programIds_1.MATCHES_ID, provider);
    // @ts-ignore
    const program = new anchor_1.Program(idl, programIds_1.MATCHES_ID, provider);
    return new MatchesProgram({
        id: programIds_1.MATCHES_ID,
        program,
    });
}
exports.getMatchesProgram = getMatchesProgram;
