import MessagesRepository from "../repositories/messages.repository";
import { Message } from "../types/message";

export default class MessagesService {
  static async addMessage({ chatId, username, message }: Message) {
    try {
      MessagesRepository.insert({
        chatId,
        username,
        message,
        datetime: new Date().toString(),
      });

      return true;
    } catch (error: any) {
      throw new Error("ERROR at messagesService.addMessage:", error);
    }
  }

  static getMessagesFromGroup(chatId: string): Message[] {
    try {
      const messages = MessagesRepository.getAll(chatId);
      return messages;
    } catch (error: any) {
      throw new Error("ERROR at messagesService.getMessagesFromGroup:", error);
    }
  }
}
