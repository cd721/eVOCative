import { users } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import userValidation from "./userValidation.js";
import idValidation from "../../validation/idValidation.js";
import generalValidation from "../../validation/generalValidation.js";
import wordData from "../words/words.js";
import helpers from "./helpers.js";

let exportedMethods = {
  async getAllUsers() {
    const postCollection = await users();
    return await postCollection.find({}).toArray();
  },

  async getUserById(id) {
    id = idValidation.validateId(id);
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      throw "Error: User not found";
    }
    return user;
  },

  async addUser(firstName, lastName, email, password) {
    firstName = userValidation.validateName(firstName);
    lastName = userValidation.validateName(lastName);

    email = userValidation.validateEmail(email);

    let hashedPassword = helpers.hashPassword(password);

    let newUser = helpers.createNewUser(
      firstName,
      lastName,
      email,
      hashedPassword
    );

    const userCollection = await users();

    const newInsertInformation = await userCollection.insertOne(newUser);

    if (!newInsertInformation.insertedId) {
      throw "Insert failed!";
    }

    return await this.getUserById(newInsertInformation.insertedId.toString());
  },

  async addWordForUser(user_id, word_id) {
    user_id = idValidation.validateId(user_id);
    word_id = idValidation.validateId(word_id);

    const userCollection = await users();

    const updateInfo = await userCollection.updateOne(
      { _id: new ObjectId(user_id) },
      { $push: { words: { _id: new ObjectId(word_id), accuracy_score: 0 } } }
    );

    if (!updateInfo.acknowledged) {
      throw "Update failed!";
    }

    //TODO: should return?
  },
  async updateOverallAccuracyScoreForUser(user_id, new_score) {
    user_id = idValidation.validateId(user_id);

    new_score = generalValidation.validateAccuracyScore(new_score);
    const userCollection = await users();

    const updateUserInfo = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          accuracy_score: new_score,
        },
      },
      { returnDocument: "after" }
    );

    if (!updateUserInfo) {
      throw "Update failed!";
    }

    return updateUserInfo;
  },
  async updateAccuracyScoreForWordForUser(user_id, word_id, new_score) {
    user_id = idValidation.validateId(user_id);
    word_id = idValidation.validateId(word_id);

    new_score = generalValidation.validateAccuracyScore(new_score);
    const userCollection = await users();

    const updateUserInfo = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(user_id), "words._id": new ObjectId(word_id) },
      {
        $set: {
          "words.$.accuracy_score": new_score,
        },
      },
      { returnDocument: "after" }
    );

    if (!updateUserInfo) {
      throw "Update failed!";
    }

    return updateUserInfo;
  },

  async isAdmin(user_id) {
    const user = await this.getUserById(user_id);

    return user.is_admin;
  },

  async getWordsForUser(user_id) {
    const user = await this.getUserById(user_id);

    let wordsList = [];
    for (let word of user.words) {
      let wordInfo = await wordData.getWordById(word._id.toString());
      wordsList.push(wordInfo);
    }
    return wordsList;
  },

  async removeWordForUser(user_id, word_id) {
    const userCollection = await users();
    let wordToRemove = await wordData.getWordById(word_id);
    const updateUserInfo = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $pull: {
          words: { _id: new ObjectId(word_id) },
        },
      },
      { returnDocument: "after" }
    );

    if (!updateUserInfo) {
      throw "Update failed!";
    }

    return updateUserInfo;
  },
};
export default exportedMethods;
