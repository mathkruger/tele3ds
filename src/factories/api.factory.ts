import express from "express";
import { __dirname } from "../_utils";

import HomeController from "../controllers/home.controller";
import RoomsController from "../controllers/rooms.controller";
import ChatController from "../controllers/chat.controller";
import RegisterController from "../controllers/register.controller";
import UsersService from "../services/users.service";
import { TelegramBot } from "../types/telegram-bot";
import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import staticPlugin from "@elysiajs/static";

function generateAPI(bot?: TelegramBot) {
  if (!bot) {
    throw new Error("Telegram Bot not initialized!");
  }

  const api = new Elysia()
  .use(staticPlugin())
  .use(html());

  // Home
  api.get("/", ({ set, cookie }) => HomeController.get(set, cookie));
  api.post("/", ({ body, cookie, set }) => HomeController.post(body, cookie, set), {
    body: t.Object({
      username: t.String(),
      password: t.String()
    })
  });

  // Register
  api.get("/register", ({ set, cookie }) => RegisterController.get(set, cookie));
  api.post("/register", ({ set, body }) => RegisterController.post(set, body), {
    body: t.Object({
      username: t.String(),
      password: t.String(),
      code: t.String()
    })
  });

  // Rooms
  api.get("/rooms", ({ set, cookie }) => RoomsController.get(set, cookie));

  // Chat
  api.get("/chat/:chatId", ({ set, cookie, params }) => ChatController.get(set, cookie, params.chatId));
  api.post("/chat", ({ set, cookie, body }) => ChatController.post(set, cookie, body, bot), {
    body: t.Object({
      message: t.String(),
      chatId: t.String(),
      userName: t.String()
    })
  });

  api.get("/logout", ({ set, cookie }) => {
    const userId = cookie["userId"].value;

    UsersService.removeSession(userId);

    cookie.userId.remove();
    cookie.sessionId.remove();

    set.redirect = "/";
  });

  return api;
}

export { generateAPI };
