
import {
  web3,
  Program,
  BN,
  Provider,
  AnchorProvider,// @ts-ignore

} from "@project-serum/anchor";
import { Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
// @ts-ignore

import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { MATCHES_ID, TOKEN_PROGRAM_ID } from "../constants/programIds";
import {
  getAtaForMint,
  getItemPDA,
  getMatch,
  getMatchTokenAccountEscrow,
  getOracle,
  getPlayerPDA,getJares
} from "../utils/pda";
import { ObjectWrapper } from "./common";// @ts-ignore

import log from "loglevel";
import { getCluster } from "../utils/connection";
import { sendTransactionWithRetry, sendTransactionWithRetryWithKeypair } from "../utils/transactions";
import {
  AnchorMatchState,
  AnchorTokenDelta,
  AnchorTokenEntryValidation,
  TokenType,
} from "../state/matches";// @ts-ignore

import { Token } from "@solana/spl-token";
import { createAssociatedTokenAccountInstruction } from "../utils/ata";
import { Key } from "readline";
import { PDA } from "../utils";
import { sendAndConfirmTransaction } from "@solana/web3.js";

export function transformTokenValidations(args: {
  tokenEntryValidation: AnchorTokenEntryValidation[] | null;
}) {
  if (args.tokenEntryValidation) {
    args.tokenEntryValidation = args.tokenEntryValidation.map((r) => {
      const newRFilter = { ...r.filter };
      Object.keys(newRFilter).forEach((k) => {
        Object.keys(newRFilter[k]).forEach((y) => {
          if (typeof newRFilter[k][y] === "string") {
            newRFilter[k][y] = new web3.PublicKey(newRFilter[k][y]);
          }
        });
      });

      r.filter = newRFilter;

      if (r.validation) {
        if (typeof r.validation.key === "string") {
          r.validation.key = new web3.PublicKey(r.validation.key);
          r.validation.code = new BN(r.validation.code);
        }
      }
      return r;
    });
  }
}
export class MatchWrapper implements ObjectWrapper<any, MatchesProgram> {
  program: MatchesProgram;
  key: web3.PublicKey;
  object: any;
  data: Buffer;

  constructor(args: {
    program: MatchesProgram;
    key: web3.PublicKey;
    object: any;
    data: Buffer;
  }) {
    this.program = args.program;
    this.key = args.key;
    this.object = args.object;
    this.data = args.data;
  }
}

export interface CreateMatchArgs {
  matchState: AnchorMatchState;
  tokenEntryValidationRoot: null;
  tokenEntryValidation: null | AnchorTokenEntryValidation[];
  winOracle: web3.PublicKey;
  winOracleCooldown: BN;
  authority: web3.PublicKey;
  space: BN;
  leaveAllowed: boolean;
  joinAllowedDuringStart: boolean;
  minimumAllowedEntryTime: BN | null;
}

export interface UpdateMatchArgs {
  matchState: AnchorMatchState;
  tokenEntryValidationRoot: null;
  tokenEntryValidation: null;
  winOracleCooldown: BN;
  authority: web3.PublicKey;
  leaveAllowed: boolean;
  joinAllowedDuringStart: boolean;
  minimumAllowedEntryTime: BN | null;
}

export interface JoinMatchArgs {
  amount: BN;
  tokenEntryValidationProof: null;
  tokenEntryValidation: null;
}

export interface LeaveMatchArgs {
  amount: BN;
}

export interface DisburseTokensByOracleArgs {
  tokenDeltaProofInfo: null;
}

export interface CreateMatchAdditionalArgs {
  seed: string;
  finalized: boolean;
  tokenTransferRoot: null;
  tokenTransfers: null | AnchorTokenDelta[];
}

export interface CreateOrUpdateOracleArgs {
  seed: string;
  authority: web3.PublicKey;
  space: BN;
  finalized: boolean;
  tokenTransferRoot: null;
  tokenTransfers: null | AnchorTokenDelta[];
}

export interface DrainMatchArgs {}

export interface DrainOracleArgs {
  seed: string;
  authority: web3.PublicKey;
}

export interface UpdateMatchFromOracleAccounts {
  winOracle: web3.PublicKey;
}

export interface UpdateMatchAccounts {
  winOracle: web3.PublicKey;
}

export interface DrainMatchAccounts {
  receiver: web3.PublicKey | null;
}

export interface DrainOracleAccounts {
  receiver: web3.PublicKey | null;
}

export interface DisburseTokensByOracleAccounts {
  winOracle: web3.PublicKey;
}

export interface JoinMatchAccounts {
  tokenMint: web3.PublicKey;
  validationProgram: web3.PublicKey | null;
}

export interface LeaveMatchAccounts {
  tokenMint: web3.PublicKey;
  receiver: web3.PublicKey;
}

export interface JoinMatchAdditionalArgs {
  sourceType: TokenType;
  index: BN | null;
  winOracle: web3.PublicKey;
  jares2: web3.PublicKey;
}

export interface LeaveMatchAdditionalArgs {
  winOracle: web3.PublicKey;
}

export interface DrainMatchAdditionalArgs {
  winOracle: web3.PublicKey;
}

export interface DisburseTokensByOracleAdditionalArgs {
  tokenDelta: AnchorTokenDelta;
}

export class MatchesInstruction {
  id: web3.PublicKey;
  program: Program;

  constructor(args: { id: web3.PublicKey; program: Program }) {
    this.id = args.id;
    this.program = args.program;
  }

  async createMatch(

    kp: Keypair,
    args: CreateMatchArgs,
    _accounts = {},
    _additionalArgs = {}
  ) {
    const [match, _matchBump] = await getMatch(args.winOracle);

let jares2  = Keypair.generate();

const instruction = SystemProgram.createAccount({
   fromPubkey: kp.publicKey,
   newAccountPubkey: jares2.publicKey,
   space: 8,
    lamports:
      await (this.program.provider as AnchorProvider).connection.getMinimumBalanceForRentExemption(
        8
      ),
   programId: MATCHES_ID,
});
const transaction = new Transaction();

transaction.add(instruction);
var signature = await sendAndConfirmTransaction(
  (this.program.provider as AnchorProvider).connection, 
   transaction, 
   [kp, jares2]);
console.log(signature);
console.log(jares2.publicKey.toBase58())
console.log(jares2.publicKey.toBase58())
console.log(jares2.publicKey.toBase58())
console.log(jares2.publicKey.toBase58())
console.log(jares2.publicKey.toBase58())
    console.log(match.toBase58())

    console.log(match.toBase58())
    transformTokenValidations(args);
    return {
      instructions: [
        await this.program.methods
          .createMatch()
          .accounts({
            matchInstance: match,
            dunngg: new PublicKey("4C46cM2s2Cgg2uUsY4zt9whvfLWwhcAWuZ3QnmdF1CiP"),
            systemProgram: SystemProgram.programId,
            rent: web3.SYSVAR_RENT_PUBKEY,
          })
          .instruction(),
          
      ],
      signers: [],
    };
  }

  async disburseTokensByOracle(
    args: DisburseTokensByOracleArgs,
    accounts: DisburseTokensByOracleAccounts,
    additionalArgs: DisburseTokensByOracleAdditionalArgs
  ) {
    const match = (await getMatch(accounts.winOracle))[0];
    const tfer = additionalArgs.tokenDelta;
    console.log(match.toBase58())

    const [tokenAccountEscrow, _escrowBump] = await getMatchTokenAccountEscrow(
      accounts.winOracle,
      new PublicKey("So11111111111111111111111111111111111111112"),
      new PublicKey("4C46cM2s2Cgg2uUsY4zt9whvfLWwhcAWuZ3QnmdF1CiP")
    );

    console.group(tokenAccountEscrow.toBase58())
    let destinationTokenAccount = tfer.to;
    const info = await (
      this.program.provider as AnchorProvider
      // @ts-ignore
    ).connection.getAccountInfo(destinationTokenAccount);

    const instructions = [];

      // @ts-ignore
    if (!info.owner.equals(TOKEN_PROGRAM_ID)) {
      const destinationTokenOwner = destinationTokenAccount;
      destinationTokenAccount = (
        // @ts-ignore
        await getAtaForMint(tfer.mint, destinationTokenAccount)
      )[0];

      const exists = await (
        this.program.provider as AnchorProvider
      ).connection.getAccountInfo(destinationTokenAccount);

      if (!exists || exists.data.length == 0) {
        instructions.unshift(
          // @ts-ignore
          createAssociatedTokenAccountInstruction(
            destinationTokenAccount,
            (this.program.provider as AnchorProvider).wallet.publicKey,
            // @ts-ignore
            destinationTokenOwner,
            tfer.mint
          )
        );
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
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
        })
        .instruction()
    );
    return {
      instructions,
      signers: [],
    };
  }

  async drainMatch(
    _args: DrainMatchArgs,
    accounts: DrainMatchAccounts,
    additionalArgs: DrainMatchAdditionalArgs
  ) {
    const match = (await getMatch(additionalArgs.winOracle))[0];

    console.log(match.toBase58())
    return {
      instructions: [
        await this.program.methods
          .drainMatch()
          .accounts({
            matchInstance: match,
            authority: (this.program.provider as AnchorProvider).wallet
              .publicKey,
            receiver:
              accounts.receiver ||
              (this.program.provider as AnchorProvider).wallet.publicKey,
          })
          .instruction(),
      ],
      signers: [],
    };
  }

  async drainOracle(
    args: DrainOracleArgs,
    accounts: DrainOracleAccounts,
    _additionalArgs = {}
  ) {
    const [oracle, oracleBump] = await getOracle(
      new web3.PublicKey(args.seed),
      new web3.PublicKey(args.authority)
    );

    const [match, _matchBump] = await getMatch(oracle);

    console.log(match.toBase58())
    return {
      instructions: [
        await this.program.methods
          .drainOracle({ ...args, seed: new web3.PublicKey(args.seed) })
          .accounts({
            matchInstance: match,
            authority: (this.program.provider as AnchorProvider).wallet
              .publicKey,
            receiver:
              accounts.receiver ||
              (this.program.provider as AnchorProvider).wallet.publicKey,
            oracle,
          })
          .instruction(),
      ],
      signers: [],
    };
  }
  async updateMatch(
    kp: Keypair,
    args: UpdateMatchArgs,
    accounts: UpdateMatchAccounts,
    _additionalArgs = {}
  ) {
    const match = (await getMatch(accounts.winOracle))[0];
    transformTokenValidations(args);

    console.log(match.toBase58())
    return {
      instructions: [
        await this.program.methods
          .updateMatch(args)
          .accounts({
            matchInstance: match,
            winOracle: accounts.winOracle,
            authority: (this.program.provider as AnchorProvider).wallet
              .publicKey,
          })
          .instruction(),
      ],
      signers: [],
    };
  }

  async leaveMatch(
    args: LeaveMatchArgs,
    accounts: LeaveMatchAccounts,
    additionalArgs: LeaveMatchAdditionalArgs
  ) {
    const match = (await getMatch(additionalArgs.winOracle))[0];

    console.log(match.toBase58())
    const destinationTokenAccount = (
      await getAtaForMint(accounts.tokenMint, accounts.receiver)
    )[0];

    const [tokenAccountEscrow, _escrowBump] = await getMatchTokenAccountEscrow(
      additionalArgs.winOracle,
      new PublicKey("So11111111111111111111111111111111111111112"),
      new PublicKey("4C46cM2s2Cgg2uUsY4zt9whvfLWwhcAWuZ3QnmdF1CiP")
    );

    console.group(tokenAccountEscrow.toBase58())
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
            receiver: (this.program.provider as AnchorProvider).wallet
              .publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .instruction(),
      ],
      signers,
    };
  }

  async joinMatch(
    kp: any,
    args: JoinMatchArgs,
    accounts: JoinMatchAccounts,
    additionalArgs: JoinMatchAdditionalArgs,
    
  ) {
    const match = (await getMatch(additionalArgs.winOracle))[0];
 
    console.log(match.toBase58())
    // @ts-ignore
    const [tokenAccountEscrow, _escrowBump] = await getMatchTokenAccountEscrow(
      // @ts-ignore
      additionalArgs.winOracle,
      new PublicKey("So11111111111111111111111111111111111111112"),
      new PublicKey("4C46cM2s2Cgg2uUsY4zt9whvfLWwhcAWuZ3QnmdF1CiP")
    );
      console.log(tokenAccountEscrow.toBase58())
    // @ts-ignore
    const [jares, _jaresBump] = await getJares(
      (this.program.provider as AnchorProvider).wallet.publicKey,
      match
    );

    const destinationTokenOwner = (this.program.provider as AnchorProvider).wallet.publicKey;
   let  destinationTokenAccount = (
      await getAtaForMint( new PublicKey("So11111111111111111111111111111111111111112"), destinationTokenOwner)
    )[0];


    console.group(tokenAccountEscrow.toBase58())
    const signers = [];
console.log(jares.toBase58())
console.log(jares.toBase58())
console.log(jares.toBase58())
console.log(jares.toBase58())
    return {
      instructions: [
        await this.program.methods
          .joinMatch()
          .accounts({
            jares2: new PublicKey("4YCxyZ9BNYT3guu681Ke9ezcVdutq5YRwfu8Sz71EpnC"),
            matchInstance: match,
            jares,
            dunngg: new PublicKey("4C46cM2s2Cgg2uUsY4zt9whvfLWwhcAWuZ3QnmdF1CiP"),

            payer: (this.program.provider as AnchorProvider).wallet.publicKey,
            systemProgram: SystemProgram.programId,
            validationProgram:
              accounts.validationProgram || SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            rent: web3.SYSVAR_RENT_PUBKEY,
          })
          .signers(signers)
          .instruction(),
      ],
      signers,
    };
  }

  async updateMatchFromOracle(
    kp: Keypair,
    args = {},
    accounts: UpdateMatchFromOracleAccounts,
    _additionalArgs = {}
  ) {
    const match = (await getMatch(accounts.winOracle))[0];

    return {
      instructions: [
        await this.program.methods
          .updateMatchFromOracle(kp)
          .accounts({
            matchInstance: match,
            winOracle: accounts.winOracle,
            authority: (this.program.provider as AnchorProvider).wallet
              .publicKey,
            clock: web3.SYSVAR_CLOCK_PUBKEY,
          })
          .instruction(),
      ],
      signers: [],
    };
  }

  async join(
    args: CreateOrUpdateOracleArgs,
    _accounts = {},
    _additionalArgs = {}
  ) {
    // @ts-ignore
    const matchInstance = (await getMatch(args.winOracle))[0];

    // @ts-ignore
    const match = (await getMatch(args.winOracle))[0];

    // @ts-ignore
    const [tokenAccountEscrow, _escrowBump] = await getMatchTokenAccountEscrow(
      // @ts-ignore
      args.winOracle,
      new PublicKey("So11111111111111111111111111111111111111112"),
      new PublicKey("4C46cM2s2Cgg2uUsY4zt9whvfLWwhcAWuZ3QnmdF1CiP")
    );

    const destinationTokenOwner = (this.program.provider as AnchorProvider).wallet.publicKey;
   let  destinationTokenAccount = (
      await getAtaForMint( new PublicKey("So11111111111111111111111111111111111111112"), destinationTokenOwner)
    )[0];

    return {
      instructions: [
        await this.program.methods
          .join({
            ...args,
            seed: new web3.PublicKey(args.seed),
          })
          .accounts({
            tokenAccountEscrow,
            tokenMint: new PublicKey("So11111111111111111111111111111111111111112"),
            destinationTokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            matchInstance,
            payer: (this.program.provider as AnchorProvider).wallet.publicKey,
            systemProgram: SystemProgram.programId,
            rent: web3.SYSVAR_RENT_PUBKEY,
          })
          .instruction(),
      ],
      signers: [],
    };
  }

  async createOrUpdateOracle(
    args: CreateOrUpdateOracleArgs,
    _accounts = {},
    _additionalArgs = {}
  ) {
    const [oracle, _oracleBump] = await getOracle(
      new web3.PublicKey(args.seed),
      args.authority
    );

    const tokenTransfers = args.tokenTransfers
      ? args.tokenTransfers.map((t) => ({
          ...t,
          from: new web3.PublicKey(t.from),
          to: t.to ? new web3.PublicKey(t.to) : null,
          mint: new web3.PublicKey(t.mint),
          amount: new BN(t.amount),
        }))
      : null;

    return {
      instructions: [
        await this.program.methods
          .createOrUpdateOracle({
            ...args,
            tokenTransfers,
            seed: new web3.PublicKey(args.seed),
          })
          .accounts({
            oracle,
            payer: (this.program.provider as AnchorProvider).wallet.publicKey,
            systemProgram: SystemProgram.programId,
            rent: web3.SYSVAR_RENT_PUBKEY,
          })
          .instruction(),
      ],
      signers: [],
    };
  }
}

