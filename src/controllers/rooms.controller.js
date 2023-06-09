import { getTemplate, goToLogout, isUserLogged, sendHTML } from "./_helpers.js";
import usersService from "../services/users.service.js";

const roomsController = {
    async get(req, res) {
        const isLogged = await isUserLogged(req);
        if (!isLogged) {
            goToLogout(res);
            return;
        }
        
        const { userId } = req.cookies;

        const base = getTemplate("_base");
        const content = getTemplate("rooms");
        const page = base.replace("{{ content }}", content);

        const rooms = await usersService.getUserRooms(userId);
        const roomsHTML = rooms.map(x => {
            return `<li><a href="/chat/${x.chat_id}">${x.chat_name}</a></li>`
        }).join("\n");

        const pageWithContent = page.replace("{{ content }}", roomsHTML);

        sendHTML(res, pageWithContent);
    },
};

export default roomsController;
