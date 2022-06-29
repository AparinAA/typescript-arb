"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//округление до знака decimalPlaces после запятой
function truncated(num, decimalPlaces) {
    let numerfill = Number(num);
    let decimalPlacesfill = Number(decimalPlaces);
    if (!numerfill || !decimalPlacesfill) {
        return 0;
    }
    const numPowerConverter = Math.pow(10, decimalPlacesfill);
    return ~~(numerfill * numPowerConverter) / numPowerConverter;
}
exports.default = truncated;
//# sourceMappingURL=calculate.js.map