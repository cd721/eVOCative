import { ObjectId } from "mongodb";
import validation from "./wordValidation.js";

let exportedMethods = {
  createNewWord(word, definition, tags) {
    word = validation.validateWord(word);
    definition = validation.validateDefinition(definition);
    tags = validation.validateTags(tags);

    let today = new Date();

    let newWord = {
      _id: new ObjectId(),

      word: word,
      definition: definition,
      tags: tags,

      total_holders: 0,
      accuracy_score: 0,

      dateAdded: today,

      times_played: 0,
    };

    return newWord;
  },
};

export default exportedMethods;
