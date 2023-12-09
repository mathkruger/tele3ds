import Database from "bun:sqlite";
import { Message } from "../types/message";

export default class MessagesRepository {
  static db: Database = new Database(":memory:");

  static init() {
    this.db = new Database(":memory:");
    this.db.run(`
      create table if not exists messages
      (
          chatId text,
          username text,
          message text,
          datetime text
      )
    `);
  }

  static insert(message: Message) {
    const sql =
      "insert into messages (chatId, username, message, datetime) values (?, ?, ?, ?)";
    return this.db.run(sql, [
      message.chatId,
      message.username,
      message.message,
      message.datetime,
    ]);
  }

  static getAll(chatId: string): Message[] {
    const query = this.db.query("select * from messages where chatId = $chatId");
    return query.all({ $chatId: chatId }) as Message[];
  }
}
