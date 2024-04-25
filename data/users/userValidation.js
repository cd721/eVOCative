import gen from "../../validation/generalValidation.js";
import { users } from "../../config/mongoCollections.js";
import emailValidator from "email-validator";

const exportedMethods = {
  validateUsername(username) {
    // Changed validation to separate username from name.
    username = gen.validateGen("Name", username);
    return username;
  },
  validateName(name) {
    name = gen.validateGen("Name", name);
    // does it have a number
    if (/\d/.test(name))
      throw `${name || "given string"} cannot contain a number`;
    return name;
  },

  validateEmail(email) {
    email = gen.validateGen("Email", email);
    if (!emailValidator.validate(email)) {
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

  async emailDoesNotAlreadyExist(email) {
    //TODO: ensure emails are unique
    let userCollection = await users();
    let duplicateUser = await userCollection.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });
    if (duplicateUser)
      throw `user already exists with the email ${email}`;

    return email;
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
