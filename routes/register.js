import { Router } from "express";
import idValidation from "../validation/idValidation.js";
import userData from "../data/users/users.js";
import userValidation from "../data/users/userValidation.js";
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
    await userValidation.validateEmail(newUser.email);
  } catch (e) {
    return res.render("register", {
      error: e,
      fname: newUser.fname,
      lname: newUser.lname,
    });
  }

  try {
    await userValidation.emailDoesNotAlreadyExist(newUser.email);
  } catch (e) {
    return res.render("register", {
      error: e,
      fname: newUser.fname,
      lname: newUser.lname,
    });
  }

  try {
    await userValidation.usernameDoesNotAlreadyExist(newUser.username);
  } catch (e) {
    return res.render("register", {
      error: e,
      fname: newUser.fname,
      lname: newUser.lname,
      email: newUser.email,
      username: newUser.username,
    });
  }

  try {
    checkPassword(newUser.password, newUser.confirmPassword);
  } catch (e) {
    return res.render("register", {
      error: e,
      fname: newUser.fname,
      lname: newUser.lname,
      email: newUser.email,
    });
  }

  let userAdded;

  try {
    userAdded = await userData.addUser(
      newUser.fname,
      newUser.lname,
      newUser.email,
      newUser.username,
      newUser.password
    );
    return res.redirect(`users/${userAdded._id}`);
  } catch (e) {
    console.log(e);
    return res.status(400).render("error", { error: e });
  }
});

export default router;
