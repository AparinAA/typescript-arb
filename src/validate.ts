//если есть, то отправляем уведомления в телегу
import {dictCurrency} from './dictCurrency';
import checkValidBalance from './validcheck';
import { countOrders, genPrice } from './ordersFunction';
import sendMsgTg from './workertgbot';

export function validPair(
    currency: string,
    amountArb: number,
    okx: Orderbook,
    ftx: Orderbook,
    ncssrySpread: number,
    bot: any
): any | ExchangesOrders {

    if(!currency || !amountArb || !okx || !ftx || !ncssrySpread) {
        return false;
    }
    //console.info(okx,ftx);
    if (!okx || !ftx || !ncssrySpread || !dictCurrency[currency]) {
        return false;
    }

    const isCurOKX = checkValidBalance(okx, dictCurrency[currency].okx.name, amountArb);
    const isUsdOKX = checkValidBalance(okx, "USDT", amountArb * okx.bids[0][0] + 1);
    const isCurFTX = checkValidBalance(ftx, dictCurrency[currency].ftx.name, amountArb);
    const isUsdFTX = checkValidBalance(ftx, "USD", amountArb * ftx.bids[0][0] + 1); 
    
    const ftxBids = countOrders(ftx.bids, amountArb);
    const okxBids = countOrders(okx.bids, amountArb);
    const ftxAsks = countOrders(ftx.asks, amountArb);
    const okxAsks = countOrders(okx.asks, amountArb);
       

    //считай процент спред в стакане
    const spread_1 = 100 * (1 - okx.asks[0][0] / ftx.bids[0][0]);
    const spread_2 = 100 * (1 - ftx.asks[0][0] / okx.bids[0][0]);
    
    //console.info(dictCurrency[currency].okx.name,isCurOKX, isUsdOKX, isUsdFTX, ftxAsks, okxBids);
    //возможно торговать спред или нет?                     необходимый объем в стакане ?    
    const goSpread_1 = isCurFTX && isUsdOKX && (okxAsks.countOrd !== 4) && (ftxBids.countOrd !== 4);
    const goSpread_2 = isCurOKX  && isUsdFTX && (ftxAsks.countOrd !== 4) && (okxBids.countOrd !== 4);
    
    console.info(currency, "\nOKX-BUY, FTX-SELL - SPREAD_1:", spread_1, "\nFTX-BUY, OKX-SELL - SPREAD_2:", spread_2)
    if ( (spread_1 > ncssrySpread) ) {
        console.info(isCurFTX,isUsdOKX,(okxAsks.countOrd !== 4), (ftxBids.countOrd !== 4))
        if ( goSpread_1 ) {
            const multiSpread_1 = (1 - genPrice(okxAsks) / genPrice(ftxBids)) * 100;
            sendMsgTg(bot,`*${currency}*\nOKX - buy, FTX - sell. Spread: ${spread_1}%\nMultiSpread: ${multiSpread_1}`);
            if (multiSpread_1 > ncssrySpread) {
                return {'buy': {'name': 'okx', 'price': okxAsks}, 'sell': {'name': 'ftx', 'price': ftxBids}}
            }   
        }
    }

    if ( (spread_2 > ncssrySpread) ) {

        console.info(isCurOKX,isUsdFTX,(ftxAsks.countOrd !== 4),(okxBids.countOrd !== 4))
        if( goSpread_2 ) {
            const multiSpread_2 = (1- genPrice(ftxAsks) / genPrice(okxBids)) * 100;
            sendMsgTg(bot, `*${currency}*\nFTX - buy, OKX - sell. Spread: ${spread_2}%\nMultiSpread: ${multiSpread_2}`);
            if (multiSpread_2 > ncssrySpread) {
                return {'buy': {'name': 'ftx', 'price': ftxAsks}, 'sell': {'name': 'okx', 'price': okxBids}}
            }
        }
    }

    return false;
}
