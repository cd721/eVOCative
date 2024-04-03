import { words } from '../../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import wordValidation from './wordValidation.js';
import idValidation from "../../validation/idValidation.js";
import helpers from './helpers.js'

let exportedMethods = {
    async getWordById(id) {
        id = idValidation.validateId(id);
        const wordCollection = await words();
        const word = await wordCollection.findOne({ _id: new ObjectId(id) });
        if (!word) { throw 'Error: word not found' };
        return word;
    },



    async addWord(word, definition, tags, translations) {
        word = wordValidation.validateWord(word);
        definition = wordValidation.validateDefinition(definition);
        tags = wordValidation.validateTags(tags);

        translations = wordValidation.validateTranslations(translations);

        let newWord = helpers.createNewWord(word, definition, tags, translations);

        const wordCollection = await words();

        const newInsertInformation = await wordCollection.insertOne(newWord);

        if (!newInsertInformation.insertedId) { throw 'Insert failed!' };

        return await this.getWordById(newInsertInformation.insertedId.toString());

    },

};
export default exportedMethods;