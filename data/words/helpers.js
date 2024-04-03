import { ObjectId } from 'mongodb';

let exportedMethods = {

    createNewWord(word, definition, tags) {
        let newWord = {
            _id: new ObjectId(),

            word: word,
            definition: definition,
            tags: tags,

            total_holders: 0,
            accuracy_score: 0,
        };

        return newWord;
    },

};

export default exportedMethods;