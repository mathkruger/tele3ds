import dotenv from "dotenv";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import messagesService from "./services/messages-service.js";
import usersService from "./services/users-service.js";

dotenv.config();

const token = process.env.TELEGRAM_BOT_KEY;
const bot = new Telegraf(token);

bot.on(message('text'), async (ctx) => {
    if (ctx.message.text === "/register") {
        registerUser(ctx);
        return;
    }

    const payload = {
        chatId: ctx.chat.id,
        username: ctx.message.from.username,
        message: ctx.message.text,
        datetime: new Date(ctx.message.date).toLocaleDateString() + "(" + new Date(ctx.message.date).toLocaleTimeString() + ")"
    };

    await messagesService.insert(payload);
});

async function registerUser(ctx) {
    const payload = {
        id: ctx.message.from.id,
        username: ctx.message.from.username,
        chatId: ctx.chat.id,
        chatName: ctx.chat.title
    };

    await usersService.insert(payload);
    await ctx.sendMessage("Your unique ID is: " + payload.id);
}

export default bot;