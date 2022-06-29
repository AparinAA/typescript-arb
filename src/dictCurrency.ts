import { readFileSync } from 'fs';
import path from 'path';

export const dictCurrency = JSON.parse(readFileSync(path.resolve(__dirname, '../static/currencyInfo.json'), "utf8"));
