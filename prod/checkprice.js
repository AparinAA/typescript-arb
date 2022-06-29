"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dictCurrency_1 = require("./dictCurrency");
const getPromise_1 = __importDefault(require("./getPromise"));
const validate_1 = require("./validate");
const workertgbot_1 = __importDefault(require("./workertgbot"));
const validcheck_1 = __importDefault(require("./validcheck"));
function checkPrice(market, nameFirstEx, nameSecondEx, bot) {
    return __awaiter(this, void 0, void 0, function* () {
        //init values
        const firstEx = market === null || market === void 0 ? void 0 : market.exchangeFirst, secondEx = market === null || market === void 0 ? void 0 : market.exchangeSecond, currency = market === null || market === void 0 ? void 0 : market.currency, amountArb = market === null || market === void 0 ? void 0 : market.amountTrade, amountWith = market === null || market === void 0 ? void 0 : market.amountWithdrawal, spread = market === null || market === void 0 ? void 0 : market.necessarySpread, balancefirstEx = market === null || market === void 0 ? void 0 : market.balanceExchangeFirst, balancesecondEx = market === null || market === void 0 ? void 0 : market.balanceExchangeSecond;
        if (!firstEx || !secondEx || !currency || !amountArb || !amountWith || !spread || !balancefirstEx || !balancesecondEx) {
            return Promise.reject(false);
        }
        //console.info(dictCurrency[currency], currency);
        //promise orders markets. The best 3 price
        const getfirstEx = firstEx.getMarket(dictCurrency_1.dictCurrency[currency][nameFirstEx].idName, 3);
        const getsecondEx = secondEx.getMarket(dictCurrency_1.dictCurrency[currency][nameSecondEx].idName, 3);
        //promise order USDT/USD for sell on secondEx
        return (0, getPromise_1.default)([getfirstEx, getsecondEx], balancefirstEx, balancesecondEx)
            .then(results => {
            if (!results) {
                throw { "error": "invalid get markets" };
            }
            return [
                (0, validate_1.validPair)(currency, amountArb, results[0], results[1], spread, bot),
                results[0],
                results[1]
            ];
        }, () => {
            return Promise.reject(false);
        })
            .then(result => {
            if (typeof result[0] !== 'boolean') {
                return Promise.all([
                    firstEx.putOrders(dictCurrency_1.dictCurrency[currency].firstEx.idName, result[0]),
                    secondEx.putOrders(dictCurrency_1.dictCurrency[currency].secondEx.idName, result[0])
                ]).then(() => {
                    var _a, _b, _c, _d;
                    (0, workertgbot_1.default)(`*Paid ${currency}*.\nBuy ${(_a = result[0]) === null || _a === void 0 ? void 0 : _a.buy.name} - ${(_b = result[0]) === null || _b === void 0 ? void 0 : _b.buy.price.orders}.\nSell ${(_c = result[0]) === null || _c === void 0 ? void 0 : _c.sell.name} - ${(_d = result[0]) === null || _d === void 0 ? void 0 : _d.sell.price.orders}`, bot);
                    return true;
                })
                    .catch(() => {
                    (0, workertgbot_1.default)(`*FINISH* could not order`, bot);
                    return false;
                });
            }
            if ((0, validcheck_1.default)(result[2], dictCurrency_1.dictCurrency[currency].secondEx.name, amountWith)) {
                secondEx.withdrawalToAddress(dictCurrency_1.dictCurrency[currency].secondEx.name, amountWith, dictCurrency_1.dictCurrency[currency].secondEx.method, dictCurrency_1.dictCurrency[currency].firstEx.address, dictCurrency_1.dictCurrency[currency].firstEx.tag)
                    .then(() => {
                    (0, workertgbot_1.default)(`Withdrawal ${currency} success`, bot);
                }, (error) => Promise.reject(error))
                    .catch(() => {
                    (0, workertgbot_1.default)("error withdrawal", bot);
                });
            }
            if (typeof result[0] === 'boolean') {
                return false;
            }
            return true;
        }, () => {
            return false;
        })
            .catch(() => {
            return false;
        });
    });
}
exports.default = checkPrice;
//# sourceMappingURL=checkprice.js.map