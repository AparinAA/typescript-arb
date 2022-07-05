import сheckPrice from './checkprice';
import { initMarket, firstEx, secondEx, bot } from './init';

export function startTrade(currency: string) {

    return Promise.all([firstEx.getBalance(), secondEx.getBalance(), firstEx.getName(), secondEx.getName()])
    .then( (result: [balanceInfo, balanceInfo, string,string] ): Promise<boolean> | boolean => {
            const market: Market = initMarket(currency, result[0], result[1]);
            if (market.valid)  {
                return сheckPrice(market, result[2], result[3], bot)
                .then( (r) => {
                    return r;
                }).catch( () => {
                    return false;
                })
            } else {
                return false;
            }
    }, () => {
        return false;
    })
    .catch( () => {
        return false;
    })
}

export * from './OKXclient';
export * from './FTXclient';