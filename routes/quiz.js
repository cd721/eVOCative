import { Router } from "express";
import userData from "../data/users/users.js";
import wordData from "../data/words/words.js";
import { ObjectId } from 'mongodb';

const router = Router();

router.route("/").get(async (req, res) => {
  try {
    return res.render("quiz/index");
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.route("/definitionToWord").get(async (req, res) => {
  try {
    const user_id = "6616b43f72affc233d7ee984"; // This will be grabbed from the session id!
    const user = await userData.getUserById((user_id));
    const randomWord =
      user.words[Math.floor(Math.random() * user.words.length)];

    if (!randomWord) {
      throw "The user has no words";
    }

    const words = await wordData.getAllWords();
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
    spotsLeft = spotsLeft.splice(ind, 1);

    buttonOrder[1] = spotsLeft[Math.floor(Math.random() * spotsLeft.length)];
    ind = spotsLeft.indexOf(buttonOrder[1]);
    spotsLeft = spotsLeft.splice(ind, 1);

    buttonOrder[2] = spotsLeft[Math.floor(Math.random() * spotsLeft.length)];
    ind = spotsLeft.indexOf(buttonOrder[2]);
    spotsLeft = spotsLeft.splice(ind, 1);

    buttonOrder[3] = spotsLeft[0];

    let buttonDefs = [];
    for (let elem of buttonOrder) {
      if (elem === 1) {
        buttonDefs.append(randomWord.definition);
      } else if (elem === 2) {
        buttonDefs.append(randomDef1.definition);
      } else if (elem === 3) {
        buttonDefs.append(randomDef2.definition);
      } else {
        buttonDefs.append(randomDef3.definition);
      }
    }

    let correctInd = buttonOrder.indexOf(1);

    return res.render(
      "quiz/definitionToWord",
      { curWord: randomWord },
      { def1: buttonDefs[0] },
      { def2: buttonDefs[1] },
      { def3: buttonDefs[2] },
      { def4: buttonDefs[3] },
      { correctInd: correctInd }
    );
  } catch (e) {
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
