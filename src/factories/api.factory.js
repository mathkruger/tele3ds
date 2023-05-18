import express from "express";
import { __dirname } from "../_utils.js";

import homeController from "../controllers/home.controller.js";
import roomsController from "../controllers/rooms.controller.js";
import chatController from "../controllers/chat.controller.js";
import registerController from "../controllers/register.controller.js";
import cookieParser from "cookie-parser";
import usersService from "../services/users.service.js";

function generateAPI(bot) {

    if (!bot) {
        throw new Error("Telegram Bot not initialized!");
    }

    const api = express();

    api.use(express.urlencoded());
    api.use(cookieParser());
    api.use(express.static('src/public'));

    // Home
    api.get("/", homeController.get);
    api.post("/", homeController.post);

    // Register
    api.get("/register", registerController.get);
    api.post("/register", registerController.post);

    // Rooms
    api.get("/rooms", roomsController.get);

    // Chat
    api.get("/chat/:chatId", chatController.get);
    api.post("/chat", async (req, res) => {
        await chatController.post(req, res, bot);
    });

    api.get("/logout", async (req, res) => {
        const userId = req.cookies["userId"];
        
        await usersService.removeSession(userId);
        res.clearCookie("userId");
        res.clearCookie("sessionId");
        res.redirect("/");
    });

    return api;
}

export {
    generateAPI
};