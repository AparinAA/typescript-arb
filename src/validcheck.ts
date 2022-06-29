//Провекра есть ли на бирже доступные монеты
export default function checkValidBalance(
    stonck: any,
    currency: string,
    amountValid: num
): boolean {
    if(stonck?.balance) {
        return  Number(Array.isArray(stonck.balance) ? (stonck?.balance?.find( (item: balanceInfo)  => item?.ccy === currency)?.avail ?? 0) : 0) > amountValid;
    }
    return false;
}
