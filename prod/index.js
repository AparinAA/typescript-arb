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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTrade = void 0;
const checkprice_1 = __importDefault(require("./checkprice"));
const init_1 = require("./init");
function startTrade(currency) {
    return Promise.all([init_1.firstEx.getBalance(), init_1.secondEx.getBalance(), init_1.firstEx.getName(), init_1.secondEx.getName()])
        .then((result) => {
        const market = (0, init_1.initMarket)(currency, result[0], result[1]);
        if (market.valid) {
            return (0, checkprice_1.default)(market, result[2], result[3], init_1.bot)
                .then((r) => {
                return r;
            }).catch(() => {
                return false;
            });
        }
        else {
            return false;
        }
    }, () => {
        return false;
    })
        .catch(() => {
        return false;
    });
}
exports.startTrade = startTrade;
__exportStar(require("./OKXclient"), exports);
__exportStar(require("./FTXclient"), exports);
//# sourceMappingURL=index.js.map