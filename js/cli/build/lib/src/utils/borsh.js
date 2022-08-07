"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendBorsh = void 0;
// @ts-nocheck
const web3_js_1 = require("@solana/web3.js");
const borsh_1 = require("borsh");
const extendBorsh = () => {
    borsh_1.BinaryReader.prototype.readPubkey = function () {
        const reader = this;
        const array = reader.readFixedArray(32);
        return new web3_js_1.PublicKey(array);
    };
    borsh_1.BinaryWriter.prototype.writePubkey = function (value) {
        const writer = this;
        writer.writeFixedArray(value.toBuffer());
    };
    // BTreeMap<u32, u32>
    borsh_1.BinaryReader.prototype.readMap32 = function () {
        const reader = this;
        const map = new Map();
        const length = reader.readU32();
        for (let i = 0; i < length; i++) {
            const key = reader.readU32();
            const val = reader.readU32();
            map.set(key, val);
        }
        return map;
    };
    // BTreeMap<u32, u32>
    borsh_1.BinaryWriter.prototype.writeMap32 = function (value) {
        const writer = this;
        value.forEach((val, key) => {
            writer.writeU32(key);
            writer.writeU32(val);
        });
    };
};
exports.extendBorsh = extendBorsh;
(0, exports.extendBorsh)();
