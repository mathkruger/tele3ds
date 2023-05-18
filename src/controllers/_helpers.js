import path from "path";
import fs from "fs";
import { __dirname } from "../_utils.js";

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

export {
    getTemplate,
    sendHTML
};
