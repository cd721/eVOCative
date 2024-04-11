import { Router } from "express";
import idValidation from "../validation/idValidation.js";
import userData from "../data/users/users.js";
import * as valid from "../data/users/userValidation.js";

const router = Router();

const checkPassword = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    throw `Error: Passwords do not match`;
  }
};

router.route("/").get(async (req, res) => {
  try {
    return res.render("register");
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.route("/").post(async (req, res) => {
  let newUser = req.body;
  try {
    await userData.addUser(
      newUser.fname,
      newUser.lname,
      newUser.email,
      newUser.username,
      newUser.password
    );
    return res.render("login");
  } catch (e) {
    console.log(e);
    return res.status(400).render("error", { error: e });
  }
});

export default router;
