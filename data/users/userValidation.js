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
    if (username == undefined) {
      throw "You must provide a username";
    }

    //username is valid string
    if (typeof username !== "string") {
      throw "username must be a string";
    }
    //no spaces
    if (username.trim() === "") {
      throw "You must provide text for the username";
    }

    //trim the user name
    username = username.trim();

    //5. case insensitive tolower
    let usernameLower = username.toLowerCase();

    // no numbers
    for (let i = 0; i < usernameLower.length; i++) {
      if (!isNaN(parseInt(usernameLower.charAt(i)))) {
        throw "username must not contain numbers";
      }
    }
    //at least 5 chars
    if (usernameLower.length < 5) {
      throw "username must be more than 5 chars";
    }
    //no more than 10
    if (usernameLower.length > 10) {
      throw "username cannot be more than 10 chars";
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
    if (duplicateUser) throw `user already exists with the email ${email}`;

    return email;
  },

  validatePassword(password) {
    if (password == undefined) {
      throw "provide a pwd";
    }
    if (typeof password !== "string") {
      throw "password must be a string";
    }
    //no just spaces, no spaces
    if (password.trim() === "") {
      throw "You must provide text for the password";
    }

    //trim
    password = password.trim();
    if (password.includes(" ")) {
      throw "No spaces allowed in password";
    }

    //min 8 chars
    if (password.length < 8) {
      throw "password must be at least eight characters";
    }

    const oneUpperCase = /[A-Z]+/;
    const oneSpecial = /[^A-Za-z0-9]+/;
    const oneNumber = /[0-9]+/;

    if (
      !password.match(oneNumber) ||
      !password.match(oneSpecial) ||
      !password.match(oneUpperCase)
    ) {
      throw "You need a special character, a number, and an uppercase character in your pwd";
    }
    return password;
  },
  
  validateDate(date) {
    if (!(date instanceof Date)) throw `Error: value must be a date.`;
    return date;
  },

  validateBool(bool) {
    if (typeof bool !== "boolean") throw `Error: value must be a boolean.`;
    return bool;
  },
};

export default exportedMethods;
