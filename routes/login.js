import { Router } from "express";
import idValidation from "../validation/idValidation.js";
import userData from "../data/users/users.js";

import postData from "../data/posts/posts.js";
const router = Router();

router.route("/").get(async (req, res) => {
  try {
    return res.render("login");
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.route("/").post(async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userData.getUserByUsername(username);
    if (user && user.password === password) {
      req.session.user = user;
      return res.redirect("/profile");
    } else {
      return res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.route("/logout").get(async (req, res) => {
  try {
    req.session.destroy();
    return res.redirect("/");
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.route("/profile").get(async (req, res) => {
  try {
    return res.render("/users/profile", { user });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});
export default router;
