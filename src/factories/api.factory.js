import express from "express";
import { __dirname } from "../_utils.js";

import homeController from "../controllers/home.controller.js";
import roomsController from "../controllers/rooms.controller.js";
import chatController from "../controllers/chat.controller.js";

function generateAPI(bot) {

    if (!bot) {
        throw new Error("Telegram Bot not initialized!");
    }

    const api = express();

    api.use(express.urlencoded());
    api.use(express.static('src/public'));

    // Home
    api.get("/", homeController.get);
    api.post("/", homeController.post);

    // Rooms
    api.get("/rooms/:userId", roomsController.get);

    // Chat
    api.get("/chat/:userId/:chatId", chatController.get);
    api.post("/chat", async (req, res) => {
        await chatController.post(req, res, bot);
    });

    return api;
}

export {
    generateAPI
};