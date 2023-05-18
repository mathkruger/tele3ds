import dotenv from "dotenv";
import messagesRepository from "./repositories/messages.repository.js";
import usersRepository from "./repositories/users.repository.js";

import { generateAPI } from "./factories/api.factory.js";
import { generateBot } from "./factories/bot.factory.js";

function startupDependencies() {
    dotenv.config();
    
    messagesRepository.init();
    usersRepository.init();
}

function startupListeners() {
    const port = process.env.PORT || 3000;
    const token = process.env.TELEGRAM_BOT_KEY;

    const bot = generateBot(token);
    const api = generateAPI(bot);

    const serverInstance = api.listen(port, () => {
        console.log("Listening on port: ", port);
        bot.launch();
    });
    
    process.once('SIGINT', () => {
        bot.stop('SIGINT');
        serverInstance.close();
    });
    
    process.once('SIGTERM', () => {
        bot.stop('SIGTERM');
        serverInstance.close();
    });
}

export {
    startupDependencies,
    startupListeners
}
