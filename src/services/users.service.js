import usersRepository from "../repositories/users.repository.js";
import { v4 as uuidv4 } from "uuid";
import { generateHash } from "../_utils.js";

const usersService = {
    async createUserOrSkip(payload) {
        const existingUser = await usersRepository.get(payload.id);

        if (!existingUser) {
            await usersRepository.insert({
                id: payload.id,
                username: payload.username
            });
        }

        const existingUserChatRoom = await usersRepository.getUserRooms(payload.id);
        if (!existingUserChatRoom || !existingUserChatRoom.find(x => x.chat_id == payload.chatId)) {
            await usersRepository.insertUserRoom({
                chatId: payload.chatId,
                chatName: payload.chatName,
                userId: payload.id
            });
        }
    },

    async activateUser(username, password, id) {
        const user = await usersRepository.get(id);

        if (!user.username || !user.password) {
            await usersRepository.update({
                username,
                password,
                id
            });

            return true;
        }
        
        return false;
    },

    async login(username, password) {
        const result = await usersRepository.checkUserPassword(username, password);
        return result;
    },

    async getUser(userId) {
        const user = await usersRepository.get(userId);
        return user;
    },

    async getUserRooms(userId) {
        const rooms = await usersRepository.getUserRooms(userId);
        return rooms;
    },

    async getUserSession(userId) {
        const session = await usersRepository.getUserSession(userId);
        return session;
    },

    async generateNewSession(userId) {
        const existingSession = await this.getUserSession(userId);
        
        if (existingSession) {
            return null;
        }

        const sessionId = uuidv4();
        const sessionIdHash = await generateHash(sessionId);

        await usersRepository.insertUserSession(userId, sessionIdHash);
        return sessionId;
    },

    async removeSession(userId) {
        await usersRepository.deleteUserSession(userId);
    }
};

export default usersService;