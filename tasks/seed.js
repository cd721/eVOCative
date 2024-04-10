import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import users from '../data/users/users.js';
import posts from '../data/posts/posts.js';
import words from '../data/words/words.js';
import comments from '../data/comments/comments.js';

import tickets from '../data/tickets/tickets.js';

const db = await dbConnection();
await db.dropDatabase();

const catherine = await users.addUser("Catherine", "DeMario", "cdemario@stevens.edu", "password");

const firstPost = await posts.addPost(catherine._id.toString(), "My first post", "This is my post", ["mine", "cool"]);

let firstWord = await words.addWord("coffee", "a beverage made by brewing coffee beans", ["drinks", "yummy"], []);
await users.removeWordForUser(catherine._id.toString(),firstWord._id.toString());
firstWord = await words.addWord("coffee", "a beverage made by brewing coffee beans", ["drinks", "yummy"], []);


const commentOnMyPost = await comments.addComment(firstPost._id.toString(), catherine._id.toString(), "I like it");

await users.addWordForUser(catherine._id.toString(), firstWord._id.toString());
await users.updateAccuracyScoreForWordForUser(catherine._id.toString(), firstWord._id.toString(), 1);


const firstTicket = await tickets.addTicket(catherine._id.toString(), "new vocab", "Please add tea to the word list");



console.log('Done seeding database');

await closeConnection();
