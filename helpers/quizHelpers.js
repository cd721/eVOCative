
import userData from "../data/users/users.js";
import wordData from "../data/words/words.js";
//TODO: I couldn't refactor easily, so I'm not doing it right now
const exportedMethods = {
    async updateAccuracyScores(user_id, word_id, user_was_correct, user_times_played, word_times_played) {
        //TODO: validation and err checking?
        const existingScoreForUser = await userData.getOverallAccuracyScoreForUser(user_id);
        const existingScoreForWord = await wordData.getAccuracyScore(word_id.toString());


        const number_correct_for_user = existingScoreForUser * user_times_played;
        const number_correct_for_word = existingScoreForWord * word_times_played;



        let new_user_score;
        let new_word_score;
        if (user_was_correct) {
            new_user_score = (number_correct_for_user + 1) / (user_times_played);
            new_word_score = (number_correct_for_word + 1) / (word_times_played);
        } else {
            new_user_score = (number_correct_for_user) / (user_times_played);
            new_word_score = (number_correct_for_word) / (word_times_played);

        }
        console.log(new_user_score);
        console.log(new_word_score)
        await userData.updateAccuracyScoreForUser(user_id, new_user_score);

        await wordData.updateAccuracyScore(word_id, new_word_score);


    },

    getRandomWordForUser(user, previousWordId) {
        let randomWordForUser;
        //If the user only has one word
        if (user.words.length === 1) {
            const usersOnlyWordId = user.words[0]._id.toString();

            //If the user had already played the game
            if (previousWordId === usersOnlyWordId) {
                return "oneWord";
            }
        }


        //If the user has more than one word
        do {
            randomWordForUser =
                user.words[Math.floor(Math.random() * user.words.length)];
            console.log(randomWordForUser)

            if (!randomWordForUser) {
                return "noWords";
            }
        } while (randomWordForUser._id.toString() === previousWordId);

        return randomWordForUser;
    },


     setUpDefinitionToWordGame(words,randomWord) {

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
        return buttonDefs;

    },
    setUpWordToDefinitionGame(words,randomWord){
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
        return buttonDefs;
    }
};
export default exportedMethods;