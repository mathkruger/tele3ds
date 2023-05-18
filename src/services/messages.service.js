import messagesRepository from "../repositories/messages.repository.js";

const messagesService = {
    async addMessage({ chatId, username, message }) {
        try {
            await messagesRepository.insert({
                chatId,
                username,
                message,
                datetime: new Date().toString()
            });

            return true;
        } catch (error) {
            throw new Error("ERROR at messagesService.addMessage:", error);
        }
    },

    async getMessagesFromGroup(chatId) {
        try {
            const messages = await messagesRepository.getAll(chatId);
            return messages;
        } catch (error) {
            throw new Error("ERROR at messagesService.getMessagesFromGroup:", error);
        }
    }
};

export default messagesService;