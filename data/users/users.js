import { users } from '../../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import userValidation from '../../validation/userValidation.js';
import idValidation from "../../validation/idValidation.js";
import helpers from './helpers.js'

let exportedMethods = {
    async getUserById(id) {
        id = idValidation.checkId(id);
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: new ObjectId(id) });
        if (!user) { throw 'Error: User not found' };
        return user;
    },



    async addUser(firstName, lastName, email, password) {
        firstName = userValidation.checkString(firstName);
        lastName = userValidation.checkString(lastName);

        email = userValidation.checkValidEmail(email);

       let hashedPassword = helpers.hashPassword(password);

        let newUser = helpers.createNewUser(firstName, lastName, email, hashedPassword);

        const userCollection = await users();

        const newInsertInformation = await userCollection.insertOne(newUser);

        if (!newInsertInformation.insertedId) { throw 'Insert failed!' };

        return await this.getUserById(newInsertInformation.insertedId.toString());

    },

};
export default exportedMethods;