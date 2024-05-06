import { Router } from "express";
import idValidation from "../validation/idValidation.js";
import userData from "../data/users/users.js";
import wordData from "../data/words/words.js";
import postData from "../data/posts/posts.js";
const router = Router();
router.route("/").get(async (req, res) => {
  let isAuthUser = false;
  if (req.session.user) {
    isAuthUser = true;
  }
  if (isAuthUser) {
    let user = req.session.user;

    let date_last_word_was_received = userData.getDateLastWordWasReceived(
      user._id.toString()
    );
    if (
      !date_last_word_was_received ||
      helpers.dateIsNotToday(date_last_word_was_received)
    ) {
      const wordCollection = await wordData.getAllWords();
      let randomWordDBEntry =
        wordCollection[Math.floor(Math.random() * wordCollection.length)];
      while (user.words.includes(randomWordDBEntry.word)) {
        randomWordDBEntry =
          wordCollection[Math.floor(Math.random() * wordCollection.length)];
      }

      try {
        await userData.addWordForUser(
          user._id.toString(),
          randomWordDBEntry._id.toString()
        );
      } catch {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }

    return res.render("home", {
      word: randomWordDBEntry.word,
      notAuthUser: !isAuthUser,
    });
  } else {
    return res.render("home", { notAuthUser: !isAuthUser });
  }
});
export default router;
