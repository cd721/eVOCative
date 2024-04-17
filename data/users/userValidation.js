import gen from "../../validation/generalValidation.js";
import { users } from "../../config/mongoCollections.js";

const exportedMethods = {
  validateName(name) {
    name = gen.validateGen("Name", name);
    return name;
  },

  validateEmail(email) {
    email = gen.validateGen("Email", email);
    if (email.split("@").length < 2) {
      throw `Error: Email must be a valid email address`;
    }
    return email;
  },

  async usernameDoesNotAlreadyExist(username) {
    //TODO: ensure usernames are unique
    let userCollection = await users();
    let duplicateUser = await userCollection.findOne({
      username: { $regex: new RegExp(`^${username}$`, "i") },
    });
    if (duplicateUser)
      throw `user already exists with the username ${username}`;

    return username;
  },

  validateUsername(username) {
    //TODO: ensure usernames are valid
    username = gen.validateGen("Username", username);
    return username;
  },

  validatePassword(password) {
    password = gen.validateGen("Password", password);
    return password;
  },
};

export default exportedMethods;
