import UsersRepository from "../repositories/users.repository";
import { generateHash } from "../_utils";
import { CreateUser, UserChatRoom } from "../types/user";

export default class UsersService {
  static createUserOrSkip(payload: CreateUser) {
    const existingUser = UsersRepository.get(payload.id);

    if (!existingUser) {
      UsersRepository.insert(payload);
    }

    const existingUserChatRoom = UsersRepository.getUserRooms(payload.id);
    if (
      !existingUserChatRoom ||
      !existingUserChatRoom.find((x: UserChatRoom) => x.chatId == payload.chatId)
    ) {
      UsersRepository.insertUserRoom({
        chatId: payload.chatId,
        chatName: payload.chatName,
        userId: payload.id,
      });
    }
  }

  static async activateUser(username: string, password: string, id: string) {
    const user = UsersRepository.get(id);

    if (!user.username || !user.password) {
      await UsersRepository.update({
        id,
        username,
        password,
        discordUsername: ""
      });

      return true;
    }

    return false;
  }

  static login(username: string, password: string) {
    const result = UsersRepository.checkUserPassword(username, password);
    return result;
  }

  static getUser(userId: string) {
    const user = UsersRepository.get(userId);
    return user;
  }

  static getUserRooms(userId: string) {
    const rooms = UsersRepository.getUserRooms(userId);
    return rooms;
  }

  static getUserSession(userId: string) {
    const session = UsersRepository.getUserSession(userId);
    return session;
  }

  static async generateNewSession(userId: string) {
    const existingSession = this.getUserSession(userId);

    if (existingSession) {
      return null;
    }

    const sessionId = crypto.randomUUID();
    const sessionIdHash = await generateHash(sessionId);

    UsersRepository.insertUserSession(userId, sessionIdHash);
    return sessionId;
  }

  static removeSession(userId: string) {
    UsersRepository.deleteUserSession(userId);
  }
}
