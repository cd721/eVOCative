import { Router } from 'express';

const router = Router();

router.route('/').get(async (req, res) => {
    try {
        return res.render("quiz/index");

    } catch (e) {
        return res.status(500).json({ error: e });
    }


});


router.route('/definitionToWord').get(async (req, res) => {
    try {
        return res.render("quiz/definitionToWord");

    } catch (e) {
        return res.status(500).json({ error: e });
    }
});


router.route('/wordToDefinition').get(async (req, res) => {
    try {
        return res.render("quiz/wordToDefinition");

    } catch (e) {
        return res.status(500).json({ error: e });
    }
});
export default router;