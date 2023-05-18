import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

import messagesService from "../services/messages.service.js";
import usersService from "../services/users.service.js";

async function registerUser(ctx) {
    const payload = {
        id: ctx.message.from.id,
        username: ctx.message.from.username,
        chatId: ctx.chat.id,
        chatName: ctx.chat.title
    };

    await usersService.createUserOrSkip(payload);
    await ctx.telegram.sendMessage(ctx.message.from.id, `You registered for the group "${payload.chatName}". Your unique ID is: ${payload.id}. Use it to create your Tele3DS account.`);
}

function generateBot(token) {
    if (!token) {
        throw new Error("Telegram bot token is not in place!");
    }

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
        };

        await messagesService.addMessage(payload);
    });

    return bot;
}

export {
    generateBot
};