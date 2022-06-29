//округление до знака decimalPlaces после запятой
export default function truncated(num: num, decimalPlaces: num ): number {
    let numerfill = Number(num);
    let decimalPlacesfill = Number(decimalPlaces);

    if (!numerfill || !decimalPlacesfill) {
        return 0;
    }

    const numPowerConverter = Math.pow(10, decimalPlacesfill); 
    return ~~(numerfill * numPowerConverter)/numPowerConverter;
}
