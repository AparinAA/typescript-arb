"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
//send message in Telegram bot
const init_1 = require("./init");
function sendMsgTg(bot, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        yield bot.telegram.sendMessage(init_1.chatid, msg, { parse_mode: "Markdown" });
    });
}
exports.default = sendMsgTg;
//# sourceMappingURL=workertgbot.js.map