"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genPrice = exports.countOrders = void 0;
function countOrders(orders, amount) {
    let curAmount = amount;
    let countOrd = [];
    let count = orders.length + 1;
    orders.forEach((element) => {
        if (curAmount - element[1] > -0.00001) {
            countOrd.push([Number(element[0]), Number(element[1])]);
        }
        else {
            count--;
            countOrd.push([Number(element[0]), curAmount]);
        }
        curAmount -= element[1];
    });
    return { 'countOrd': count, 'orders': countOrd };
}
exports.countOrders = countOrders;
function genPrice(orders) {
    let ord = orders.orders;
    let acc = 0;
    for (let j = 0; j < orders.countOrd; j++) {
        acc += ord[j][0] * ord[j][1];
    }
    return acc;
}
exports.genPrice = genPrice;
//# sourceMappingURL=ordersFunction.js.map