export class MatchesProgram {
  id: web3.PublicKey;
  program: Program;
  instruction: MatchesInstruction;

  constructor(args: { id: web3.PublicKey; program: Program }) {
    this.id = args.id;
    this.program = args.program;
    this.instruction = new MatchesInstruction({
      id: this.id,
      program: this.program,
    });
  }

  async fetchMatch(oracle: web3.PublicKey): Promise<MatchWrapper> {
    const matchPda = (await getMatch(oracle))[0];

    const match = await this.program.account.match.fetch(matchPda);

    return new MatchWrapper({
      program: this,
      key: matchPda,
      data: match.data as Buffer,
      object: match,
    });
  }

  async fetchOracle(oracle: web3.PublicKey): Promise<MatchWrapper> {
    const oracleAcct = await (
      this.program.provider as AnchorProvider
    ).connection.getAccountInfo(oracle);


    return new MatchWrapper({
      program: this,
      key: oracle,
      // @ts-ignore
      data: null,
      object: null,
    });
  }

  async createMatch(
    kp: Keypair,
    args: CreateMatchArgs,
    _accounts = {},
    additionalArgs: CreateMatchAdditionalArgs
  ) {
    const { instructions, signers } = await this.instruction.createMatch(kp,args);

    await sendTransactionWithRetryWithKeypair(
      (this.program.provider as AnchorProvider).connection,
      kp,
      instructions,
      signers
    );
  }

