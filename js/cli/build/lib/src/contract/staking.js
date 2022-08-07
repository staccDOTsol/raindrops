"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakingProgram = void 0;
const sol_kit_1 = require("@raindrop-studios/sol-kit");
const programIds_1 = require("../constants/programIds");
const staking_1 = require("../constants/staking");
const StakingInstruction = __importStar(require("../instructions/staking"));
class StakingProgram extends sol_kit_1.Program.Program {
    constructor() {
        super();
        this.PROGRAM_ID = programIds_1.STAKING_ID;
        this.instruction = new StakingInstruction.Instruction({ program: this });
    }
    async beginArtifactStakeWarmup(args, accounts, options) {
        const instruction = await this.instruction.beginArtifactStakeWarmup(args, accounts);
        return await this.sendWithRetry(instruction, [accounts.stakingTransferAuthority], options);
    }
    async endArtifactStakeWarmup(args, accounts, options) {
        const instruction = await this.instruction.endArtifactStakeWarmup(args, accounts);
        return await this.sendWithRetry(instruction, [], options);
    }
    async beginArtifactStakeCooldown(args, accounts, options) {
        const instruction = await this.instruction.beginArtifactStakeCooldown(args, accounts);
        return await this.sendWithRetry(instruction, [], options);
    }
    async endArtifactStakeCooldown(args, accounts, options) {
        const instruction = await this.instruction.endArtifactStakeCooldown(args, accounts);
        return await this.sendWithRetry(instruction, [], options);
    }
}
exports.StakingProgram = StakingProgram;
StakingProgram.PREFIX = staking_1.PREFIX;
