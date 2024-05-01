import { Router } from "express";
import userValidation from "../data/users/userValidation.js";
import userData from "../data/users/users.js";
const router = Router();

router.route("/")
    .get(async (req, res) => {
        try {
            req.session.destroy();
            return res.render("loggedOut");
        } catch (e) {
            return res.status(500).render("errorSpecial", {error: e});
        }
    }
    );

export default router;
