import usersService from "../services/users.service.js";
import { getTemplate, sendHTML } from "./_helpers.js";

const homeController = {
    get(req, res) {
        const sessionToken = req.cookies["sessionId"];
        const userId = req.cookies["userId"];

        if (sessionToken && userId) {
            res.redirect("/rooms");
            return;
        }


        const base = getTemplate("_base");
        const content = getTemplate("home");
        const page = base.replace("{{ content }}", content);
        
        sendHTML(res, page.replace("{{ error }}", ""));
    },

    async post(req, res) {
        const { username, password } = req.body;
        const { id, isCorrect } = await usersService.login(username, password);

        if (isCorrect) {
            const result = await usersService.generateNewSession(id);

            if (!result) {
                const base = getTemplate("_base");
                const content = getTemplate("home");
                const page = base.replace("{{ content }}", content);
                const pageWithContent = page.replace("{{ error }}", `
                    <p>You are already logged in another device!</p>
                `);

                sendHTML(res, pageWithContent);
                return;
            }

            res.cookie("sessionId", result);
            res.cookie("userId", id);

            res.redirect(`/rooms`);
        } else {
            const base = getTemplate("_base");
            const content = getTemplate("home");
            const page = base.replace("{{ content }}", content);
            const pageWithContent = page.replace("{{ error }}", `
                <p>Your username/password is wrong!</p>
            `);

            sendHTML(res, pageWithContent);
        }
    }
};

export default homeController;