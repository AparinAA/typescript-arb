import { dictCurrency } from './dictCurrency';
import getPromise from './getPromise';
import {validPair} from './validate';
import sendMsgTg from './workertgbot';
import checkValidBalance from './validcheck';

export default async function checkPrice(market: Market, nameFirstEx: string, nameSecondEx: string, bot: any) {
    //init values
    
    const firstEx = market?.exchangeFirst,
          secondEx = market?.exchangeSecond,
          currency = market?.currency,
          amountArb = market?.amountTrade,
          amountWith = market?.amountWithdrawal,
          spread = market?.necessarySpread,
          balancefirstEx = market?.balanceExchangeFirst,
          balancesecondEx = market?.balanceExchangeSecond;

    if (!firstEx || !secondEx || !currency || !amountArb || !amountWith || !spread || !balancefirstEx || !balancesecondEx) {
        return Promise.reject(false);
    }
    
    //console.info(dictCurrency[currency], currency);
    //promise orders markets. The best 3 price
    const getfirstEx = firstEx.getMarket(dictCurrency[currency][nameFirstEx].idName, 3); 
    const getsecondEx = secondEx.getMarket(dictCurrency[currency][nameSecondEx].idName, 3);


    //promise order USDT/USD for sell on secondEx
    return getPromise(
        [getfirstEx, getsecondEx],
        balancefirstEx,
        balancesecondEx
    )
    .then(results => {
        if(!results) {
            throw {"error": "invalid get markets"}
        }
        return [
            validPair(currency, amountArb, results[0], results[1], spread, bot),
            results[0],
            results[1]
        ];
    }, () => {
        return Promise.reject(false);
    })
    .then( result => {

        if(typeof result[0] !== 'boolean') {
            return Promise.all([
                firstEx.putOrders(dictCurrency[currency].firstEx.idName, result[0]),
                secondEx.putOrders(dictCurrency[currency].secondEx.idName, result[0])
            ]).then( () => {
                sendMsgTg(`*Paid ${currency}*.\nBuy ${result[0]?.buy.name} - ${result[0]?.buy.price.orders}.\nSell ${result[0]?.sell.name} - ${result[0]?.sell.price.orders}`, bot);
                return true;
            })
            .catch( () => {
                sendMsgTg(`*FINISH* could not order`, bot);
                return false;
            });
        }
        

        if (checkValidBalance(result[2], dictCurrency[currency].secondEx.name, amountWith)) {
            secondEx.withdrawalToAddress(
                dictCurrency[currency].secondEx.name,
                amountWith,
                dictCurrency[currency].secondEx.method,
                dictCurrency[currency].firstEx.address,
                dictCurrency[currency].firstEx.tag
            )
            .then(() => {
                sendMsgTg(`Withdrawal ${currency} success`, bot);
            }, (error: any) => Promise.reject(error))
            .catch( ()=> {
                sendMsgTg("error withdrawal", bot);
            })
        }
        
        if(typeof result[0] === 'boolean') {
            return false;
        }
        return true;
    }, () => {
        return false;
    })
    .catch( () => {
        return false;
    });

}