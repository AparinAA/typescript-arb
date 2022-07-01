"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
//in order to create new OKXclient(api_key, api_secret_key, passphrase)
class OKXclient {
    constructor(api_key, api_secret, passphrase) {
        this.instance = axios_1.default.create({
            baseURL: 'https://www.okex.com',
            timeout: 5000,
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json; utf-8',
                "OK-ACCESS-KEY": api_key,
                "OK-ACCESS-PASSPHRASE": passphrase,
            }
        });
        this.instance.interceptors.request.use((config) => {
            const now = new Date().toISOString();
            const method = config.method.toUpperCase();
            let { data, params } = config;
            let sign;
            if (!data) {
                data = '';
            }
            else {
                data = JSON.stringify(data);
            }
            params = new URLSearchParams(params).toString();
            sign = crypto_1.default.createHmac("sha256", api_secret)
                .update(now + method.toUpperCase() + `${config.url}` + (method === 'GET' ? (params ? `?${params}` : ``) : `${data}`))
                .digest('base64');
            config.headers['OK-ACCESS-TIMESTAMP'] = now;
            config.headers['OK-ACCESS-SIGN'] = sign;
            return config;
        });
    }
    getName() {
        return Promise.resolve('OKX');
    }
    //GET request 
    getRequest(endpoint, params = {}) {
        return this.instance.get(endpoint, { params })
            .then((result) => {
            var _a;
            return (_a = result === null || result === void 0 ? void 0 : result.data.data) !== null && _a !== void 0 ? _a : Promise.reject({ "error": "bad GET request first step", "code": -1, "ex": "OKX" });
        }, () => {
            return Promise.reject({ "error": "bad GET request first step", "code": -1, "ex": "OKX" });
        })
            .catch(() => {
            return Promise.reject({ "error": "bad GET request first step", "code": -1, "ex": "OKX" });
        });
    }
    //POST request
    postRequest(endpoint, data = {}) {
        return this.instance.post(endpoint, data)
            .catch(() => {
            return Promise.reject({ "error": "bad POST request first step", "code": -1, "ex": "OKX" });
        });
    }
    //Get balance account
    //return list of object [ {'ccy': ccy, 'avail': amountAvailble, 'eqUsd', equelUsd} ]
    getBalance() {
        return this.getRequest('/api/v5/account/balance')
            .then((balance) => {
            var _a, _b;
            //console.info("balance:",balance[0]?.details);
            if ((balance === null || balance === void 0 ? void 0 : balance.code) === -1) {
                return Promise.reject({ "error": "bad GET request balance check", "code": -1, "ex": "OKX" });
            }
            return (_b = (_a = balance[0]) === null || _a === void 0 ? void 0 : _a.details.map((element) => {
                return {
                    'ccy': element.ccy,
                    'avail': element.availEq,
                    'eqUsd': element.eqUsd
                };
            })) !== null && _b !== void 0 ? _b : Promise.reject({ "error": "bad GET request balance check", "code": -1, "ex": "OKX" });
        }, () => {
            return Promise.reject({ "error": "bad GET request balance check", "code": -1, "ex": "OKX" });
        })
            .catch(() => {
            return Promise.reject({ "error": "bad GET request balance check", "code": -1, "ex": "OKX" });
        });
    }
    /*Get market price with any depth < 400
      instId='TON-USDT', depth=int
      return object
      {
        'ask': [[priceAsk1, amountAsk1], [priceAsk2, amountAsk2], ...],
        'bid': [[priceBid1, amountBid1], [priceBid2, amountBid2], ...]
      }
    */
    getMarket(instId, sz = null) {
        return this.getRequest(`/api/v5/market/books`, { instId, sz })
            .then((orderbook) => {
            if ((orderbook === null || orderbook === void 0 ? void 0 : orderbook.code) === -1) {
                return Promise.reject({ "error": "bad GET request balance check", "code": -1, "ex": "OKX" });
            }
            if (!orderbook.asks || !orderbook.bids) {
                return Promise.reject({ "error": "bad GET request orderbook check", "code": -1, "ex": "OKX" });
            }
            return {
                'asks': orderbook.asks.map((item) => item.splice(0, 2)),
                'bids': orderbook.bids.map((item) => item.splice(0, 2)),
            };
        }, () => {
            return Promise.reject({ "error": "bad GET request orderbook check", "code": -1, "ex": "OKX" });
        })
            .catch(() => {
            return Promise.reject({ "error": "bad GET request orderbook check", "code": -1, "ex": "OKX" });
        });
    }
    //put orders buy/sell
    //market - 'TON-USDT'
    //spot - 'buy/sell'
    //countOrd - amount orders 
    //orderList - array orders [[priceOrder1, amountOrder1], [priceOrder2, amountOrder2] , ...]
    putOrders(market, spot, countOrd, orderList) {
        const endpoint = "/api/v5/trade/batch-orders";
        let orders = [];
        orderList.forEach((item, i) => {
            if (i < countOrd) {
                orders.push({
                    "instId": market,
                    "tdMode": "cash",
                    "side": spot,
                    "ordType": "limit",
                    "px": item[0],
                    "sz": item[1],
                });
            }
        });
        return this.postRequest(endpoint, orders)
            .then((r) => {
            if (r.code !== 0) {
                return false;
            }
            return true;
        }, () => {
            return Promise.reject({ "error": "bad POST request order put", "code": -1, "ex": "OKX" });
        })
            .catch(() => {
            return Promise.reject({ "error": "bad POST request order put", "code": -1, "ex": "OKX" });
        });
    }
    //Transfer within account
    //curryncy - 'TON' , amount - amount (+fee if to main + withdrawal)
    //TradeAcc = "18"
    //MainAcc = "6"
    transferCurrAcc(currency, amount, from, to) {
        //body for transfer within account
        const body_transfer = {
            "ccy": currency,
            "amt": amount,
            "from": from,
            "to": to
        };
        return this.postRequest("/api/v5/asset/transfer", body_transfer)
            .catch(() => {
            return Promise.reject({ "error": "bad POST request transfer", "code": -1, "ex": "OKX" });
        });
    }
    //Withdrawal from FTX to address
    //currency - 'TON'
    //amount - 130
    //chain - 'TON-TON' (for each currency his own)
    //address - address for withdrawal (+:tag)
    //fee - (for each currency his own)
    withdrawalToAddress(currency, amount, fee, chain, address) {
        //body for withdrawal
        const body_withdrawal = {
            "amt": "" + amount,
            "fee": fee,
            "dest": "4",
            "ccy": currency,
            "chain": chain,
            "toAddr": address,
        };
        return this.postRequest('/api/v5/asset/withdrawal', body_withdrawal)
            .catch(() => {
            return Promise.reject({ "error": "bad POST request whidrawal", "code": -1, "ex": "OKX" });
        });
    }
}
exports.default = OKXclient;
//# sourceMappingURL=OKXclient.js.map