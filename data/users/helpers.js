let exportedMethods = {

    createNewUser(firstName, lastName, email, hashedPassword) {
        let newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            hashedPassword: hashedPassword,

            start_date: new Date(),
            is_admin: false,
            received_todays_word: false,
            posts: [],
            words: [],
            accuracy_score: 0,
            selected_language: "French"
        };

        return newUser;
    },
    hashPassword(password){
        //TODO: implement
        return password;
    }
};

export default exportedMethods;