import { words } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import wordValidation from "./wordValidation.js";
import idValidation from "../../validation/idValidation.js";
import helpers from "./helpers.js";
import scoreValidation from "../../validation/generalValidation.js";
import userData from "../users/users.js";

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

  async getWordByDefinition(definition) {
    definition = wordValidation.validateDefinition(definition);

    const wordCollection = await words();
    definition = definition.trim();
    const existingWord = await wordCollection.findOne({
      definition: definition,
    });
    return existingWord;
  },

  async addWord(word, definition, tags, translations) {
    word = wordValidation.validateWord(word);
    definition = wordValidation.validateDefinition(definition);
    tags = wordValidation.validateTags(tags);

    translations = wordValidation.validateTranslations(translations);

    const existingWord = await this.getWordByWord(word);
    if (existingWord) {
      throw "Word already exists in the database";
    }

    let newWord = helpers.createNewWord(word, definition, tags, translations);

    const wordCollection = await words();

    const newInsertInformation = await wordCollection.insertOne(newWord);

    if (!newInsertInformation.insertedId) {
      throw "Insert failed!";
    }

    return await this.getWordById(newInsertInformation.insertedId.toString());
  },

  async updateWord(word_id, word, definition, tags, translations) {
    word_id = idValidation.validateId(word_id);
    word = wordValidation.validateWord(word);
    definition = wordValidation.validateDefinition(definition);
    tags = wordValidation.validateTags(tags);

    translations = wordValidation.validateTranslations(translations);

    const existingWord = await this.getWordByWord(word);
    if (!existingWord) {
      throw "Word does not exist, please create it";
    }

    const wordCollection = await words();

    const updateInformation = await wordCollection.findOneAndUpdate(
      { _id: new ObjectId(word_id) },
      {
        $set: {
          word: word,
          definition: definition,
          tags: tags,
          translations: translations,
        },
      },
      { returnDocument: "after" }
    );

    if (!updateInformation) {
      throw "Update failed!";
    }

    return updateInformation;
  },

  async removeWord(word_id) {
    word_id = idValidation.validateId(word_id);

    const existingWord = await this.getWordById(word_id);
    if (!existingWord) {
      throw "Word does not exist, cannot remove";
    }

    const wordCollection = await words();
    const usersWithWordList = await userData.getUsersWithWord(word_id);

    for (let user of usersWithWordList) {
      await userData.deleteWordForUser(user._id.toString(), word_id);
    }

    const removeInformation = await wordCollection.deleteOne({
      _id: new ObjectId(word_id),
    });

    if (!removeInformation) {
      throw "Remove failed!";
    }

    return { removeSuccessful: true };
  },

  async updateTimesPlayed(word_id) {
    word_id = idValidation.validateId(word_id);

    const wordCollection = await words();
    const updateInfo = await wordCollection.findOneAndUpdate(
      { _id: new ObjectId(word_id) },
      {
        $inc: {
          times_played: 1,
        },
      },
      { returnDocument: "after" }
    );

    if (!updateInfo) {
      throw "Update failed!";
    }

    return updateInfo;
  },

  async updateAccuracyScore(word_id, new_score) {
    word_id = idValidation.validateId(word_id);
    new_score = scoreValidation.validateAccuracyScore(new_score);

    const wordCollection = await words();

    const updateInfo = await wordCollection.findOneAndUpdate(
      { _id: new ObjectId(word_id) },
      {
        $set: {
          accuracy_score: new_score,
        },
      },
      { returnDocument: "after" }
    );

    if (!updateInfo) {
      throw "Update failed!";
    }

    return updateInfo;
  },
  async getTimesPlayed(word_id) {
    word_id = idValidation.validateId(word_id);

    const wordCollection = await words();

    const result = await wordCollection.findOne(
      { _id: new ObjectId(word_id) },

      { projection: { _id: 0, times_played: 1 } }
    );

    return result.times_played;
  },

  async getAccuracyScore(word_id) {
    word_id = idValidation.validateId(word_id);

    const wordCollection = await words();

    const result = await wordCollection.findOne(
      { _id: new ObjectId(word_id) },

      { projection: { _id: 0, accuracy_score: 1 } }
    );

    return result.accuracy_score;
  },

  async getWordOfDay() {
    const wordCollection = await words();
    const word = await wordCollection
      .aggregate([{ $sample: { size: 1 } }])
      .toArray();

    return word[0];
  },

  async getNumberOfWordsInDB() {
    const wordCollection = await words();
    const test = await wordCollection.countDocuments();
    const numWords = await wordCollection.count();
    return numWords;
  },
};
export default exportedMethods;
