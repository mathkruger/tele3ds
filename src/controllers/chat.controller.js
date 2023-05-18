import { getTemplate, sendHTML } from "./_helpers.js";

import usersService from "../services/users.service.js";
import messagesService from "../services/messages.service.js";

const chatController = {
    async get(req, res) {
        const { userId, chatId } = req.params;

        const base = getTemplate("_base");
        const content = getTemplate("chat");
        const page = base.replace("{{ content }}", content);

        const user = await usersService.getUser(userId);
        const inputsHTML = `
            <input type="hidden" name="chatId" value="${chatId}"/>
            <input type="text" readonly name="userName" value="${user.username}"/>
        `;

        const messageList = await messagesService.getMessagesFromGroup(chatId);
        const messageListHTML = messageList.reverse().map(x => {
            return `
                <li>
                    <strong>${x.username}</strong>: ${x.message}
                </li>`
        }).join("\n");

        const pageWithContent = page
            .replace("{{ hidden_inputs }}", inputsHTML)
            .replace("{{ messages }}", messageListHTML);

        sendHTML(res, pageWithContent);
    },

    async post(req, res, bot) {
        const { message, chatId, userName } = req.body;
        bot.telegram.sendMessage(chatId, `[tele3ds]${userName}: ${message}`);

        const payload = {
            chatId: chatId,
            username: `[tele3ds]${userName}`,
            message: message
        };

        await messagesService.addMessage(payload);

        res.redirect("back");
    }
};

export default chatController;