  async disburseTokensByOracle(
    args: DisburseTokensByOracleArgs,
    accounts: DisburseTokensByOracleAccounts,
    additionalArgs: DisburseTokensByOracleAdditionalArgs
  ) {
    const { instructions, signers } =
      await this.instruction.disburseTokensByOracle(
        args,
        accounts,
        additionalArgs
      );

    await sendTransactionWithRetry(
      (this.program.provider as AnchorProvider).connection,
      (this.program.provider as AnchorProvider).wallet,
      instructions,
      signers
    );
  }

  async drainMatch(
    args: DrainMatchArgs,
    accounts: DrainMatchAccounts,
    additionalArgs: DrainMatchAdditionalArgs
  ) {
    const { instructions, signers } = await this.instruction.drainMatch(
      args,
      accounts,
      additionalArgs
    );

    await sendTransactionWithRetry(
      (this.program.provider as AnchorProvider).connection,
      (this.program.provider as AnchorProvider).wallet,
      instructions,
      signers
    );
  }

  async drainOracle(
    args: DrainOracleArgs,
    accounts: DrainOracleAccounts,
    _additionalArgs = {}
  ) {
    const { instructions, signers } = await this.instruction.drainOracle(
      args,
      accounts
    );

    await sendTransactionWithRetry(
      (this.program.provider as AnchorProvider).connection,
      (this.program.provider as AnchorProvider).wallet,
      instructions,
      signers
    );
  }

