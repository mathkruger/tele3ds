import { getTemplate, sendHTML } from "./_helpers.js";

const homeController = {
    get(_, res) {
        const base = getTemplate("_base");
        const content = getTemplate("home");
        const page = base.replace("{{ content }}", content);
        
        sendHTML(res, page);
    },

    post(req, res) {
        const { code } = req.body;
        res.redirect(`/rooms/${code}`);
    }
};

export default homeController;