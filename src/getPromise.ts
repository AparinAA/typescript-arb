export default function getPromise(
    promiseAll: Orderbook[],
    balanceFirst: balanceInfo,
    balanceSecond: balanceInfo
) {
        return Promise.all(promiseAll)
        .then( (results: Orderbook[]) => {
            let firstMarket = results[0];
            let secondMarket = results[1];

            firstMarket['balance'] = balanceFirst;
            secondMarket['balance'] = balanceSecond;
            
            return [firstMarket, secondMarket]
        }, e => {
            //console.info("Error promise all get mark",e);
            return Promise.reject(e);
        });
}