import usersService from "../services/users.service.js";
import { getTemplate, sendHTML } from "./_helpers.js";

const registerController = {
    get(req, res) {
        const sessionToken = req.cookies["sessionId"];
        const userId = req.cookies["userId"];

        if (sessionToken && userId) {
            res.redirect("/rooms");
            return;
        }
        
        const base = getTemplate("_base");
        const content = getTemplate("register");
        const page = base.replace("{{ content }}", content);
        
        sendHTML(res, page.replace("{{ error }}", ""));
    },

    async post(req, res) {
        const { username, password, code } = req.body;
        const result = await usersService.activateUser(username, password, code);

        if (result) {       
            res.redirect("/");
            return;
        }

        const base = getTemplate("_base");
        const content = getTemplate("register");
        const page = base.replace("{{ content }}", content);
        const pageWithContent = page.replace("{{ error }}", `
            <p>User already activated, please go to <a href="/">login</a>
        `);

        sendHTML(res, pageWithContent);
    }
};

export default registerController;