"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.programCommand = void 0;
// @ts-nocheck
const commander_1 = require("commander");
const loglevel_1 = __importDefault(require("loglevel"));
function programCommand(name) {
    return commander_1.program
        .command(name)
        .option("-e, --env <string>", "Solana cluster env name", "devnet" //mainnet-beta, testnet, devnet
    )
        .option("-r, --rpc-url <string>", "Solana cluster rpc-url")
        .requiredOption("-k, --keypair <path>", `Solana wallet location`)
        .option("-l, --log-level <string>", "log level", setLogLevel);
}
exports.programCommand = programCommand;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setLogLevel(value, prev) {
    if (value === undefined || value === null) {
        return;
    }
    loglevel_1.default.info("setting the log value to: " + value);
    loglevel_1.default.setLevel(value);
}
