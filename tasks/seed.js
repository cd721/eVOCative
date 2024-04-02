import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import users from '../data/users/users.js';
import posts from '../data/posts/posts.js';
import words from '../data/words/words.js';
import comments from '../data/comments/comments.js';

const db = await dbConnection();
await db.dropDatabase();

const catherine = await users.addUser("Catherine", "DeMario", "cdemario@stevens.edu", "password");

const firstPost = await posts.addPost("My first post", "This is my post", ["mine", "cool"]);

const firstWord = await words.addWord("coffee", "a beverage made by brewing coffee beans", ["drinks", "yummy"], {
    "french": "café", "italian": "caffè",
    "spanish": "café"
});

const commentOnMyPost = await comments.addComment(firstPost._id.toString(), catherine._id.toString(), "I like it");

await users.addWordForUser(catherine._id.toString(), firstWord._id.toString());
await users.updateAccuracyScoreForWordForUser(catherine._id.toString(), firstWord._id.toString(), 1);

console.log('Done seeding database');

await closeConnection();
