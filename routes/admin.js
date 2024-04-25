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

export default router;