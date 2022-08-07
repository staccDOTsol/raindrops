"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCluster = exports.DEFAULT_CLUSTER = exports.CLUSTERS = void 0;
const web3_js_1 = require("@solana/web3.js");
exports.CLUSTERS = [
    {
        name: "mainnet-beta",
        url: "https://api.metaplex.solana.com/",
    },
    {
        name: "testnet",
        url: (0, web3_js_1.clusterApiUrl)("testnet"),
    },
    {
        name: "devnet",
        url: (0, web3_js_1.clusterApiUrl)("devnet"),
    },
];
exports.DEFAULT_CLUSTER = exports.CLUSTERS[2];
function getCluster(name) {
    for (const cluster of exports.CLUSTERS) {
        if (cluster.name === name) {
            return cluster.url;
        }
    }
    return exports.DEFAULT_CLUSTER.url;
}
exports.getCluster = getCluster;
