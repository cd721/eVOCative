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
  let { firstName, lastName, email, username, password, confirmPassword } = req.body;
  
  let errors = [];
  try {
    firstName = userValidation.validateName(firstName);
    lastName = userValidation.validateName(lastName);
    email = userValidation.validateEmail(email);
    username = userValidation.validateUsername(username);
    password = userValidation.validatePassword(password);
    checkPassword(password, confirmPassword);

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
