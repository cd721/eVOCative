import forumRoutes from "./forum.js";
import userRoutes from "./users.js";
import quizRoutes from "./quiz.js";
import loginRoutes from "./login.js";
import logoutRoutes from "./logout.js";
import registerRoutes from "./register.js";
import wordRoutes from './words.js';
import homeRoutes from './home.js';
import adminRoutes from './admin.js';
import reportRoutes from './report.js';
import aboutRoutes from './about.js';

import path from "path";
import { static as staticDir } from "express";

const constructorMethod = (app) => {
  app.use('/admin', adminRoutes);
  app.use('/home', homeRoutes);
  app.use("/forum", forumRoutes);
  app.use("/quiz", quizRoutes);
  app.use("/posts", forumRoutes);
  app.use("/login", loginRoutes);
  app.use("/logout", logoutRoutes);
  app.use("/users", userRoutes);
  app.use("/register", registerRoutes);
  app.use('/words', wordRoutes);
  app.use('/report', reportRoutes);
  app.use('/about', aboutRoutes);


  // app.get("/about", (req, res) => {
  //   res.sendFile(path.resolve("static/about.html"));
  // });
  app.use("/public", staticDir("public"));

  app.get("/", (req, res) => {

    res.redirect("/home");
  });

  app.use("*", (req, res) => {
    res.render("notFoundError");
  });
};

export default constructorMethod;
