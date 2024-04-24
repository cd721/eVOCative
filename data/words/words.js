import { words } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import wordValidation from "./wordValidation.js";
import idValidation from "../../validation/idValidation.js";
import helpers from "./helpers.js";

let exportedMethods = {
  async getAllWords() {
    const wordCollection = await words();
    return await wordCollection.find({}).toArray();
  },

  async getWordById(id) {
    id = idValidation.validateId(id);
    const wordCollection = await words();
    const word = await wordCollection.findOne({ _id: new ObjectId(id) });
    if (!word) {
      throw "Error: word not found";
    }
    return word;
  },

  async getWordByWord(word) {
    word = wordValidation.validateWord(word);
    const wordCollection = await words();

    const existingWord = await wordCollection.findOne({ word: word });
    return existingWord;
  },

  async addWord(word, definition, tags, translations) {
    word = wordValidation.validateWord(word);
    definition = wordValidation.validateDefinition(definition);
    tags = wordValidation.validateTags(tags);

    translations = wordValidation.validateTranslations(translations);

    const existingWord = await this.getWordByWord(word);
    if (existingWord) {
      throw 'Word already exists in the database';
    }

    let newWord = helpers.createNewWord(word, definition, tags, translations);

    const wordCollection = await words();

    const newInsertInformation = await wordCollection.insertOne(newWord);

    if (!newInsertInformation.insertedId) {
      throw "Insert failed!";
    }

    return await this.getWordById(newInsertInformation.insertedId.toString());
  },

  async getWordOfDay() {
    const wordCollection = await words();
    const word = await wordCollection.aggregate([{ $sample: { size: 1 } }]).toArray();

    return word[0];
  }
};
export default exportedMethods;
