import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/types";

export type TelegramBot = Telegraf<Context<Update>>;