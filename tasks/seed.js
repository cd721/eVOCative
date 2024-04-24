import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import users from '../data/users/users.js';
import posts from '../data/posts/posts.js';
import words from '../data/words/words.js';
import comments from '../data/comments/comments.js';

import tickets from '../data/tickets/tickets.js';

const db = await dbConnection();
await db.dropDatabase();

await users.addUser("Catherine", "DeMario", "cdemario@stevens.edu", "cdemario","password");
const catherine = await users.getUserByUsername("cdemario");
console.log(catherine);

const firstPost = await posts.addPost(catherine._id.toString(), "My first post", "This is my post", ["mine", "cool"]);
await users.addPostForUser(catherine._id.toString(), firstPost._id.toString());

const firstWord = await words.addWord("coffee", "a beverage made by brewing coffee beans", ["drinks", "yummy"], []);
const secondWord = await words.addWord("water", "a drink that keeps you alive", ["drinks", "necessary"], []);
const thirdWord = await words.addWord("juice", "a drink with way too much sugar", ["drinks", "unnecessary"], []);
const fourthWord = await words.addWord("milk", "a drink from cows", ["drinks", "animal products"], []);


// checking if it catches words already existing
try {
    firstWord = await words.addWord("coffee", "a beverage made by brewing coffee beans", ["drinks", "yummy"], []);
} catch (e) {
    console.log(e);
}

const commentOnMyPost = await comments.addComment(firstPost._id.toString(), catherine._id.toString(), "I like it");

await users.addWordForUser(catherine._id.toString(), firstWord._id.toString());
await users.addWordForUser(catherine._id.toString(), secondWord._id.toString());
await users.addWordForUser(catherine._id.toString(), thirdWord._id.toString());
await users.addWordForUser(catherine._id.toString(), thirdWord._id.toString());

await users.updateAccuracyScoreForWordForUser(catherine._id.toString(), firstWord._id.toString(), 1);
await users.updateAccuracyScoreForWordForUser(catherine._id.toString(), secondWord._id.toString(), 1);


const firstTicket = await tickets.addTicket(catherine._id.toString(), "new vocab", "Please add tea to the word list");



console.log('Done seeding database');

await closeConnection();
