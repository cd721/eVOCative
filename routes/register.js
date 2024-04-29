import { Router } from "express";
import idValidation from "../validation/idValidation.js";
import userData from "../data/users/users.js";
import userValidation from "../data/users/userValidation.js";
import xss from "xss";
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
  let firstName = xss(req.body.firstName);
  let lastName = xss(req.body.lastName);
  let email = xss(req.body.email);
  let username = xss(req.body.username);
  let password = xss(req.body.password);
  let confirmPassword = xss(req.body.confirmPassword);

  let errors = [];
  try {
    firstName = userValidation.validateName(firstName);
    lastName = userValidation.validateName(lastName);
    email = userValidation.validateEmail(email);
    email = await userValidation.emailDoesNotAlreadyExist(email);

    username = userValidation.validateUsername(username);
    username = await userValidation.usernameDoesNotAlreadyExist(username);

    password = userValidation.validatePassword(password);
    checkPassword(password, confirmPassword);

    username = username.toLowerCase();
    const user = await userData.addUser(
      firstName,
      lastName,
      email,
      username,
      password
    );

    if (user.signupCompleted) {
      return res.redirect('/login');
    } else {
      return res.status(500).render('register', {
        error: 'Internal server error.'
      });
    }

  } catch (e) {
    errors.push(e)
    return res.status(400).render('register', {
      errors,
      data: req.body
    });
  }
});

export default router;
