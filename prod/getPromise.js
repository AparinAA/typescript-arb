"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getPromise(promiseAll, balanceFirst, balanceSecond) {
    return Promise.all(promiseAll)
        .then((results) => {
        let firstMarket = results[0];
        let secondMarket = results[1];
        firstMarket['balance'] = balanceFirst;
        secondMarket['balance'] = balanceSecond;
        return [firstMarket, secondMarket];
    }, e => {
        //console.info("Error promise all get mark",e);
        return Promise.reject(e);
    });
}
exports.default = getPromise;
//# sourceMappingURL=getPromise.js.map