
import userData from "../data/users/users.js";
import wordData from "../data/words/words.js";
//TODO: I couldn't refactor easily, so I'm not doing it right now
const exportedMethods = {
    async updateAccuracyScores(user_id, word_id, user_was_correct, user_times_played, word_times_played) {
        //TODO: validation and err checking?
        const existingScoreForUser = await userData.getOverallAccuracyScoreForUser(user_id);
        const existingScoreForWord = await wordData.getAccuracyScore(word_id);


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
    async setUpDefinitionToWordGame(randomWordForUser) {



    },
    async setUpWordToDefinitionGame(randomWordForUser) {



    }
};
export default exportedMethods;