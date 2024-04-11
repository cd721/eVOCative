import { Router } from 'express';
import idValidation from '../validation/idValidation.js';
import wordData from '../data/words/words.js';

const router = Router();

router.route('/')
    .get(async (req, res) => {
        try {
            const wordList = await wordData.getAllWords();
            return res.render('words/index', { words: wordList });
        } catch (e) {
            return res.status(500).json({ error: e });
        }
});

router.route('/:id')
    .get(async (req, res) => {
        let word_id = req.params.id;
        let word;

        try {
            word_id = idValidation.validateId(word_id);
            word = await wordData.getWordById(word_id);
        } catch (e) {
            res.status(400).render('error');
        }

        try {
            return res.render('words/word', { title: "Word", word: word });
        } catch (e) {
            return res.status(500).json({ error: e});
        }
});

export default router;

