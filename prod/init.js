"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMarket = exports.chatid = exports.bot = exports.secondEx = exports.firstEx = exports.spread = exports.amtWith = exports.amtArb = exports.delayPing = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const FTXclient_1 = __importDefault(require("./FTXclient"));
const OKXclient_1 = __importDefault(require("./OKXclient"));
const telegraf_1 = require("telegraf");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const TOKEN_BOT = process.env.TOKEN_BOT;
if (!TOKEN_BOT) {
    console.info("Api token tg bot invalid");
    throw "Api token tg bot invalid";
}
const bot = new telegraf_1.Telegraf(TOKEN_BOT);
exports.bot = bot;
const chatid = process.env.tgchatid;
exports.chatid = chatid;
if (!chatid) {
    console.info("Invalid tg chat_id");
    throw "Invalid tg chat_id";
}
const secretDict_FTX = {
    'api_key': process.env.ftx_api_key,
    'secret_key': process.env.ftx_api_secret,
};
if (!secretDict_FTX.api_key || !secretDict_FTX.secret_key) {
    console.info("Api key or secret key invalid of FTX");
    throw "Api key or secret key invalid of FTX";
}
//Init secret api OKX
const secretDict_OKX = {
    'api_key': process.env.api_key,
    'passphrase': process.env.passphrase,
    'secret_key': process.env.secret_key,
};
if (!secretDict_OKX.api_key || !secretDict_OKX.secret_key || !secretDict_OKX.secret_key) {
    console.info("Api key or secret key, or passphrase invalid of OKX");
    throw "Api key or secret key, or passphrase invalid of OKX";
}
const firstEx = new OKXclient_1.default(secretDict_OKX.api_key, secretDict_OKX.secret_key, secretDict_OKX.passphrase);
exports.firstEx = firstEx;
const secondEx = new FTXclient_1.default(secretDict_FTX.api_key, secretDict_FTX.secret_key);
exports.secondEx = secondEx;
const delayPing = process.env.delay;
exports.delayPing = delayPing;
if (!delayPing) {
    console.info("delay - Delay ping undefined");
    throw "delay - Delay ping undefined";
}
//export const ccy = process.env.currency;
const amtArb = process.env.amountArb;
exports.amtArb = amtArb;
if (!amtArb) {
    console.info("amountArb - Amount for trading undefined");
    throw "amountArb - Amount for trading ping undefined";
}
const amtWith = process.env.amountWith;
exports.amtWith = amtWith;
if (!amtWith) {
    console.info("amountWith - Amount for withdrawal undefined");
    throw "amountWith - Amount for withdrawal ping undefined";
}
const spread = process.env.spread;
exports.spread = spread;
if (!spread) {
    console.info("spread - Spread for trade undefined");
    throw "spread - Spread for trade ping undefined";
}
function initMarket(currency, balanceFirst, balanceSecond) {
    if (firstEx && secondEx &&
        balanceFirst &&
        balanceSecond &&
        currency && amtArb &&
        amtWith && spread) {
        return {
            "exchangeFirst": firstEx,
            "exchangeSecond": secondEx,
            "balanceExchangeFirst": balanceFirst,
            "balanceExchangeSecond": balanceSecond,
            "currency": currency,
            "amountTrade": amtArb,
            "amountWithdrawal": amtWith,
            "necessarySpread": spread,
            "valid": true
        };
    }
    return { "valid": false };
}
exports.initMarket = initMarket;
//# sourceMappingURL=init.js.map