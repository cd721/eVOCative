import { Router } from "express";
import userData from "../data/users/users.js";
import wordData from "../data/words/words.js";

import wordInfo from "../data/words/words.js";
import quizHelpers from "../helpers/quizHelpers.js";
import xss from "xss";
import validation from "../validation/generalValidation.js";
import { ObjectId } from "mongodb";

const router = Router();

router.route("/").get(async (req, res) => {
  try {
    return res.render("quiz/index");
  } catch (e) {
    return res.status(500).render("errorSpecial", { error: e });
  }
});

router
  .route("/definitionToWord")
  .get(async (req, res) => {
    let user;
    try {
      const user_id = req.session.user._id; // This will be grabbed from the session id!
      user = await userData.getUserById(user_id);
    } catch (e) {
      return res.status(500).render("errorSpecial", { error: e });
    }

    let randomWordForUser;
    if (user.words.length === 0) {
      return res.render("quiz/noWords");
    }

    try {
      randomWordForUser = quizHelpers.getRandomWordForUser(
        user,
        req.session.previousWordId
      );

      if (randomWordForUser === "noWords") {
        return res.render("quiz/noWords");
      } else if (randomWordForUser === "oneWord") {
        return res.render("quiz/oneWord");
      }

      req.session.previousWordId = randomWordForUser._id.toString();
    } catch (e) {
      return res.status(500).render("errorSpecial", { error: e });
    }

    let randomWord;
    let words;
    try {
      randomWord = await wordInfo.getWordById(randomWordForUser._id.toString());

      words = await wordInfo.getAllWords();
    } catch (e) {
      return res.status(500).render("errorSpecial", { error: e });
    }

    try {
      const buttonDefs = quizHelpers.setUpDefinitionToWordGame(
        words,
        randomWord
      );
      let correctInd;
      for (let i = 0; i < buttonDefs.length; i++) {
        if (buttonDefs[i] == randomWord.definition) {
          correctInd = i;
          //   console.log(correctInd)
        }
      }

      req.session.correctIndex = correctInd; //TODO: what if the user has a quiz open in multiple tabs?

      return res.render("quiz/definitionToWord", {
        curWord: randomWord.word,
        def0: buttonDefs[0],
        def1: buttonDefs[1],
        def2: buttonDefs[2],
        def3: buttonDefs[3],
        correctInd: correctInd,
      });
    } catch (e) {
      return res.status(500).render("errorSpecial", { error: e });
    }
  })
  .post(async (req, res) => {
    try {
      let user = req.session.user;

      if (
        req.session.correctIndex !== 0 &&
        req.session.correctIndex !== 1 &&
        req.session.correctIndex !== 2 &&
        req.session.correctIndex !== 3
      ) {
        //If correctIndex is null, the user already answered the question.
        //This prevents the user from using client side JS to modify the form
        //and change their original answer.
        return res.redirect("/quiz/invalidAnswer");
      }

      let reqBodySelected = xss(req.body.selectedIndex);
      let selectedIndex = validation.validateIndex(reqBodySelected);

      //Increase number of times played for user and word
      let wordFromReq = xss(req.body.wordBeingPlayed);
      const word = await wordInfo.getWordByWord(wordFromReq);
      await wordInfo.updateTimesPlayed(word._id.toString());
      await userData.updateTimesPlayedForUser(user._id.toString());

      const user_times_played = await userData.getTimesPlayedForUser(
        user._id.toString()
      );
      const word_times_played = await wordInfo.getTimesPlayed(
        word._id.toString()
      );

      //reset correct index
      const correctIndexBeforeReset = req.session.correctIndex;
      let userWasCorrect;

      //Update accuracy score for user
      if (selectedIndex === req.session.correctIndex) {
        userWasCorrect = true;
      } else {
        userWasCorrect = false;
      }

      await quizHelpers.updateAccuracyScores(
        user._id.toString(),
        word._id.toString(),
        userWasCorrect,
        user_times_played,
        word_times_played
      );

      //Reset correct index last
      req.session.correctIndex = null;

      return res.status(200).json({
        correct: userWasCorrect,
        correctIndex: correctIndexBeforeReset,
      });
    } catch (e) {
      //reset correct index?
      return res.status(500).render("errorSpecial", { error: e });
    }
  });

