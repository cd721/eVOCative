import { Router } from "express";

const router = Router();
router.route("/").get(async (req, res) => {
    try {
        return res.render("about");
      } catch (e) {
        return res.status(500).render("errorSpecial", {error: e});
      }
});

export default router;