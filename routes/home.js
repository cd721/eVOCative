import { Router } from 'express';
import idValidation from '../validation/idValidation.js';
import userData from '../data/users/users.js';
import wordData from '../data/words/words.js';
import postData from '../data/posts/posts.js'
const router = Router();
router.route('/').get(async (req, res) => {
    if (req.session.user) {
        let user = req.session.user;
        if (!user.received_todays_word) {
            const wordCollection = await wordData.getAllWords();
            let randomWord = wordCollection[Math.floor(Math.random() * wordCollection.length)].word;

            while (user.words.includes(randomWord.word)) {
                randomWord = wordCollection[Math.floor(Math.random() * wordCollection.length)].word;
            }

            user.received_todays_word = true; //TODO: need to change this logic

        }

        return res.render("home", { word: word });
    } else {
        return res.render("home");
    }



});
export default Router;