router
  .route("/wordToDefinition")
  .get(async (req, res) => {
    let user;
    try {
      const user_id = req.session.user._id; // This will be grabbed from the session id!
      user = await userData.getUserById(user_id);
    } catch (e) {
      return res.status(500).render("errorSpecial", { error: e });
    }

    let randomWordForUser;
    if (user.words.length === 0) {
      return res.render("quiz/noWords");
    }

    try {
      randomWordForUser = quizHelpers.getRandomWordForUser(
        user,
        req.session.previousWordId
      );

      if (randomWordForUser === "noWords") {
        return res.render("quiz/noWords");
      } else if (randomWordForUser === "oneWord") {
        return res.render("quiz/oneWord");
      }

      req.session.previousWordId = randomWordForUser._id.toString();
    } catch (e) {
      return res.status(500).render("errorSpecial", { error: e });
    }

    let randomWord;
    let words;

    let randomDefinition;
    try {
      randomWord = await wordInfo.getWordById(randomWordForUser._id.toString());
      randomDefinition = randomWord.definition;
      words = await wordInfo.getAllWords();
    } catch (e) {
      return res.status(500).render("errorSpecial", { error: e });
    }
    try {
      const buttonDefs = quizHelpers.setUpWordToDefinitionGame(
        words,
        randomWord
      );

      let correctInd;
      for (let i = 0; i < buttonDefs.length; i++) {
        if (buttonDefs[i] == randomWord.word) {
          correctInd = i;
          // console.log(correctInd)
        }
      }

      req.session.correctIndex = correctInd; //TODO: what if the user has a quiz open in multiple tabs?

      return res.render("quiz/wordToDefinition", {
        curDefinition: randomDefinition,
        word0: buttonDefs[0],
        word1: buttonDefs[1],
        word2: buttonDefs[2],
        word3: buttonDefs[3],
        correctInd: correctInd,
      });
    } catch (e) {}
  })
  .post(async (req, res) => {
    try {
      let user = req.session.user;
      if (
        req.session.correctIndex !== 0 &&
        req.session.correctIndex !== 1 &&
        req.session.correctIndex !== 2 &&
        req.session.correctIndex !== 3
      ) {
        //If correctIndex is null, the user already answered the question.
        //This prevents the user from using client side JS to modify the form
        //and change their original answer.
        return res.redirect("/quiz/invalidAnswer");
      }

      let reqBodySelected = xss(req.body.selectedIndex);
      let selectedIndex = validation.validateIndex(reqBodySelected);

      //Increase number of times played for word and user
      let reqBodyDef = xss(req.body.definitionBeingPlayed);
      const wordInfo = await wordData.getWordByDefinition(reqBodyDef);
      await wordData.updateTimesPlayed(wordInfo._id.toString());
      await userData.updateTimesPlayedForUser(user._id.toString());

      const user_times_played = await userData.getTimesPlayedForUser(
        user._id.toString()
      );
      const word_times_played = await wordData.getTimesPlayed(
        wordInfo._id.toString()
      );

      const correctIndexBeforeReset = req.session.correctIndex;
      let userWasCorrect;

      ////update accuracy score for user

      if (selectedIndex === correctIndexBeforeReset) {
        userWasCorrect = true;
      } else {
        userWasCorrect = false;
      }

      await quizHelpers.updateAccuracyScores(
        user._id.toString(),
        wordInfo._id.toString(),
        userWasCorrect,
        user_times_played,
        word_times_played
      );

      //Do this last
      req.session.correctIndex = null;

      return res.status(200).json({
        correct: userWasCorrect,
        correctIndex: correctIndexBeforeReset,
      });
    } catch (e) {
      //reset correct index?
      return res.status(500).render("errorSpecial", { error: e });
    }
  });

router.route("/invalidAnswer").get(async (req, res) => {
  try {
    return res.render("quiz/invalidAnswer");
  } catch (e) {
    return res.status(500).render("errorSpecial", { error: e });
  }
});

export default router;
