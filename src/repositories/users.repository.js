import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { __dirname, generateHash, compareHash } from "../_utils.js";

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
                    discordUsername text,
                    username text,
                    password text
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

            await this.db.run(`
                create table if not exists users_session
                (
                    user_id text,
                    session_id text
                )
            `);
        }
    },

    insert(payload) {
        const sql = "insert into users (id, discordUsername) values (?, ?)";
        return this.db.run(sql, [
            payload.id,
            payload.username
        ]);
    },

    async update(payload) {
        const sql = "update users set username = ?, password = ? where id = ?";
        const hash = await generateHash(payload.password);

        return this.db.run(sql, [
            payload.username,
            hash,
            payload.id,
        ]);
    },

    async checkUserPassword(username, plainPassword) {
        const sql = "select id, password from users where username = ?";
        const result = await this.db.get(sql, [username]);

        if (result) {
            const { id, password } = result;
            const passwordIsCorrect = await compareHash(plainPassword, password);
    
            if (passwordIsCorrect) {
                return {
                    id,
                    isCorrect: true
                }
            }
    
            return {
                id: "",
                isCorrect: false
            };
        }

        return {
            id: "",
            isCorrect: false
        };
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
    },

    getUserSession(userId) {
        const sql = "select * from users_session where user_id = ?";
        return this.db.get(sql, [userId]);
    },

    insertUserSession(userId, sessionId) {
        const sql = "insert into users_session (user_id, session_id) values (?, ?)";
        return this.db.run(sql, [userId, sessionId]);
    },

    deleteUserSession(userId) {
        const sql = "delete from users_session where user_id = ?";
        return this.db.run(sql, [userId]);
    }
}

export default usersRepository;
