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
  let { fName, lName, email, username, password, confirmPassword } = newUser;
  try {
    valid.validateName(fName);
    valid.validateName(lName);
    valid.validateEmail(email);
    await userData.addUser(fName, lName, email, username, password);
    return res.render("register");
  } catch (error) {
    return res.status(500).json({ error });
  }
});

export default router;
