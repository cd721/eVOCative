const exportedMethods = {
  validateWord(word) {
    if (!word) throw `Error: Word not provided.`;
    if (typeof word !== "string") throw `Error: Word must be of type string`;
    word = word.trim();
    word = word.toLowerCase();
    if (word.length === 0) throw `Error: Word cannot be empty or just spaces`;
    if (word.length > 50) throw `Error: Word cannot be more than 50 characters.`;
    return word;
  },

  validateDefinition(title) {
    if (!title) throw `Error: Title not provided.`;
    if (typeof title !== "string") throw `Error: Title must be of type string`;
    title = title.trim();
    title = title.toLowerCase();
    if (title.length === 0) throw `Error: Title cannot be empty or just spaces`;
    if (title.length > 250) throw `Error: Definition cannot be more than 250 characters.`;
    return title;
  },

  validateTags(tags) {
    if (!tags) throw `Error: Tags not provided.`;
    if (!Array.isArray(tags)) throw `Error: Tags must be an array`;
    if (tags.length === 0) throw `Error: Tags cannot be empty`;
    for (let str of tags) {
      if (typeof str !== "string")
        throw `Error: All elements of tags must be strings`;
      str = str.trim();
      if (str.length === 0)
        throw `Error: Elements in tags cannot be empty or just spaces`;
      if (str.length > 20) throw `Error: Elements in tags cannot be more than 20 characters.`;
    }
    return tags;
  },

  validateTranslations(translations) {
    if (!translations) throw `Error: Translations not provided.`;
    if (!Array.isArray(translations))
      throw `Error: Translations must be an array`;
    if (translations.length === 0) return translations;
    for (let str of translations) {
      if (typeof str !== "string")
        throw `Error: All elements of translations must be strings`;
      str = str.trim();
      if (str.length === 0)
        throw `Error: Elements in translations cannot be empty or just spaces`;
    }
    return translations;
  },
};

export default exportedMethods;
