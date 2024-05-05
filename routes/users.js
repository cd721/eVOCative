import { Router } from "express";
const router = Router();
import idValidation from "../validation/idValidation.js";
import userData from "../data/users/users.js";
import helpers from "../helpers/helpers.js";
import wordData from "../data/words/words.js";

router.route("/").get(async (req, res) => {
  try {
    const userList = await userData.getAllUsers();
    return res.render("users/index", { users: userList });
  } catch (e) {
    return res.status(500).render("errorSpecial", { error: e });
  }
});

router.route("/:id").get(async (req, res) => {
  let user_id = req.params.id.toString();
  let user;
  let errors;

  let a_user_is_logged_in;
  if (req.session.user) {
    a_user_is_logged_in = true;
  } else {
    a_user_is_logged_in = false;
  }

  try {
    user_id = idValidation.validateId(user_id);
    user = await userData.getUserById(user_id);
  } catch (e) {
    return res.status(400).render("notFoundError");
  }

  try {
    //add new word of the day to user word bank automatically
    let date_last_word_was_received = await userData.getDateLastWordWasReceived(
      user_id
    );
    const wordsUserHas = await userData.getWordsForUser(user_id);

    let recievedWOD = false;

    const totalNumberOfWords = await wordData.getNumberOfWordsInDB();
    if (wordsUserHas.length < totalNumberOfWords) {
      if (
        !date_last_word_was_received ||
        helpers.dateIsNotToday(date_last_word_was_received)
      ) {
        await userData.addWordOfDay(user_id);
        recievedWOD = true;
      }
    }

    let words = await userData.getWordsForUser(user_id);
    const userIsAdmin = await userData.isAdmin(user_id);

    // destructure so that sensitive fields are not sent to handlebars
    const { hashedPassword, email, ...safeUserData } = user;

    let streakOneDay = false;
    if (user.streak === 1) {
      streakOneDay = true;
    }
    let longestStreakOneDay = false;
    if (user.longest_streak === 1) {
      longestStreakOneDay = true;
    }

    if (userIsAdmin) {
      return res.render("users/adminProfile", {
        title: "Admin Profile",
        user: safeUserData,
        words: words,
        streakOneDay: streakOneDay,
        longestStreakOneDay: longestStreakOneDay,
      });
    }
    return res.render("users/profile", {
      title: "User Profile",
      user: safeUserData,
      words: words,
      WOD: recievedWOD,
      streakOneDay: streakOneDay,
      longestStreakOneDay: longestStreakOneDay,
    });
  } catch (e) {
    errors.push(e);
    //If no user is logged in, we don't want to show the error page with links to other pages on the site
    if (a_user_is_logged_in) {
        return res.status(500).render("errorSpecial", { error: e });
    } else {
        return res.status(400).render('login', { errors });
    }  }
});

router.route("/:userId/deleteWord/:wordId").get(async (req, res) => {
  let user_id = req.params.userId;
  let word_id = req.params.wordId;
  try {
    word_id = idValidation.validateId(word_id);
    user_id = idValidation.validateId(user_id);
  } catch (e) {
    return res.status(400).render("notFoundError");
  }

  try {
    userData.flagWordForDeletionForUser(user_id, word_id);

    let word = await wordData.getWordById(word_id);

    return res
      .status(200)
      .render("users/deleteWordConfirmationStandardUser", { word: word.word });
  } catch (e) {
    return res.status(500).render("errorSpecial", { error: e });
  }
});
router.route("/:userId/recoverWord/:wordId").get(async (req, res) => {
  let word_id;
  let user_id;

  try {
    word_id = idValidation.validateId(req.params.wordId);
    user_id = idValidation.validateId(req.params.userId);
  } catch (e) {
    return res.status(400).render("notFoundError");
  }

  let user;
  if (req.session.user) {
    user = req.session.user;

    //If the user id provided in the URL doesn't match the currently logged in user
    if (user._id !== user_id) {
      return res.status(400).render("error");
    }

    try {
      await userData.unflagWordForDeletionForUser(user_id, word_id);

      return res.status(200).redirect("/words");
    } catch (e) {
      return res.status(500).render("errorSpecial", { error: e });
    }
  }
});

export default router;
