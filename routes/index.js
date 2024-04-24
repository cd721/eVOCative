import forumRoutes from "./forum.js";
import userRoutes from "./users.js";
import quizRoutes from "./quiz.js";
import loginRoutes from "./login.js";
import logoutRoutes from "./logout.js";
import registerRoutes from "./register.js";
import wordRoutes from './words.js';
import homeRoutes from './home.js'

import path from "path";
import { static as staticDir } from "express";

const constructorMethod = (app) => {
  app.use('/home', homeRoutes);

  app.use("/forum", forumRoutes);
  app.use("/quiz", quizRoutes);
  app.use("/posts", forumRoutes);
  app.use("/login", loginRoutes);
  app.use("/logout", logoutRoutes);
  app.use("/users", userRoutes);
  app.use("/register", registerRoutes);
  app.use('/words', wordRoutes);



  app.get("/about", (req, res) => {
    res.sendFile(path.resolve("static/about.html"));
  });
  app.use("/public", staticDir("public"));

  app.get("/", (req, res) => {

    res.redirect("/home");
  });

  app.use("*", (req, res) => {
    res.render("error");
  });
};

export default constructorMethod;
