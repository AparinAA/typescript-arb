import dotenv from 'dotenv';
import path from 'path';
import FTXclient from 'ftx-public-api';
import OKXclient from 'okx-public-api';

import { Telegraf } from 'telegraf';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const TOKEN_BOT = process.env.TOKEN_BOT;
if (!TOKEN_BOT) {
    console.info("Api token tg bot invalid");
    throw "Api token tg bot invalid";
}

const bot = new Telegraf(TOKEN_BOT);

const chatid = process.env.tgchatid;
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

const firstEx = new OKXclient(secretDict_OKX.api_key, secretDict_OKX.secret_key, secretDict_OKX.passphrase);

const secondEx = new FTXclient(secretDict_FTX.api_key, secretDict_FTX.secret_key);

const delayPing = process.env.delay;
if (!delayPing) {
    console.info("delay - Delay ping undefined");
    throw "delay - Delay ping undefined";
}

//export const ccy = process.env.currency;
const amtArb = process.env.amountArb;
if (!amtArb) {
    console.info("amountArb - Amount for trading undefined");
    throw "amountArb - Amount for trading ping undefined";
}

const amtWith = process.env.amountWith;
if (!amtWith) {
    console.info("amountWith - Amount for withdrawal undefined");
    throw "amountWith - Amount for withdrawal ping undefined";
}

const spread = process.env.spread;
if (!spread) {
    console.info("spread - Spread for trade undefined");
    throw "spread - Spread for trade ping undefined";
}

export { delayPing, amtArb, amtWith, spread, firstEx, secondEx, bot, chatid };

export function initMarket(currency: string, balanceFirst: balanceInfo, balanceSecond: balanceInfo): Market {
    if (
        firstEx && secondEx && 
        balanceFirst &&
        balanceSecond &&
        currency && amtArb &&
        amtWith && spread
    ) {
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
        }
    }

    return {"valid": false};
}