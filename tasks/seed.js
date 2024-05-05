import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import users from '../data/users/users.js';
import posts from '../data/posts/posts.js';
import words from '../data/words/words.js';
import comments from '../data/comments/comments.js';

import tickets from '../data/tickets/tickets.js';

const db = await dbConnection();
await db.dropDatabase();

await users.addUser("Catherine", "DeMario", "cdemario@stevens.edu", "cdemario", "Password123#");
const catherine = await users.getUserByUsername("cdemario");
console.log(catherine);

await users.addUser("Josie", "Cerino", "jcerino@stevens.edu", "jcerino", "Pwrd123#");
const josie = await users.getUserByUsername("jcerino");
console.log(josie);

const firstPost = await posts.addPost(catherine._id.toString(), "My first post", "This is my post", ["mine", "cool"]);
await users.addPostForUser(catherine._id.toString(), firstPost._id.toString());
const anotherPost = await posts.addPost(josie._id.toString(), "I'm making a word post!", "Wow this app is really awesome! I like words!", ["josie", "happy"]);
await users.addPostForUser(josie._id.toString(), anotherPost._id.toString());

const firstWord = await words.addWord("coffee", "a beverage made by brewing coffee beans", ["drinks", "yummy"], []);
const secondWord = await words.addWord("water", "a drink that keeps you alive", ["drinks", "necessary"], []);
const thirdWord = await words.addWord("juice", "a drink with way too much sugar", ["drinks", "unnecessary"], []);
const fourthWord = await words.addWord("milk", "a drink from cows", ["drinks", "animal products"], []);
const fifthhWord = await words.addWord("coke", "a soda", ["sugar", "beverage"], []);



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
await users.addWordForUser(catherine._id.toString(), fourthWord._id.toString());

await users.updateAccuracyScoreForUser(catherine._id.toString(),  1);

const accuracyScoreForCatherine = await users.getOverallAccuracyScoreForUser(catherine._id.toString());
console.log(accuracyScoreForCatherine);

//Update times played and accuracy
await users.updateTimesPlayedForUser(catherine._id.toString());
await words.updateTimesPlayed(firstWord._id.toString());

const timesCatherinePlayed = await users.getTimesPlayedForUser(catherine._id.toString());
const timesFirstWordWasPlayed = await words.getTimesPlayed(firstWord._id.toString());
await users.updateAccuracyScoreForUser(catherine._id.toString(),.5);
await words.updateAccuracyScore(firstWord._id.toString(), .5);

//Print times a word was played for a user and in general
console.log(timesCatherinePlayed);
console.log(timesFirstWordWasPlayed);

//Print the accuracy scores
console.log(await users.getOverallAccuracyScoreForUser(catherine._id.toString()));
console.log(await words.getAccuracyScore(firstWord._id.toString()));



const firstTicket = await tickets.addTicket(catherine._id.toString(), "new vocab", "Please add tea to the word list");


await users.makeUserAdmin(josie._id.toString());


console.log('Done seeding database');

await closeConnection();
