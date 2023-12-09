export type InitialUser = {
  id: string,
  discordUsername: string,
}

export type User = InitialUser & {
  username: string,
  password: string
}


export type UserChatRoom = {
  chatId: string,
  chatName: string,
  userId: string
}

export type UserSession = {
  userId: string,
  sessionId: string
}

export type UserActivate = {
  username: string,
  password: string,
  code: string
}

export type CreateUser = InitialUser & UserChatRoom;