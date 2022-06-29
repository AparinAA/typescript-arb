declare type Order = [number, number]; //Order type: [price, vol]

declare interface Orders { //Set orders with countOrd - true amount order for us
    "countOrd": number;
    "orders": Order[];
}

declare interface ExchangeOrder { //Orders on exchange 'name'
    'name': string;
    'price': Orders;
}

declare interface ExchangesOrders { //Orders on 2 exchange for buy and for sell
    'buy': ExchangeOrder;
    'sell': ExchangeOrder;
}

declare type num = number | string; //number or string (convert to number)

declare type balanceInfo = { //balance info on exchange
    'ccy': string,
    'avail': num,
    'eqUsd': num,
}


declare interface Orderbook { //Orderbook on exchange, with us balance on exchange
    "asks": Order[];
    "bids": Order[];
    "balance": balanceInfo;
}

declare interface Market { //dict market, api first exch, api second exchange, balance, currency, amount, spread for trade 
    "exchangeFirst"?: any;
    "exchangeSecond"?: any;
    "balanceExchangeFirst"?: balanceInfo;
    "balanceExchangeSecond"?: balanceInfo;
    "currency"?: string;
    "amountTrade"?: number;
    "amountWithdrawal"?: number;
    "necessarySpread"?: number;
    "valid": boolean;
}


