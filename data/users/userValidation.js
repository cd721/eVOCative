import gen from "../../validation/generalValidation.js";
import { users } from "../../config/mongoCollections.js";
import emailValidator from "email-validator";

const exportedMethods = {
  validateName(name) {
    name = gen.validateGen("Name", name);
    // does it have a number
    if (/\d/.test(name))
      throw `${name || "given string"} cannot contain a number`;
    return name;
  },
  validateUsername(username) {
    if (username == undefined) { throw "You must provide a username"; }

    //username is valid string
    if (typeof username !== 'string') {
      throw "username must be a string"
    }
    //no spaces
    if (username.trim() === '') {
      throw "You must provide text for the username"
    }

    //trim the user name
    username = username.trim();

    //5. case insensitive tolower
    let usernameLower = username.toLowerCase();

    // no numbers
    for (let i = 0; i < usernameLower.length; i++) {
      if (!isNaN(parseInt(usernameLower.charAt(i)))) {
        throw "username must not contain numbers"
      }
    }
    //at least 5 chars
    if (usernameLower.length < 5) {
      throw "username must be more than 5 chars"
    }
    //no more than 10
    if (usernameLower.length > 10) {
      throw "username cannot be more than 10 chars"
    }

    return username;
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
