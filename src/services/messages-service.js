import sqlite3 from "sqlite3";
import { open } from "sqlite";

const messagesService = {
    async init() {
        this.db = await open({filename: ":memory:", driver: sqlite3.Database, mode: sqlite3.OPEN_READWRITE});
        if (this.db) {
            await this.db.run(`
                create table if not exists messages
                (
                    chatId text,
                    username text,
                    message text,
                    datetime text
                )
            `);
        }
    },

    insert(message) {
        const sql = "insert into messages (chatId, username, message, datetime) values (?, ?, ?, ?)";
        return this.db.run(sql, [message.chatId, message.username, message.message, message.datetime]);
    },

    getAll(chatId) {
        const sql = "select * from messages where chatId = ?";
        return this.db.all(sql, [chatId]);
    }
}

export default messagesService;
