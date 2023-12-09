import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

import MessagesService from "../services/messages.service";
import UsersService from "../services/users.service";
import { TelegramBot } from "../types/telegram-bot";
import { TelegramContext } from "../types/telegram-context";
import { Chat } from "telegraf/types";
import { CreateUser } from "../types/user";
import { Message } from "../types/message";

async function registerUser(ctx: TelegramContext) {
  const payload: CreateUser = {
    id: ctx.message.from.id.toString(),
    discordUsername: ctx.message.from.username || "",
    chatId: ctx.chat.id.toString(),
    chatName: (ctx.chat as Chat.GroupChat).title,
    userId: ""
  };

  UsersService.createUserOrSkip(payload);
  
  ctx.telegram.sendMessage(
    ctx.message.from.id,
    `You registered for the group "${payload.chatName}". Your unique ID is: ${payload.id}. Use it to create your Tele3DS account.`
  );
}

function generateBot(token: any): TelegramBot {
  if (!token) {
    throw new Error("Telegram bot token is not in place!");
  }

  const bot = new Telegraf(token);

  bot.on(message("text"), async (ctx) => {
    if (ctx.message.text === "/register") {
      registerUser(ctx);
      return;
    }

    const payload: Message = {
      chatId: ctx.chat.id.toString(),
      username: ctx.message.from.username || "",
      message: ctx.message.text,
      datetime: ""
    };

    await MessagesService.addMessage(payload);
  });

  return bot;
}

export { generateBot };
