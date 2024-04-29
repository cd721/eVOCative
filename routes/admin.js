import { Router } from 'express';
const router = Router();
import idValidation from '../validation/idValidation.js';
import userData from '../data/users/users.js';
import wordData from '../data/words/words.js';
import wordValidation from '../data/words/wordValidation.js';
import xss from "xss";

router.route('/').get(async (req, res) => {
    try {
        const userList = await userData.getAllUsers();
        let adminUsers = [];
        for (let user of userList) {
            if (user.is_admin) {
                adminUsers.push(user);
            }
        }
        return res.render("admin/index", { users: adminUsers });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

router.route('/addNewWord')
    .get(async (req, res) => {
        try {
            return res.render("admin/addNewWord")
        } catch (e) {
            return res.status(500).json({ error: e });
        }
    }).post(async (req, res) => {
        let word = xss(req.body.word);
        let definition = xss(req.body.definition);
        let tags = xss(req.body.tags);
        tags = tags.split(",").map(tag => tag.trim());

        try {
            word = wordValidation.validateWord(word);
            definition = wordValidation.validateDefinition(definition);
            tags = wordValidation.validateTags(tags);

            await wordData.addWord(word, definition, tags, []);
            return res.redirect("/words");
        } catch (e) {
            return res.status(500).json({ error: e });
        }
    });

router.route('/checkTickets')
    .get(async (req, res) => {

        let user_id;
        let user;
        try {
            user_id = req.session.user._id; // This will be grabbed from the session id!
            user = await userData.getUserById(user_id);
            console.log(user_id)
        } catch (e) {
            return res.status(500).json({ error: e });
        }

        try {
            //TODO: better handling
            if (!userData.isAdmin(user_id)) {
                return res.status(403).json({ error: Forbidden });
            }

            return res.render("tickets/checkTickets")
        } catch (e) {
            return res.status(500).json({ error: e });

        }
    })

export default router;