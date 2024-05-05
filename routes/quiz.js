import { Router } from "express";
import userData from "../data/users/users.js";
import wordData from "../data/words/words.js";

import wordInfo from "../data/words/words.js";
import quizHelpers from "../helpers/quizHelpers.js";
import { ObjectId } from "mongodb";

const router = Router();

router.route("/").get(async (req, res) => {
  try {
    return res.render("quiz/index");
  } catch (e) {
    return res.status(500).render("errorSpecial", { error: e });
  }
});

router.route("/definitionToWord")
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
      do {
        randomWordForUser =
          user.words[Math.floor(Math.random() * user.words.length)];
        console.log(randomWordForUser)

        if (!randomWordForUser) {
          throw "You have no more words to play! Come again another day!";
        }
      } while (randomWordForUser._id.toString() === req.session.previousWordId);

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
  }).post(async (req, res) => {
    //TODO: validate user


    try {
      let user = req.session.user;

      let user_id = req.session.user._id.toString();


      if (req.session.correctIndex !== 0
        && req.session.correctIndex !== 1
        && req.session.correctIndex !== 2
        && req.session.correctIndex !== 3) {
        //If correctIndex is null, the user already answered the question. 
        //This prevents the user from using client side JS to modify the form 
        //and change their original answer.
        console.log("here")
        return res.redirect("/quiz/invalidAnswer");
      }
      //TODO: validate selectedIndex. it must be a number, either 0,1,2,3 and nothing else

      //Increase number of times played for user and word
      const word = await wordInfo.getWordByWord(req.body.wordBeingPlayed);
      await wordInfo.updateTimesPlayed(word._id);
      await userData.updateTimesPlayedForUser(user._id.toString());


      const user_times_played = await userData.getTimesPlayedForUser(user._id.toString());
      const word_times_played = await wordInfo.getTimesPlayed(word._id.toString());



      //reset correct index
      const correctIndexBeforeReset = req.session.correctIndex;
      let userWasCorrect;





      //Update accuracy score for user
      if (req.body.selectedIndex === req.session.correctIndex) {
        userWasCorrect = true;

      } else {
        userWasCorrect = false;

      }




      await quizHelpers.updateAccuracyScores(user._id, word._id, userWasCorrect, user_times_played, word_times_played);

      //Reset correct index last
      req.session.correctIndex = null;


      return res.status(200).json({ correct: userWasCorrect, correctIndex: correctIndexBeforeReset });


    } catch (e) {
      //reset correct index?
      return res.status(500).render("errorSpecial", { error: e });

    }
  });

router.route("/wordToDefinition").get(async (req, res) => {
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
    do {
      randomWordForUser =
        user.words[Math.floor(Math.random() * user.words.length)];
      console.log(randomWordForUser)
      if (!randomWordForUser) {
        throw "You have no more words to play! Come again another day!";
      }
    } while (randomWordForUser._id.toString() === req.session.previousWordId);
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
        buttonDefs.push(randomWord.word);
      } else if (elem === 2) {
        buttonDefs.push(randomDef1.word);
      } else if (elem === 3) {
        buttonDefs.push(randomDef2.word);
      } else {
        buttonDefs.push(randomDef3.word);
      }
    }

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

  } catch (e) {

  }
}).post(async (req, res) => {
  try {

    //TODO: validate user
    let user = req.session.user;
    let user_id = req.session.user._id.toString();
    if (req.session.correctIndex !== 0
      && req.session.correctIndex !== 1
      && req.session.correctIndex !== 2
      && req.session.correctIndex !== 3) {
      //If correctIndex is null, the user already answered the question. 
      //This prevents the user from using client side JS to modify the form 
      //and change their original answer.
      console.log("here")
      return res.redirect("/quiz/invalidAnswer");
    }
    //TODO: validate selectedIndex. it must be a number, either 0,1,2,3 and nothing else

    //Increase number of times played for word and user
    const wordInfo = await wordData.getWordByDefinition(req.body.definitionBeingPlayed);
    await wordData.updateTimesPlayed(wordInfo._id);
    await userData.updateTimesPlayedForUser(user._id.toString());

    const user_times_played = await userData.getTimesPlayedForUser(user._id.toString());
    const word_times_played = await wordData.getTimesPlayed(wordInfo._id.toString());



    const correctIndexBeforeReset = req.session.correctIndex;
    let userWasCorrect;

    ////update accuracy score for user

    if (req.body.selectedIndex === correctIndexBeforeReset) {
      userWasCorrect = true;

    } else {
      userWasCorrect = false;


    }

    await quizHelpers.updateAccuracyScores(user._id, wordInfo._id, userWasCorrect, user_times_played, word_times_played);

    //Do this last
    req.session.correctIndex = null;

    return res.status(200).json({ correct: userWasCorrect, correctIndex: correctIndexBeforeReset });

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
