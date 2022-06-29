"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validPair = void 0;
//если есть, то отправляем уведомления в телегу
const dictCurrency_1 = require("./dictCurrency");
const validcheck_1 = __importDefault(require("./validcheck"));
const ordersFunction_1 = require("./ordersFunction");
const workertgbot_1 = __importDefault(require("./workertgbot"));
function validPair(currency, amountArb, okx, ftx, ncssrySpread, bot) {
    if (!currency || !amountArb || !okx || !ftx || !ncssrySpread) {
        return false;
    }
    //console.info(okx,ftx);
    if (!okx || !ftx || !ncssrySpread || !dictCurrency_1.dictCurrency[currency]) {
        return false;
    }
    const isCurOKX = (0, validcheck_1.default)(okx, dictCurrency_1.dictCurrency[currency].okx.name, amountArb);
    const isUsdOKX = (0, validcheck_1.default)(okx, "USDT", amountArb * okx.bids[0][0] + 1);
    const isCurFTX = (0, validcheck_1.default)(ftx, dictCurrency_1.dictCurrency[currency].ftx.name, amountArb);
    const isUsdFTX = (0, validcheck_1.default)(ftx, "USD", amountArb * ftx.bids[0][0] + 1);
    const ftxBids = (0, ordersFunction_1.countOrders)(ftx.bids, amountArb);
    const okxBids = (0, ordersFunction_1.countOrders)(okx.bids, amountArb);
    const ftxAsks = (0, ordersFunction_1.countOrders)(ftx.asks, amountArb);
    const okxAsks = (0, ordersFunction_1.countOrders)(okx.asks, amountArb);
    //считай процент спред в стакане
    const spread_1 = 100 * (1 - okx.asks[0][0] / ftx.bids[0][0]);
    const spread_2 = 100 * (1 - ftx.asks[0][0] / okx.bids[0][0]);
    //console.info(dictCurrency[currency].okx.name,isCurOKX, isUsdOKX, isUsdFTX, ftxAsks, okxBids);
    //возможно торговать спред или нет?                     необходимый объем в стакане ?    
    const goSpread_1 = isCurFTX && isUsdOKX && (okxAsks.countOrd !== 4) && (ftxBids.countOrd !== 4);
    const goSpread_2 = isCurOKX && isUsdFTX && (ftxAsks.countOrd !== 4) && (okxBids.countOrd !== 4);
    console.info(currency, "\nOKX-BUY, FTX-SELL - SPREAD_1:", spread_1, "\nFTX-BUY, OKX-SELL - SPREAD_2:", spread_2);
    if ((spread_1 > ncssrySpread)) {
        console.info(isCurFTX, isUsdOKX, (okxAsks.countOrd !== 4), (ftxBids.countOrd !== 4));
        if (goSpread_1) {
            const multiSpread_1 = (1 - (0, ordersFunction_1.genPrice)(okxAsks) / (0, ordersFunction_1.genPrice)(ftxBids)) * 100;
            (0, workertgbot_1.default)(bot, `*${currency}*\nOKX - buy, FTX - sell. Spread: ${spread_1}%\nMultiSpread: ${multiSpread_1}`);
            if (multiSpread_1 > ncssrySpread) {
                return { 'buy': { 'name': 'okx', 'price': okxAsks }, 'sell': { 'name': 'ftx', 'price': ftxBids } };
            }
        }
    }
    if ((spread_2 > ncssrySpread)) {
        console.info(isCurOKX, isUsdFTX, (ftxAsks.countOrd !== 4), (okxBids.countOrd !== 4));
        if (goSpread_2) {
            const multiSpread_2 = (1 - (0, ordersFunction_1.genPrice)(ftxAsks) / (0, ordersFunction_1.genPrice)(okxBids)) * 100;
            (0, workertgbot_1.default)(bot, `*${currency}*\nFTX - buy, OKX - sell. Spread: ${spread_2}%\nMultiSpread: ${multiSpread_2}`);
            if (multiSpread_2 > ncssrySpread) {
                return { 'buy': { 'name': 'ftx', 'price': ftxAsks }, 'sell': { 'name': 'okx', 'price': okxBids } };
            }
        }
    }
    return false;
}
exports.validPair = validPair;
//# sourceMappingURL=validate.js.map