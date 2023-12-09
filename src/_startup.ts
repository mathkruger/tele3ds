import MessagesRepository from "./repositories/messages.repository";
import UsersRepository from "./repositories/users.repository";

import { generateAPI } from "./factories/api.factory";
import { generateBot } from "./factories/bot.factory";

function startupDependencies() {
  MessagesRepository.init();
  UsersRepository.init();
}

function startupApp() {
  const port = Bun.env.PORT || 3000;
  const token = Bun.env.TELEGRAM_BOT_KEY;

  const bot = generateBot(token);
  const api = generateAPI(bot);

  api.listen(port, () => {
    console.log("Listening on port: ", port);
    bot.launch();
  });
}

export { startupDependencies, startupApp };
