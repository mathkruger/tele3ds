import { goToLogout, isUserLogged } from "./_helpers";

import UsersService from "../services/users.service";
import MessagesService from "../services/messages.service";
import { Message } from "../types/message";
import { TelegramBot } from "../types/telegram-bot";
import { CookiesAlias } from "../types/cookies";
import { Chat } from "../templates/chat";

export default class ChatController {
  static async get(set: any, cookie: CookiesAlias, chatId: string) {
    const isLogged = await isUserLogged(cookie);
    if (!isLogged) {
      goToLogout(set);
      return;
    }

    const {
      userId: { value: userId },
    } = cookie;
    const user = UsersService.getUser(userId);
    const messages = MessagesService.getMessagesFromGroup(chatId);
    const roomInfo = UsersService.getUserRooms(userId);
    const roomName = roomInfo.find((x) => x.chatId == chatId)?.chatName;

    return (
      <Chat
        roomname={roomName || ""}
        messages={messages}
        discordUsername={user.discordUsername}
        chatId={chatId}
      />
    );
  }

  static async post(
    set: any,
    cookie: CookiesAlias,
    body: { message: string; chatId: string; userName: string },
    bot: TelegramBot
  ) {
    const isLogged = await isUserLogged(cookie);
    if (!isLogged) {
      goToLogout(set);
      return;
    }

    const { message, chatId, userName } = body;
    bot.telegram.sendMessage(chatId, `[tele3ds]${userName}: ${message}`);

    const payload: Message = {
      chatId: chatId,
      username: `[tele3ds]${userName}`,
      message: message,
      datetime: "",
    };

    await MessagesService.addMessage(payload);

    set.redirect = "/chat/" + chatId;
  }
}
