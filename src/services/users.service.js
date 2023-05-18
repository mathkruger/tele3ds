import usersRepository from "../repositories/users.repository.js";

const usersService = {
    async createUserOrSkip(payload) {
        const existingUser = await usersRepository.get(payload.id);
        console.log("existingUser", existingUser);

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

    async getUser(userId) {
        const user = await usersRepository.get(userId);
        return user;
    },

    async getUserRooms(userId) {
        const rooms = await usersRepository.getUserRooms(userId);
        return rooms;
    }
};

export default usersService;