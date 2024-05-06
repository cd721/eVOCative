import { Router } from "express";
import idValidation from "../validation/idValidation.js";
import wordData from "../data/words/words.js";
import userData from "../data/users/users.js";
const router = Router();

router.route("/").get(async (req, res) => {
  try {
    if (req.session.user) {
      let user = req.session.user;
      const wordList = await userData.getWordsForUser(user._id.toString());

      console.log(wordList);
      return res.render("words/index", { 
        title: "WordBank",
        words: wordList 
      });
    }
  } catch (e) {
    return res.status(500).render("errorSpecial", { error: e });
  }
});

router.route("/all").get(async (req, res) => {
  try {
    if (req.session.user) {
      const wordList = await wordData.getAllWords();

      console.log(wordList);
      return res.render("words/allWords", { 
        title: "Word Archive",
        words: wordList 
      });
    }
  } catch (e) {
    return res.status(500).render("errorSpecial", { error: e });
  }
});

router.route("/all/:id").get(async (req, res) => {
  let word_id = req.params.id;
  let word;

  if (req.session.user) {
    let user = req.session.user;

    try {
      word_id = idValidation.validateId(word_id);
      word = await wordData.getWordById(word_id);

    } catch (e) {
      res.status(400).render("error");
    }

    try {
      return res.render("words/word", { title: "Word", word: word, admin: true });
    } catch (e) {
      return res.status(500).render("errorSpecial", { error: e });
    }
  }
});

router.route("/:id").get(async (req, res) => {
  let word_id = req.params.id;
  let word;

  if (req.session.user) {
    let user = req.session.user;

    try {
      word_id = idValidation.validateId(word_id);
      word = await wordData.getWordById(word_id);
      word.date_user_received_word = await userData.getDateUserReceivedWord(user._id, word_id);
      word.flagged_for_deletion = await userData.wordFlaggedForDeletionForUser(user._id, word_id);
      word.date_flagged_for_deletion = await userData.getDateFlaggedForDeletionForUser(user._id, word_id);
      console.log(word)
    } catch (e) {
      return res.status(400).render("error");
    }

    try {
      const adminStatus = await userData.isAdmin(user._id);

      return res.render("words/word", { 
        title: `${word.word}`, 
        word: word, 
        admin: adminStatus,
        user_id: user._id.toString()
      });
    } catch (e) {
      return res.status(500).render("errorSpecial", { error: e });
    }
  }
});

export default router;
