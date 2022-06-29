//send message in Telegram bot
import { chatid } from './init';

export default async function sendMsgTg(bot: any, msg: string) {
    await bot.telegram.sendMessage(chatid, msg, {parse_mode: "Markdown"});
}