"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dictCurrency = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
exports.dictCurrency = JSON.parse((0, fs_1.readFileSync)(path_1.default.resolve(__dirname, '../static/currencyInfo.json'), "utf8"));
//# sourceMappingURL=dictCurrency.js.map