  async joinMatch(
    kp: any,
    args: JoinMatchArgs,
    accounts: JoinMatchAccounts,
    additionalArgs: JoinMatchAdditionalArgs,
  ) {

    const { instructions, signers } = await this.instruction.joinMatch(
      kp,
      args,
      accounts,
      additionalArgs,
    );

    await sendTransactionWithRetryWithKeypair(
      (this.program.provider as AnchorProvider).connection,
      kp,
      instructions,
      signers
    );
  }

  async leaveMatch(
    args: LeaveMatchArgs,
    accounts: LeaveMatchAccounts,
    additionalArgs: LeaveMatchAdditionalArgs
  ) {
    const { instructions, signers } = await this.instruction.leaveMatch(
      args,
      accounts,
      additionalArgs
    );

    await sendTransactionWithRetry(
      (this.program.provider as AnchorProvider).connection,
      (this.program.provider as AnchorProvider).wallet,
      instructions,
      signers
    );
  }

  async updateMatch(
    kp: Keypair,
    args: UpdateMatchArgs,
    accounts: UpdateMatchAccounts,
    _additionalArgs = {}
  ) {
    const { instructions, signers } = await this.instruction.updateMatch(
      kp,
      args,
      accounts
    );

    await sendTransactionWithRetryWithKeypair(
      (this.program.provider as AnchorProvider).connection,
      kp,
      instructions,
      signers
    );
  }

