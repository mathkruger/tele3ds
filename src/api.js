import fs from "fs";
import path from "path";
import express from "express";
import bot from "./bot.js";
import { __dirname } from "./utils.js";

import messagesService from "./services/messages-service.js";
import usersService from "./services/users-service.js";

const server = express();

server.use(express.urlencoded()); 
server.use(express.static('src/public'));

server.get("/", (req, res) => {
    const base = getTemplate("_base");
    const content = getTemplate("home");

    const page = base.replace("{{ content }}", content);
    
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(page);
    res.end();
});

server.post("/", (req, res) => {
    const { code } = req.body;
    res.redirect(`/rooms/${code}`);
});

server.get("/rooms/:userId", async (req, res) => {
    const { userId } = req.params;

    const base = getTemplate("_base");
    const content = getTemplate("rooms");
    const page = base.replace("{{ content }}", content);

    const rooms = await usersService.getUserRooms(userId);
    const roomsHTML = rooms.map(x => {
        return `<li><a href="/chat/${userId}/${x.chat_id}">${x.chat_name}</a></li>`
    }).join("\n");

    const pageWithContent = page.replace("{{ content }}", roomsHTML);
    
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(pageWithContent);
    res.end();
});

server.get("/chat/:userId/:chatId", async (req, res) => {
    const { userId, chatId } = req.params;

    const base = getTemplate("_base");
    const content = getTemplate("chat");
    const page = base.replace("{{ content }}", content);

    const user = await usersService.get(userId);
    const inputsHTML = `
        <input type="hidden" name="chatId" value="${chatId}"/>
        <input type="text" readonly name="userName" value="${user.username}"/>
    `;

    const messageList = await messagesService.getAll(chatId);
    const messageListHTML = messageList.reverse().map(x => {
        return `
        <li>
            <strong>${x.username}</strong>: ${x.message}
        </li>`
    }).join("\n");

    const pageWithContent = page
        .replace("{{ hidden_inputs }}", inputsHTML)
        .replace("{{ messages }}", messageListHTML);
    
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(pageWithContent);
    res.end();
});

server.post("/chat", async (req, res) => {
    const { message, chatId, userName } = req.body;
    bot.telegram.sendMessage(chatId, `[tele3ds]${userName}: ${message}`);

    const payload = {
        chatId: chatId,
        username: `[tele3ds]${userName}`,
        message: message,
        datetime: new Date().toLocaleDateString() + "(" + new Date().toLocaleTimeString() + ")"
    };

    await messagesService.insert(payload);

    res.redirect("back");
});

function getTemplate(name) {
    const templatePath = path.resolve(__dirname, `templates/${name}.html`);
    return fs.readFileSync(templatePath).toString();
}

export default server;