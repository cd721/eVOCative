import { Router } from 'express';
const router = Router();
import idValidation from '../validation/idValidation.js';
import userData from '../data/users/users.js';
import helpers from '../helpers/helpers.js';

router.route('/').get(async (req, res) => {
    try {
        const userList = await userData.getAllUsers();
        return res.render("users/index", { users: userList });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

router
    .route('/:id')
    .get(async (req, res) => {
        let user_id = req.params.id;
        let user;

        try {
            user_id = idValidation.validateId(user_id);
            user = await userData.getUserById(user_id);

        } catch (e) {
            return res.status(400).render("error");
        }

        try {
            //add new word of the day to user word bank automatically
            let date_last_word_was_received = await userData.getDateLastWordWasReceived(user_id);

            if(!date_last_word_was_received || helpers.dateIsBeforeToday(date_last_word_was_received)) {
                await userData.addWordOfDay(user_id);
            };

            let words = await userData.getWordsForUser(user_id);
            const userIsAdmin = await userData.isAdmin(user_id);

            // destructure so that sensitive fields are not sent to handlebars
            const { hashedPassword, email, ...safeUserData } = user; 
            
            if (userIsAdmin) {
                return res.render("users/adminProfile", { title: "Admin Profile", user: safeUserData, words: words });
            }
            return res.render("users/profile", { title: "User Profile", user: safeUserData, words: words });

        } catch (e) {
            return res.status(500).json({ error: e });
        }
    })
    ;

router.route('/:userId/remove/:wordId')
    .get(async (req, res) => {
        let user_id = req.params.userId;
        let word_id = req.params.wordId;
        try {
            word_id = idValidation.validateId(word_id);
            user_id = idValidation.validateId(user_id);
        } catch (e) {
            return res.status(400).render("error");
        }

        try {

            userData.removeWordForUser(user_id, word_id);


            return res.status(200).json({ word_id: "removed" });

        } catch (e) {
            return res.status(500).json({ error: e });
        }
    });

export default router;