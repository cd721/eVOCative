import { users, words } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import userValidation from "./userValidation.js";
import idValidation from "../../validation/idValidation.js";
import generalValidation from "../../validation/generalValidation.js";
import wordData from "../words/words.js";
import helpers from "./helpers.js";
import bcrypt from "bcrypt";
import dateHelp from "../../helpers/helpers.js";

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
    password = userValidation.validatePassword(password);

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

    username = username.toLowerCase();

    const userCollection = await users();
    const user = await userCollection.findOne({ username });
    if (!user) throw `An account with this username does not exist!`;

    const valid = await bcrypt.compare(password, user.hashedPassword);
    if (!valid) throw "Password may be wrong, please try again.";

    let role;
    let isAdmin = await this.isAdmin(user._id.toString());
    if (isAdmin) {
      role = "admin";
    } else {
      role = "user";
    }

    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: role
    };
  },

  async addWordForUser(user_id, word_id) {
    user_id = idValidation.validateId(user_id);
    word_id = idValidation.validateId(word_id);

    const today = new Date();

    const userCollection = await users();

    let user = await this.getUserById(user_id);

    const addedDate = today;

    let longestStreak = user.longest_streak;
    let curStreak = user.streak;

    if (user.date_last_word_was_received === null) {
      //If the user never received a word before, set their streak to 1
      curStreak = 1;
    } else if (dateHelp.dateIsToday(user.date_last_word_was_received)) {
      //If they already received their word today, do not change the streak
      curStreak = curStreak;
    } else {
      //If the user did not receive a word yesterday, their streak was broken
      let streakBroken = dateHelp.dateIsNotYesterday(
        user.date_last_word_was_received
      );
      if (streakBroken) {
        //Reset the streak if it was broken
        curStreak = 1;
      } else {
        //Increment the streak if the user did not break it
        curStreak += 1;
      }
    }

    if (curStreak > longestStreak) {
      longestStreak = curStreak;
    }

    let updateInfo = await userCollection.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: { date_last_word_was_received: addedDate },
      }
    );

    if (!updateInfo.acknowledged) {
      throw "Update failed!";
    }

    updateInfo = await userCollection.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: { streak: curStreak },
      }
    );

    if (!updateInfo.acknowledged) {
      throw "Update failed!";
    }

    updateInfo = await userCollection.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: { longest_streak: longestStreak },
      }
    );

    if (!updateInfo.acknowledged) {
      throw "Update failed!";
    }

    updateInfo = await userCollection.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $push: {
          words: {
            _id: new ObjectId(word_id),
            accuracy_score: 0,
            times_played: 0,
            date_user_received_word: today,
          },
        }
      }
    );

    if (!updateInfo.acknowledged) {
      throw "Update failed!";
    }

    return await this.getUserById(user_id);
  },

  async userAlreadyHasWord(user_id, word_id) {
    user_id = idValidation.validateId(user_id);
    word_id = idValidation.validateId(word_id);
    let hasWordAlready;
    //check if new word is already in user's word bank
    try {
      const userCollection = await users();
      const userWithWord = await userCollection.findOne({
        _id: new ObjectId(user_id),
        words: { $elemMatch: { _id: new ObjectId(word_id) } },
      });

      if (userWithWord) {
        hasWordAlready = true;
      } else {
        hasWordAlready = false;
      }
    } catch (e) {
      throw "Internal Server Error";
    }

    return hasWordAlready;
  },

  async addWordOfDay(user_id) {
    user_id = user_id.toString();
    user_id = idValidation.validateId(user_id);

    let newWord;
    let hasWordAlready;

    do {
      //re-reun this function to get a new word
      newWord = await wordData.getWordOfDay();
      hasWordAlready = await this.userAlreadyHasWord(
        user_id,
        newWord._id.toString()
      );
    } while (hasWordAlready);


    await this.addWordForUser(user_id, newWord._id.toString());
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
  async getOverallAccuracyScoreForUser(user_id) {
    user_id = idValidation.validateId(user_id);

    const userCollection = await users();

    const accuracyScoreForUser = await userCollection.findOne(
      { _id: new ObjectId(user_id) },
      { projection: { _id: 0, accuracy_score: 1 } }
    );

    return accuracyScoreForUser.accuracy_score;
  },
  async updateTimesPlayedForUser(user_id) {
    user_id = idValidation.validateId(user_id);

    const userCollection = await users();

    const updateUserInfo = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $inc: {
          times_played: 1,
        },
      },
      { returnDocument: "after" }
    );

    if (!updateUserInfo) {
      throw "Update failed!";
    }

    return updateUserInfo;
  },
  async getTimesPlayedForUser(user_id) {
    user_id = idValidation.validateId(user_id);

    const userCollection = await users();

    const result = await userCollection.findOne(
      { _id: new ObjectId(user_id) },
      { projection: { _id: 0, times_played: 1 } }
    );

    return result.times_played;
  },
  async updateAccuracyScoreForUser(user_id, new_score) {
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

  async isAdmin(user_id) {
    const user = await this.getUserById(user_id);

    return user.is_admin;
  },

  async makeUserAdmin(user_id) {
    user_id = idValidation.validateId(user_id, "User Id");
    const userCollection = await users();
    const updateData = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          is_admin: true,
        },
      },
      { returnDocument: "after" }
    );

    if (!updateData) throw "Update failed!";

    return updateData;
  },

  async getDateLastWordWasReceived(user_id) {
    const user = await this.getUserById(user_id);

    return user.date_last_word_was_received;
  },

  async getDateUserReceivedWord(user_id, word_id) {
    const userCollection = await users();
    const wordsForUser = await this.getWordsForUser(user_id);
    for (let word of wordsForUser) {
      if (word._id.toString() === word_id) {
        return word.date_user_received_word;

      }

    }
    return null; //TODO: handle this better

  },
  async getDateFlaggedForDeletionForUser(user_id, word_id) {
    //TODO: validation here and all function
    const wordsForUser = await this.getWordsForUser(user_id);
    for (let word of wordsForUser) {
      if (word._id.toString() === word_id.toString()) {
        return word.date_flagged_for_deletion;

      }

    }
    return null; //TODO: handle this better

  },

  async wordFlaggedForDeletionForUser(user_id, word_id) {
    //TODO: validation here and all function
    const wordsForUser = await this.getWordsForUser(user_id);
    for (let word of wordsForUser) {
      if (word._id.toString() === word_id) {
        return word.flagged_for_deletion;

      }

    } return null; //TODO: handle this better

  },

  async getWordsForUser(user_id) {
    const user = await this.getUserById(user_id);

    let wordsList = [];
    for (let word of user.words) {
      //TODO:validate
      let word_id = word._id.toString();
      let wordInfo = await wordData.getWordById(word_id);


      wordInfo.date_user_received_word = word.date_user_received_word;
      wordInfo.flagged_for_deletion = word.flagged_for_deletion;
      wordInfo.date_flagged_for_deletion = word.date_flagged_for_deletion;

      //Get rid of the word if it was deleted by user over 24 hr ago
      //Word must have been flagged for deletion
      if (!wordInfo.flagged_for_deletion) {
        wordsList.push(wordInfo);

      } else if (wordInfo.flagged_for_deletion &&
        !helpers.wordWasDeletedLessThan24HoursAgo(wordInfo.date_flagged_for_deletion, wordInfo.flagged_for_deletion)) {
        //The word was not flagged for deletion 
        await this.deleteWordForUser(user_id, word_id);
      }
    }
    return wordsList;
  },
  async flagWordForDeletionForUser(user_id, word_id) {
    const userCollection = await users();
    let wordToRemove = await wordData.getWordById(word_id);
    const updateUserInfo = await userCollection.findOneAndUpdate(
      {
        _id: new ObjectId(user_id), "words._id": new ObjectId(word_id)
      },
      {
        $set: {
          "words.$.flagged_for_deletion": true,
          "words.$.date_flagged_for_deletion": new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!updateUserInfo) {
      throw "Update failed!";
    }

    return updateUserInfo;
  },

  async unflagWordForDeletionForUser(user_id, word_id) {
    //TODO: validation
    const userCollection = await users();
    let wordToRemove = await wordData.getWordById(word_id);
    const updateUserInfo = await userCollection.findOneAndUpdate(
      {
        _id: new ObjectId(user_id), "words._id": new ObjectId(word_id)
      },
      {
        $set: {
          "words.$.flagged_for_deletion": false,
          "words.$.date_flagged_for_deletion": null,
        },
      },
      { returnDocument: "after" }
    );

    if (!updateUserInfo) {
      throw "Update failed!";
    }

    return updateUserInfo;
  },

  async deleteWordForUser(user_id, word_id) {
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

  async resetFailedLoginAttempts(user_id) {
    const userCollection = await users();
    const updateUserInfo = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          failedLoginAttempts: 0,
        },
      },
      { returnDocument: "after" }
    );

    if (!updateUserInfo) {
      throw "Update failed!";
    }

    return updateUserInfo;
  },

  async incrementFailedLoginAttempts(user_id) {
    const userCollection = await users();
    const updateUserInfo = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $inc: {
          failedLoginAttempts: 1,
        },
      },
      { returnDocument: "after" }
    );

    if(!updateUserInfo){
      throw "Update failed!";
    }

    return updateUserInfo;
  }
  
};
export default exportedMethods;
