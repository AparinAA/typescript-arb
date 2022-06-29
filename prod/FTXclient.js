"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hmac_sha256_1 = __importDefault(require("crypto-js/hmac-sha256"));
const enc_hex_1 = __importDefault(require("crypto-js/enc-hex"));
const axios_1 = __importDefault(require("axios"));
//in order to create new FTXclient(api_key, api_secret_key)
class FTXclient {
    constructor(api_key, api_secret) {
        this.instance = axios_1.default.create({
            baseURL: 'https://ftx.com/api',
            timeout: 5000,
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json; utf-8',
                'FTX-KEY': api_key,
            }
        });
        this.instance.interceptors.request.use((config) => {
            const now = Date.now();
            const method = config.method.toUpperCase();
            let { data, params } = config;
            let sign = now + method + `/api/${config.url}`;
            config.headers['FTX-TS'] = now;
            params = new URLSearchParams(params).toString();
            sign += method === 'GET' ? (params ? `?${params}` : ``) : `${JSON.stringify(data)}`;
            config.headers['FTX-SIGN'] = (0, hmac_sha256_1.default)(sign, api_secret).toString(enc_hex_1.default);
            return config;
        });
    }
    getName() {
        return Promise.resolve('FTX');
    }
    //GET request 
    getRequest(endpoint, params = {}) {
        return this.instance.get(endpoint, { params })
            .then((result) => {
            var _a, _b;
            return (_b = (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.result) !== null && _b !== void 0 ? _b : Promise.reject({ "error": "bad GET request first step", "code": -1, "ex": "FTX" });
        }, () => {
            return Promise.reject({ "error": "bad GET request first step", "code": -1, "ex": "FTX" });
        })
            .catch(() => {
            return Promise.reject({ "error": "bad GET request first step", "code": -1, "ex": "FTX" });
        });
    }
    //POST request
    postRequest(endpoint, data = {}) {
        return this.instance.post(endpoint, data)
            .then(() => {
            return true;
        }, () => {
            return Promise.reject({ "error": "bad POST request first step", "code": -1, "ex": "FTX" });
        })
            .catch(() => {
            return Promise.reject({ "error": "bad POST request first step", "code": -1, "ex": "FTX" });
        });
    }
    //Get balance account
    //return list of object [ {'ccy': ccy, 'avail': amountAvailble, 'eqUsd', equelUsd} ]
    getBalance() {
        return this.getRequest('wallet/balances')
            .then((balance) => {
            var _a;
            if ((balance === null || balance === void 0 ? void 0 : balance.code) === -1) {
                return balance;
            }
            return (_a = balance === null || balance === void 0 ? void 0 : balance.map((element) => {
                return {
                    'ccy': element.coin,
                    'avail': element.free,
                    'eqUsd': element.usdValue
                };
            })) !== null && _a !== void 0 ? _a : Promise.reject({ "error": "bad GET request balance check", "code": -1, "ex": "FTX" });
        }, () => {
            return Promise.reject({ "error": "bad GET request balance check", "code": -1, "ex": "FTX" });
        })
            .catch(() => {
            return Promise.reject({ "error": "bad GET request orderbook check", "code": -1, "ex": "FTX" });
        });
    }
    /*
      Get market price with any depth < 400
      market='TONCOIN/USD', depth=int
      return object
      {
        'ask': [[priceAsk1, amountAsk1], [priceAsk2, amountAsk2], ...],
        'bid': [[priceBid1, amountBid1], [priceBid2, amountBid2], ...]
      }
    */
    getMarket(market, depth = null) {
        return this.getRequest(`markets/${market}/orderbook`, { depth })
            .then((result) => {
            if ((result === null || result === void 0 ? void 0 : result.code) === -1) {
                return result;
            }
            if (!(result === null || result === void 0 ? void 0 : result.asks) || !(result === null || result === void 0 ? void 0 : result.bids)) {
                return Promise.reject({ "error": "bad GET request orderbook check", "code": -1, "ex": "FTX" });
            }
            return {
                'asks': result === null || result === void 0 ? void 0 : result.asks,
                'bids': result === null || result === void 0 ? void 0 : result.bids,
            };
        }, () => {
            return Promise.reject({ "error": "bad GET request orderbook check", "code": -1, "ex": "FTX" });
        })
            .catch(() => {
            return Promise.reject({ "error": "bad GET request orderbook check", "code": -1, "ex": "FTX" });
        });
    }
    //put orders buy/sell
    //market - 'TONCOIN/USD'
    //spot - 'buy/sell'
    //countOrd - amount orders 
    //orderList - array orders [[priceOrder1, amountOrder1], [priceOrder2, amountOrder2] , ...]
    putOrders(market, spot, countOrd, orderList) {
        let orders = [];
        orderList.forEach((item, i) => {
            if (i < countOrd) {
                const ord = {
                    "market": market,
                    "side": spot,
                    "price": item[0],
                    "type": "limit",
                    "size": item[1],
                };
                orders.push(ord);
            }
        });
        const promises = orders.map(item => {
            return this.postRequest('orders', item)
                .then(() => {
                return true;
            }, () => {
                return false;
            });
        });
        return Promise.all(promises)
            .then((r) => {
            if (r.indexOf(false) !== -1) {
                return false;
            }
            return true;
        }, () => {
            return false;
        });
    }
    //Withdrawal from FTX to address
    //currency - 'TONCOIN'
    //amount - 130
    //method - 'ton' (for each currency his own)
    //address - address for withdrawal
    //tag - memo
    withdrawalToAddress(currency, amount, method, address, tag = null) {
        //body for withdrawal
        const body_withdrawal = {
            "coin": currency,
            "size": amount,
            "address": address,
            "tag": tag,
            "password": "123511",
            "method": method,
        };
        return this.postRequest('wallet/withdrawals', body_withdrawal)
            .then((r) => {
            if (r.code === -1) {
                return Promise.reject({ "error": "bad POST request withdrawal", "code": -1, "ex": "FTX" });
            }
        })
            .catch(() => {
            return Promise.reject({ "error": "bad POST request withdrawal", "code": -1, "ex": "FTX" });
        });
    }
    //Get deposit address
    //coin - 'TONCOIN'
    //method - 'ton'
    getDepositAdrr(coin, method) {
        return this.getRequest(`wallet/deposit_address/${coin}`, { method })
            .then((r) => {
            if (r.code === -1) {
                return Promise.reject({ "error": "bad GET request depositAddr check", "code": -1, "ex": "FTX" });
            }
            return r;
        })
            .catch(() => {
            return Promise.reject({ "error": "bad GET request depositAddr check", "code": -1, "ex": "FTX" });
        });
    }
}
exports.default = FTXclient;
//# sourceMappingURL=FTXclient.js.map