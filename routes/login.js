import { Router } from "express";
import userValidation from "../data/users/userValidation.js";
import userData from "../data/users/users.js";
const router = Router();

router
  .route("/")
  .get(async (req, res) => {
    try {
      return res.render("login");
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  })
  .post(async (req, res) => {
    let login = req.body;
    let errorList = [];
    let username = login.loginUser;
    let password = login.loginPass;
    let userList;
    let firstName = "Catherine";
    let lastName = "DeMario";
    let userId = "";

    try {
      username = userValidation.validateName(username);
    } catch (e) {
      errorList.push(e);
    }

    try {
      password = userValidation.validatePassword(password);
    } catch (e) {
      errorList.push(e);
    }

    try {
      userList = await userData.getAllUsers();
    } catch (e) {
      errorList.push(e);
    }

    if (errorList.length > 0) {
      return res.render("login", {
        errors: errorList,
        hasErrors: true,
        username: username,
        log: login,
      });
    } else {
      req.session.user = await userData.getUserByUsername(username);
      console.log(req.session.user);
      //TODO: revise?
      const userId = req.session.user._id.toString();
      return res.redirect(`/users/${userId}`);
    }
  });
export default router;
