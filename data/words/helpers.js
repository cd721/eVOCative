import { ObjectId } from "mongodb";

let exportedMethods = {
  createNewWord(word, definition, tags) {
    let today = new Date();

    let newWord = {
      _id: new ObjectId(),

      word: word,
      definition: definition,
      tags: tags,

      total_holders: 0,
      accuracy_score: 0,

      dateAdded: today,
    };

    return newWord;
  },
};

export default exportedMethods;
