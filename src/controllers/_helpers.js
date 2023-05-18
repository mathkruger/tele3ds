import path from "path";
import fs from "fs";
import { __dirname, compareHash } from "../_utils.js";
import usersService from "../services/users.service.js";

function getTemplate(name) {
    const templatePath = path.resolve(__dirname, `templates/${name}.html`);
    return fs.readFileSync(templatePath).toString();
}

function sendHTML(res, html) {
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    res.write(html);
    res.end();
}

async function isUserLogged(req) {
    const sessionToken = req.cookies["sessionId"];
    const userId = req.cookies["userId"];
    if (!sessionToken || !userId) {
        return false;
    }

    const session = await usersService.getUserSession(userId);
    if (!session) {
        return false;
    }

    const isSessionValid = await compareHash(sessionToken, session.session_id);
    return isSessionValid;
}

function goToLogout(res) {
    res.redirect("/logout");
};

export {
    getTemplate,
    sendHTML,
    isUserLogged,
    goToLogout
};