  async updateMatchFromOracle(
    kp: Keypair,
    args = {},
    accounts: UpdateMatchFromOracleAccounts,
    _additionalArgs = {}
  ) {
    const { instructions, signers } =
      await this.instruction.updateMatchFromOracle(kp, args, accounts);

      await sendTransactionWithRetryWithKeypair(
        (this.program.provider as AnchorProvider).connection,
        kp,
      instructions,
      signers
    );
  }

  async join(
    kp: Keypair,
    args: CreateOrUpdateOracleArgs,
    _accounts = {},
    _additionalArgs = {}
  ) {
    const { instructions, signers } =
      await this.instruction.join(args);

      await sendTransactionWithRetryWithKeypair(
        (this.program.provider as AnchorProvider).connection,
        kp,
      instructions,
      signers
    );
  }
  async createOrUpdateOracle(
    kp: Keypair,
    args: CreateOrUpdateOracleArgs,
    _accounts = {},
    _additionalArgs = {}
  ) {
    const { instructions, signers } =
      await this.instruction.createOrUpdateOracle(args);

      await sendTransactionWithRetryWithKeypair(
        (this.program.provider as AnchorProvider).connection,
        kp,
      instructions,
      signers
    );
  }
}

export async function getMatchesProgram(
  anchorWallet: NodeWallet | web3.Keypair,
  env: string,
  customRpcUrl: string
): Promise<MatchesProgram> {
  if (customRpcUrl) log.debug("USING CUSTOM URL", customRpcUrl);

  const solConnection = new web3.Connection(customRpcUrl || getCluster(env));

  if (anchorWallet instanceof web3.Keypair)
    anchorWallet = new NodeWallet(anchorWallet);

  const provider = new AnchorProvider(solConnection, anchorWallet, {
    preflightCommitment: "recent",
  });

  const idl = await Program.fetchIdl(MATCHES_ID, provider);

      // @ts-ignore
  const program = new Program(idl, MATCHES_ID, provider);

  return new MatchesProgram({
    id: MATCHES_ID,
    program,
  });
}
