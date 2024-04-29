import { Router } from 'express';
const router = Router();

import xss from "xss";

router.route('/').get(async (req, res) => {
    try {

        return res.render("report", {});
    } catch (e) {
        return res.status(500).json({ error: e });
    }
}).post(async (req, res) => {


});

export default router;