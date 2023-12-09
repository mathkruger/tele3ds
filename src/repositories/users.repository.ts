import { generateHash, compareHash } from "../_utils";
import Database from "bun:sqlite";
import { InitialUser, User, UserChatRoom, UserSession } from "../types/user";
import { LoginResult } from "../types/login-result";

class UsersRepository {
  static db: Database = new Database("src/db/users.sqlite", { create: true });

  static init() {
    if (this.db) {
      this.db.run(`
                create table if not exists users (
                    id text primary key,
                    discordUsername text,
                    username text,
                    password text
                )
            `);

      this.db.run(`
                create table if not exists users_chatroom
                (
                    chatId integer,
                    chatName text,
                    userId text
                )
            `);

      this.db.run(`
                create table if not exists users_session
                (
                    userId text,
                    sessionId text
                )
            `);
    }
  }

  static insert(payload: InitialUser) {
    const sql = "insert into users (id, discordUsername) values (?, ?)";
    return this.db.run(sql, [payload.id, payload.discordUsername]);
  }

  static async update(payload: User) {
    const sql = "update users set username = ?, password = ? where id = ?";
    const hash = generateHash(payload.password);

    return this.db.run(sql, [payload.username, hash, payload.id]);
  }

  static async checkUserPassword(
    username: string,
    plainPassword: string
  ): Promise<LoginResult> {
    const q = this.db.query(
      "select id, password from users where username = $username"
    );
    const result = q.get({ $username: username }) as {
      id: string;
      password: string;
    };

    if (!result) {
      return { isCorrect: false };
    }

    const { id, password } = result;
    const passwordIsCorrect = compareHash(plainPassword, password);

    if (!passwordIsCorrect) {
      return { isCorrect: false };
    }

    return {
      id,
      isCorrect: true,
    };
  }

  static insertUserRoom(payload: UserChatRoom) {
    const roomSql =
      "insert into users_chatroom (chatId, chatName, userId) values (?, ?, ?)";
    return this.db.run(roomSql, [
      payload.chatId,
      payload.chatName,
      payload.userId,
    ]);
  }

  static get(id: string): User {
    const query = this.db.query("select * from users where id = $id");
    return query.get({ $id: id }) as User;
  }

  static getUserRooms(userId: string): UserChatRoom[] {
    const query = this.db.query(
      "select * from users_chatroom where userId = $userId"
    );
    return query.all({ $userId: userId }) as UserChatRoom[];
  }

  static getUserSession(userId: string): UserSession {
    const query = this.db.query(
      "select * from users_session where userId = $userId"
    );
    return query.get({ $userId: userId }) as UserSession;
  }

  static insertUserSession(userId: string, sessionId: string) {
    const sql = "insert into users_session (userId, sessionId) values (?, ?)";
    return this.db.run(sql, [userId, sessionId]);
  }

  static deleteUserSession(userId: string) {
    const sql = "delete from users_session where userId = ?";
    return this.db.run(sql, [userId]);
  }
}

export default UsersRepository;
