const exportedMethods = {
  validateWord(word) {
    if (!word) throw `Error: Word not provided.`;
    if (typeof word !== "string") throw `Error: Word must be of type string`;
    word = word.trim();
    word = word.toLowerCase();
    if (word.length === 0) throw `Error: Word cannot be empty or just spaces`;
    return word;
  },

  validateDefinition(definition) {
    if (!definition) throw `Error: Definition not provided.`;
    if (typeof definition !== "string") throw `Error: Definition must be of type string`;
    definition = definition.trim();
    definition = definition.toLowerCase();
    if (definition.length === 0) throw `Error: Definition cannot be empty or just spaces`;
    if (definition.length > 250) throw `Error: Definition cannot be more than 250 characters.`;
    return definition;
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
