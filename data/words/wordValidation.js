const exportedMethods = {
  validateWord(word) {
    if (!word) throw `Error: Word not provided.`;
    if (typeof word !== "string") throw `Error: Word must be of type string`;
    word = word.trim();
    if (word.length === 0)
      throw `Error: Word cannot be empty or just spaces`;
    if (word.split(" ").length > 1) throw `Error: Word must be a single word with no spaces`;
    return word;
  },
  validateDefinition(title) {
    if (!title) throw `Error: Title not provided.`;
    if (typeof title !== "string") throw `Error: Title must be of type string`;
    title = title.trim();
    if (title.length === 0)
      throw `Error: Title cannot be empty or just spaces`;
    return title;
  },
  validateTags(tags) {
    if (!tags) throw `Error: Tags not provided.`;
    if (!Array.isArray(tags)) throw `Error: Tags must be an array`;
    if (tags.length === 0) throw `Error: Tags cannot be empty`;
    for (str of tags) {
      if (typeof str !== "string") throw `Error: All elements of tags must be strings`;
      str = str.trim();
      if (str.length === 0) throw `Error: Elements in tags cannot be empty or just spaces`;
    }
    return tags;
  },
  validateTranslations(translations) {
    if (!translations) throw `Error: Translations not provided.`;
    if (!Array.isArray(translations)) throw `Error: Translations must be an array`;
    if (translations.length === 0) return translations;
    for (str of translations) {
      if (typeof str !== "string") throw `Error: All elements of translations must be strings`;
      str = str.trim();
      if (str.length === 0) throw `Error: Elements in translations cannot be empty or just spaces`;
    }
    return translations;
  },
};

export default exportedMethods;
