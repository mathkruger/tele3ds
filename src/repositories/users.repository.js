import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { __dirname } from "../_utils.js";

const usersRepository = {
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

    insert(payload) {
        const sql = "insert into users (id, username) values (?, ?)";
        return this.db.run(sql, [payload.id, payload.username]);
    },

    insertUserRoom(payload) {
        const roomSql = "insert into users_chatroom (chat_id, chat_name, user_id) values (?, ?, ?)";
        return this.db.run(roomSql, [payload.chatId, payload.chatName, payload.userId]);
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

export default usersRepository;
