import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import validation from "./userValidation.js";

let exportedMethods = {
  createNewUser(firstName, lastName, email, hashedPassword, username) {
    firstName = validation.validateName(firstName);
    lastName = validation.validateName(lastName);

    email = validation.validateEmail(email);
    email = validation.emailDoesNotAlreadyExist(email);

    username = validation.validateUsername(username);
    username = validation.usernameDoesNotAlreadyExist(username);

    let newUser = {
      _id: new ObjectId(),

      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      hashedPassword: hashedPassword,

      start_date: new Date(),
      streak: 0,
      longest_streak: 0,
      is_admin: false,
      date_last_word_was_received: null,
      posts: [],
      words: [],
      accuracy_score: 0,
      selected_language: "French",
      times_played: 0, //times the user played any quiz games
    };

    return newUser;
  },

  async hashPassword(password) {
    password = validation.validatePassword(password);

    const plaintextPassword = password;
    const saltRounds = 1;
    const hashedPassword = await bcrypt.hash(plaintextPassword, saltRounds);

    return hashedPassword;
  },

  wordWasDeletedLessThan24HoursAgo(
    date_flagged_for_deletion,
    flagged_for_deletion
  ) {
    date_flagged_for_deletion = validation.validateDate(
      date_flagged_for_deletion
    );
    flagged_for_deletion = validation.validateBool(flagged_for_deletion);

    if (flagged_for_deletion) {
      let today = new Date().getTime() + 1 * 24 * 60 * 60 * 1000;
      return date_flagged_for_deletion < today;
    } else {
      return false;
    }
  },
};

export default exportedMethods;
