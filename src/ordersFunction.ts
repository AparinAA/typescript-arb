export function countOrders(orders: Order[], amount: number): Orders {
    let curAmount = amount;
    let countOrd: Order[] = [];
    let count = orders.length+1;

    orders.forEach( (element) => {
        if (curAmount - element[1] > -0.00001) {
            countOrd.push([Number(element[0]), Number(element[1])])
        } else {
            count--;
            countOrd.push([Number(element[0]), curAmount])
        }
        curAmount -= element[1];
    });

    return { 'countOrd': count, 'orders': countOrd }
}

export function genPrice(orders: Orders): number {
    let ord = orders.orders;
    let acc = 0;
    for(let j = 0; j < orders.countOrd; j++) {
        acc += ord[j][0] * ord[j][1];
    }
    return acc;
}

