const exportedMethods = {
  validateName(name) {
    if (!name) throw `Error: Name not provided.`;
    if (typeof name !== "string")
      throw `Error: Name must be of type string`;
      name = name.trim();
    if (name.length === 0)
      throw `Error: Name cannot be empty or just spaces`;
    return name;
  },

  validateEmail(email) {
    if (!email) throw `Error: Email not provided.`;
    if (typeof email !== "string")
      throw `Error: Email must be of type string`;
      email = email.trim();
    if (email.length === 0)
      throw `Error: Email cannot be empty or just spaces`;
    if (email.split("@").length < 2) throw `Error: Email must be a valid email address`;
    return email;
  },
};

export default exportedMethods;
