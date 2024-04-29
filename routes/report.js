import { Router } from 'express';
const router = Router();

import xss from "xss";

router.route('/word/:id').get(async (req, res) => {
    try {
        //TODO: validate the provided word ID
    } catch (e) {
        return res.status(400).json({ error: e });

    }


    try {


        return res.render("report/reportWord", {});
    } catch (e) {
        return res.status(500).json({ error: e });
    }
}).post(async (req, res) => {


});


router.route('/post/:id').get(async (req, res) => {

    try {
        //TODO: validate the provided post ID
    } catch (e) {
        return res.status(400).json({ error: e });

    }


    try {

        return res.render("report/reportPost", {});
    } catch (e) {
        return res.status(500).json({ error: e });
    }
}).post(async (req, res) => {


});


export default router;