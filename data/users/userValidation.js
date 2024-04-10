import gen from '../../validation/generalValidation.js';

const exportedMethods = {

  validateName(name) {
    name = gen.validateGen('Name', name);
    return name;
  },

  validateEmail(email) {
    email = gen.validateGen('Email', email);
    if (email.split("@").length < 2) { throw `Error: Email must be a valid email address` };
    return email;
  },

  validatePassword(password) {
    password = gen.validateGen('Password', password);
    return password;
  }
};

export default exportedMethods;
