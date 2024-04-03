import { Router } from 'express';
const router = Router();
router.route('/').get(async (req, res) => {
    try {
        return res.json({});
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

export default router;