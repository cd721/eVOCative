import { Router } from "express";
import userData from "../data/users/users.js";
import wordData from "../data/words/words.js";
import { ObjectId } from "mongodb";

const router = Router();

router.route("/").get(async (req, res) => {
  try {
    return res.render("quiz/index");
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.route("/definitionToWord")
  .get(async (req, res) => {
    let user;
    try {
      const user_id = req.session.user._id; // This will be grabbed from the session id!
      user = await userData.getUserById(user_id);
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    let randomWordForUser;
    if (user.words.length === 0) {
      return res.render("quiz/noWords");
    }

    try {
      randomWordForUser =
        user.words[Math.floor(Math.random() * user.words.length)];

      if (!randomWordForUser) {
        throw "The user has no words";
      }
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    let randomWord;
    let words;
    try {
      randomWord = await wordData.getWordById(randomWordForUser._id.toString());

      words = await wordData.getAllWords();
    } catch (e) { }

    try {
      let randomDef1 = words[Math.floor(Math.random() * words.length)];
      while (randomDef1.word === randomWord.word) {
        randomDef1 = words[Math.floor(Math.random() * words.length)];
      }

      let randomDef2 = words[Math.floor(Math.random() * words.length)];
      while (
        randomDef2.word === randomWord.word ||
        randomDef2.word === randomDef1.word
      ) {
        randomDef2 = words[Math.floor(Math.random() * words.length)];
      }

      let randomDef3 = words[Math.floor(Math.random() * words.length)];
      while (
        randomDef3.word === randomWord.word ||
        randomDef3.word === randomDef1.word ||
        randomDef3.word === randomDef2.word
      ) {
        randomDef3 = words[Math.floor(Math.random() * words.length)];
      }

      let buttonOrder = [0, 0, 0, 0];
      let spotsLeft = [1, 2, 3, 4];
      let ind;

      buttonOrder[0] = spotsLeft[Math.floor(Math.random() * spotsLeft.length)];
      ind = spotsLeft.indexOf(buttonOrder[0]);
      spotsLeft.splice(ind, 1);

      buttonOrder[1] = spotsLeft[Math.floor(Math.random() * spotsLeft.length)];
      ind = spotsLeft.indexOf(buttonOrder[1]);
      spotsLeft.splice(ind, 1);

      buttonOrder[2] = spotsLeft[Math.floor(Math.random() * spotsLeft.length)];
      ind = spotsLeft.indexOf(buttonOrder[2]);
      spotsLeft.splice(ind, 1);

      buttonOrder[3] = spotsLeft[0];

      let buttonDefs = [];
      for (let elem of buttonOrder) {
        if (elem === 1) {
          buttonDefs.push(randomWord.definition);
        } else if (elem === 2) {
          buttonDefs.push(randomDef1.definition);
        } else if (elem === 3) {
          buttonDefs.push(randomDef2.definition);
        } else {
          buttonDefs.push(randomDef3.definition);
        }
      }

      let correctInd;
      for (let i = 0; i < buttonDefs.length; i++) {
        if (buttonDefs[i] == randomWord.definition) {
          correctInd = i;
          console.log(correctInd)
        }
      }

      req.session.correctIndex = correctInd; //TODO: what if the user has a quiz open in multiple tabs?

      return res.render("quiz/definitionToWord", {
        curWord: randomWord,
        def0: buttonDefs[0],
        def1: buttonDefs[1],
        def2: buttonDefs[2],
        def3: buttonDefs[3],
        correctInd: correctInd,
      });
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }).post(async (req, res) => {

    try {
      //TODO: validate selectedIndex. it must be a number, either 0,1,2,3 and nothing else
      console.log(req.selectedIndex);

     
//TODO: //update accuracy score for user
      if (req.selectedIndex === req.session.correctIndex) {
        return res.status(200).json({ correct: true, correctIndex: req.session.correctIndex });
      } else {
        return res.status(200).json({ correct: false, correctIndex: req.session.correctIndex });

      }
      //reset correct index?



    } catch (e) {
      //reset correct index?
      return res.status(500).json({ error: e });

    }
  });

router.route("/wordToDefinition").get(async (req, res) => {
  try {
    return res.render("quiz/wordToDefinition");
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});
export default router;
