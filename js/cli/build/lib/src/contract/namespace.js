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
exports.NamespaceProgram = void 0;
const sol_kit_1 = require("@raindrop-studios/sol-kit");
const NamespaceInstruction = __importStar(require("../instructions/namespace"));
const programIds_1 = require("../constants/programIds");
const namespace_1 = require("../constants/namespace");
const namespace_2 = require("../state/namespace");
const pda_1 = require("../utils/pda");
class NamespaceProgram extends sol_kit_1.Program.Program {
    constructor() {
        super();
        this.PROGRAM_ID = programIds_1.NAMESPACE_ID;
        this.instruction = new NamespaceInstruction.Instruction({ program: this });
    }
    async initializeNamespace(args, accounts) {
        const instruction = await this.instruction.initializeNamespace(args, accounts);
        await this.sendWithRetry(instruction, []);
    }
    async fetchNamespace(mint) {
        let namespacePDA = (await (0, pda_1.getNamespacePDA)(mint))[0];
        const namespaceObj = await this.client.account.namespace.fetch(namespacePDA);
        return new namespace_2.Namespace(namespacePDA, namespaceObj);
    }
    ;
    async updateNamespace(args, accounts) {
        const instruction = await this.instruction.updateNamespace(args, accounts);
        await this.sendWithRetry(instruction, []);
    }
}
exports.NamespaceProgram = NamespaceProgram;
NamespaceProgram.PREFIX = namespace_1.PREFIX;
;
