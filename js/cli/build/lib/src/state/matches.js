"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenType = exports.TokenTransferType = exports.MatchState = void 0;
var MatchState;
(function (MatchState) {
    MatchState[MatchState["Draft"] = 0] = "Draft";
    MatchState[MatchState["Initialized"] = 1] = "Initialized";
    MatchState[MatchState["Started"] = 2] = "Started";
    MatchState[MatchState["Finalized"] = 3] = "Finalized";
    MatchState[MatchState["PaidOut"] = 4] = "PaidOut";
    MatchState[MatchState["Deactivated"] = 5] = "Deactivated";
})(MatchState = exports.MatchState || (exports.MatchState = {}));
var TokenTransferType;
(function (TokenTransferType) {
    TokenTransferType[TokenTransferType["PlayerToPlayer"] = 0] = "PlayerToPlayer";
    TokenTransferType[TokenTransferType["PlayerToEntrant"] = 1] = "PlayerToEntrant";
    TokenTransferType[TokenTransferType["Normal"] = 2] = "Normal";
})(TokenTransferType = exports.TokenTransferType || (exports.TokenTransferType = {}));
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Player"] = 0] = "Player";
    TokenType[TokenType["Item"] = 1] = "Item";
    TokenType[TokenType["Any"] = 2] = "Any";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
