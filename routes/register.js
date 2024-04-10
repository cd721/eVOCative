import { Router } from "express";
import idValidation from "../validation/idValidation.js";
import userData from "../data/users/users.js";

const router = Router();

router.route("/").get(async (req, res) => {
  try {
    return res.render("register");
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.route("/").post(async (req, res) => {
  let newUser = req.body;
  let { fName, lName, email, username, password } = newUser;
  try {
    await userData.addUser(fName, lName, email, username, password);
    return res.render("register");
  } catch (error) {
    return res.status(500).json({ error });
  }
});

export default router;
