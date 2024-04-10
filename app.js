import express from "express";
const app = express();
import path from "path";
import configRoutes from "./routes/index.js";
import exphbs from "express-handlebars";
import session from "express-session";

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
};

app.use("/public", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// MIDDLEWARE
app.use(express.json());

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!", //for encryption
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }, //how long until session expires
  })
);

//Authentication middleware
app.use("/private", (req, res, next) => {
  console.log(req.session.id);
  if (!req.session.user) {
    return res.redirect("/");
  } else {
    next(); //calls next middleware in stack, if the last then calls route
  }
});

//Login middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalURL}`);
  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
