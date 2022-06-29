"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Провекра есть ли на бирже доступные монеты
function checkValidBalance(stonck, currency, amountValid) {
    var _a, _b, _c;
    if (stonck === null || stonck === void 0 ? void 0 : stonck.balance) {
        return Number(Array.isArray(stonck.balance) ? ((_c = (_b = (_a = stonck === null || stonck === void 0 ? void 0 : stonck.balance) === null || _a === void 0 ? void 0 : _a.find((item) => (item === null || item === void 0 ? void 0 : item.ccy) === currency)) === null || _b === void 0 ? void 0 : _b.avail) !== null && _c !== void 0 ? _c : 0) : 0) > amountValid;
    }
    return false;
}
exports.default = checkValidBalance;
//# sourceMappingURL=validcheck.js.map