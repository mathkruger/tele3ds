import { NarrowedContext, Context } from "telegraf";
import { Update, Message } from "telegraf/types";

export type TelegramContext = NarrowedContext<Context<Update>, Update.MessageUpdate<Record<"text", {}> & Message.TextMessage>>;