import { Router } from "express";
import userValidation from "../data/users/userValidation.js";
import userData from "../data/users/users.js";
import xss from "xss";
const router = Router();

router.route("/")
  .get(async (req, res) => {
    try {
      return res.render("login");
    } catch (e) {
      return res.status(500).render("internalServerError");
    }
  })
  .post(async (req, res) => {
    let username = xss(req.body.username);
    let password = xss(req.body.password);
      
    let errors = [];
    try {
      username = userValidation.validateName(username);
      password = userValidation.validatePassword(password);

      const user = await userData.loginUser(username, password);
      if (user) {
        req.session.user = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          role: user.role
        }

        return res.redirect(`/users/${user._id.toString()}`);
        
      } else {
        throw 'Invalid username or password!';
      } 
    } catch (e) {
      errors.push(e);
      return res.status(400).render('login', {
        errors
      });
    }
});

export default router;
