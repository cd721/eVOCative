import express from "express";
const app = express();
import path from "path";
import configRoutes from "./routes/index.js";
import exphbs from "express-handlebars";
import session from "express-session";
import roundto from 'roundto'
// arrays for organization
const noFrames = ["/login", "/register", "/logout"];

const rewriteUnsupportedBrowserMethods = async (req, res, next) => {
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

app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",

    helpers: {
      // date formatters
      dateWordIndex: (date) => {
        return new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      },

      dateWordSingle: (date) => {
        return new Date(date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      },

      dateProfile: (date) => {
        return new Date(date).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      },
      json: (context) => {
        return JSON.stringify(context);
      },

      toPercentage: (rate_of_accuracy) => {
        if (typeof rate_of_accuracy === 'number') {
          const rawPercentage = (rate_of_accuracy * 100);
          const rounded = roundto(rawPercentage, 2);
          return rounded.toString();
        } else {
          return rate_of_accuracy;
        }
      },

      wasDeletedLessThan24HoursAgo(date_flagged_for_deletion, flagged_for_deletion) {
        console.log(flagged_for_deletion)
        if (flagged_for_deletion) {
          let today = new Date().getTime() + (1 * 24 * 60 * 60 * 1000)
          console.log(date_flagged_for_deletion)
          return date_flagged_for_deletion < today;
        } else {
          return false;
        }
      }


    },
    partialsDir: ["views/partials/"],
  })
);
app.set("view engine", "handlebars");

// MIDDLEWARE
app.use(
  session({
    name: "AuthCookie", //name of cookie on client
    secret: "some secret string!", //for encryption
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }, //how long until session expires
  })
);

//Handlebars middleware
// for the handlebars to figure out if the user is logged in or not
app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.isAuthenticated = true;
  } else {
    res.locals.isAuthenticated = false;
  }
  next();
});

// for handlebars to determine if there should be a header/footer on the page
app.use((req, res, next) => {
  if (noFrames.includes(req.path)) {
    res.locals.noFrame = true;
  } else {
    res.locals.noFrame = false;
  }
  next();
});

// allows handlebars to access the user's info
// check routes/login.js for what is in req.session.user
app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.sessionUser = req.session.user;
  }
  next();
});

//Authentication middleware
//cannot access certain pages unless logged in

app.use("/", (req, res, next) => {
  if (req.path === "/" || req.path === "/home") {
    //if the user is  logged in and is not trying to logout
    return res.render("home", {
      user: req.session.user,
      notAuthUser: !res.locals.isAuthenticated,
    });
  } else {
    next();
  }
});

app.use("/words", (req, res, next) => {
  if (!req.session.user) {
    //if the user is not logged in
    return res.redirect("/");
  } else {
    next(); //calls next middleware in stack, if the last then calls route
  }
});

app.use("/words/all", (req, res, next) => {
  if (!req.session.user) {
    //if the user is not logged in
    return res.redirect("/");
  } else {
    if (req.session.user.role !== "admin") {
      return res.redirect("/words")
    } else {
      next(); //calls next middleware in stack, if the last then calls route
    }
  }
});

//Authentication middleware for quiz
app.use("/quiz", (req, res, next) => {
  if (!req.session.user) {
    //if the user is not logged in
    return res.redirect("/");
  } else {
    next(); //calls next middleware in stack, if the last then calls route
  }
});

//Authentication middleware for quiz
app.use("/report", (req, res, next) => {
  if (!req.session.user) {
    //if the user is not logged in
    return res.redirect("/");
  } else {
    next(); //calls next middleware in stack, if the last then calls route
  }
});

//Authentication middleware
app.use("/forum", (req, res, next) => {
  if (!req.session.user) {
    //if the user is not logged in
    return res.redirect("/");
  } else {
    next(); //calls next middleware in stack, if the last then calls route
  }
});

//Authentication middleware
app.use("/posts", (req, res, next) => {
  if (!req.session.user) {
    //if the user is not logged in
    return res.redirect("/");
  } else {
    next(); //calls next middleware in stack, if the last then calls route
  }
});

//Authentication middleware
app.use("/users", (req, res, next) => {
  if (!req.session.user) {
    //if the user is not logged in
    return res.redirect("/");
  } else {
    next();
  }
});

//Authentication middleware
app.use("/admin", (req, res, next) => {
  if (!req.session.user) {
    //if the user is not logged in
    return res.redirect("/");
  } else {
    if (req.session.user.role !== "admin") {
      return res.redirect(`/users/${req.session.user._id}`);
    } else {
      next(); //calls next middleware in stack, if the last then calls route
    }
  }
});

//Login middleware
//if the user is logged in then redirect to these routes
app.use("/login", (req, res, next) => {
  if (req.session.user) {
    //is the user already logged in
    const userId = req.session.user._id;
    return res.redirect(`/users/${userId}`);
  } else {
    next();
  }
});

app.use("/register", (req, res, next) => {
  if (req.session.user) {
    const userId = req.session.user._id;
    return res.redirect(`/users/${userId}`);
  } else {
    next();
  }
});

// Logout middleware
// makes sure only users that are logged in can access it
app.use("/logout", (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  } else {
    console.log(req.session.user);
    next();
  }
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
