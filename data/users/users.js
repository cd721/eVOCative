import { users } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import userValidation from "./userValidation.js";
import idValidation from "../../validation/idValidation.js";
import generalValidation from "../../validation/generalValidation.js";
import wordData from "../words/words.js";
import helpers from "./helpers.js";
import bcrypt from 'bcrypt';

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

  async getUserByUsername(username) {
    //TODO: test
    username = userValidation.validateUsername(username);
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (!user) {
      throw "Error: User not found";
    }
    return user;
  },

  async addUser(firstName, lastName, email, username, password) {
    firstName = userValidation.validateName(firstName);
    lastName = userValidation.validateName(lastName);

    username = userValidation.validateUsername(username);
    username = await userValidation.usernameDoesNotAlreadyExist(username);

    email = userValidation.validateEmail(email);
    password = userValidation.validatePassword(password)

    const hashedPassword = await helpers.hashPassword(password);

    let newUser = helpers.createNewUser(
      firstName,
      lastName,
      email,
      hashedPassword,
      username
    );

    const userCollection = await users();
    const newInsertInformation = await userCollection.insertOne(newUser);

    if (!newInsertInformation.insertedId) {
      throw "Insert failed!";
    }

    // return await this.getUserById(newInsertInformation.insertedId.toString());

    return { signupCompleted: true };
  },

  async loginUser(username, password) {
    username = userValidation.validateUsername(username);
    password = userValidation.validatePassword(password);

    const userCollection = await users();
    const user = await userCollection.findOne({ username });
    if (!user) throw `An account with this username does not exist!`;
    
    const valid = await bcrypt.compare(password, user.hashedPassword);
    if (!valid) throw 'Password may be wrong, please try again.';

    let role;
    if (await this.isAdmin(user._id.toString())) {
      role = 'admin';
    } else {
      role = 'user';
    }

    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role
    }
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

  async addPostForUser(user_id, post_id) {
    user_id = idValidation.validateId(user_id);
    post_id = idValidation.validateId(post_id);

    const userCollection = await users();

    const updateInfo = await userCollection.updateOne(
      { _id: new ObjectId(user_id) },
      { $push: { posts: { _id: new ObjectId(post_id) } } }
    );
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
