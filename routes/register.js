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
  let errors=[]; 
  try {
    return res.render("register");
  } catch (e) {
    errors.push(e);
    return res.status(500).render("register", {error: e});
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
  try{
    firstName = userValidation.validateName(firstName);
  } catch (e) {
    errors.push(e);
    firstName = "";
  }

  try{
    lastName = userValidation.validateName(lastName);
  } catch (e) {
    errors.push(e);
    lastName = "";
  }

  try{
    email = userValidation.validateEmail(email);
  } catch (e) {
    errors.push(e);
    email = "";
  }

  if(email.length !== 0) {
    try{
      email = await userValidation.emailDoesNotAlreadyExist(email);
    } catch (e) {
      errors.push(e);
      email = "";
    }
  }


  try{
    username = userValidation.validateUsername(username);
  } catch (e) {
    errors.push(e);
    username = "";
  }

  if(username.length !== 0) {
    try{
      username = await userValidation.usernameDoesNotAlreadyExist(username);
    } catch (e) {
      errors.push(e);
      username = "";
    }
  }

  try{
    password = userValidation.validatePassword(password);
  } catch (e) {
    errors.push(e);
  }

  if(password.length !== 0) {
    try{
      checkPassword(password, confirmPassword);
    } catch (e) {
      errors.push(e);
    }
  }

  if(errors.length !== 0) {
    return res.status(400).render('register', {
      errors,
      data: req.body,
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username
    });
  }
  else {
    try {
      username = username.toLowerCase();
      user = await userData.addUser(
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
      errors.push(e);
    }
  }


});

export default router;
