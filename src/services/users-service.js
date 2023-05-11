import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { __dirname } from "../utils.js";

const usersService = {
    async init() {
        this.db = await open({
            filename: path.resolve(__dirname, "db/users.sqlite"),
            driver: sqlite3.Database,
            mode: sqlite3.OPEN_READWRITE
        });

        if (this.db) {
            await this.db.run(`
                create table if not exists users (
                    id text primary key,
                    username text
                )
            `);

            await this.db.run(`
                create table if not exists users_chatroom
                (
                    chat_id integer,
                    chat_name text,
                    user_id text
                )
            `);
        }
    },

    async insert(payload) {
        const existingUser = await this.get(payload.id);
        if (!existingUser) {
            const sql = "insert into users (id, username) values (?, ?)";
            await this.db.run(sql, [payload.id, payload.username]);
        }

        const existingUserChatRoom = await this.getUserRooms(payload.id);
        if (!existingUserChatRoom || !existingUserChatRoom.find(x => x.chat_id == payload.chatId)) {
            const roomSql = "insert into users_chatroom (chat_id, chat_name, user_id) values (?, ?, ?)";
            await this.db.run(roomSql, [payload.chatId, payload.chatName, payload.id]);
        }
    },

    get(id) {
        const sql = "select * from users where id = ?";
        return this.db.get(sql, [id]);
    },

    getUserRooms(userId) {
        const sql = "select * from users_chatroom where user_id = ?";
        return this.db.all(sql, [userId]);
    }
}

export default usersService;
