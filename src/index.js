import server from "./api.js";
import bot from "./bot.js";
import messages from "./services/messages-service.js";
import users from "./services/users-service.js";

import dotenv from "dotenv";
dotenv.config();

messages.init();
users.init();

const port = process.env.PORT || 3000;

const serverInstance = server.listen(port, () => {
    console.log("Listening on port", port);
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