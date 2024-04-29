import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt'
import helpers from '../../helpers/helpers.js'
let exportedMethods = {

    createNewUser(firstName, lastName, email, hashedPassword, username) {
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
            selected_language: "French"
        };

        return newUser;
    },
    async hashPassword(password) {
        const plaintextPassword = password;
        const saltRounds = 1;
        const hashedPassword = await bcrypt.hash(plaintextPassword, saltRounds);
      
        return hashedPassword;
    }
};

export default exportedMethods;