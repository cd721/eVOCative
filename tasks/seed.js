import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import users from '../data/users/users.js';
import posts from '../data/posts/posts.js';
import words from '../data/words/words.js';
import comments from '../data/comments/comments.js';

import tickets from '../data/tickets/tickets.js';

const db = await dbConnection();
await db.dropDatabase();

await users.addUser("Catherine", "DeMario", "cdemario@stevens.edu", "cdemario", "password");
const catherine = await users.getUserByUsername("cdemario");
console.log(catherine);

await users.addUser("Josie", "Cerino", "jcerino@stevens.edu", "jcerino", "pwrd123");
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
const sixthWord = await words.addWord("tea", "a drink made from leaves", ["drinks", "yummy"],[]);

const seventhWord = await words.addWord("Aberration", "a departure from what is normal, usual, or expected, typically one that is unwelcome", ["unusual"],[]);
const eighthWord = await words.addWord("Capacious", "having a lot of space inside; roomy", ["spacious"],[]);
const ninthWord = await words.addWord("Dearth", "a scarcity or lack of something", ["lack", "empty"],[]);
const tenthWord = await words.addWord("Ebullient", "cheerful and full of energy", ["happy", "energetic"],[]);
const eleventhWord = await words.addWord("Facetious", "treating serious issues with deliberately inappropriate humor; flippant", ["humor", "joking"],[]);
const twelfthWord = await words.addWord("Garrulous", "excessively talkative, especially on trivial matters", ["talkative", "chatty"],[]);
const thirteenthWord = await words.addWord("Hapless", "unfortunate", ["unlucky", "unfortunate"],[]);
const fourteenthWord = await words.addWord("Idiosyncrasy", "a mode of behavior or way of thought peculiar to an individual", ["unique", "individual"],[]);
const fifteenthWord = await words.addWord("Juxtaposition", "the fact of two things being seen or placed close together with contrasting effect", ["contrast", "comparison"],[]);
const sixteenthWord = await words.addWord("Kaleidoscope", "a constantly changing pattern or sequence of elements", ["pattern", "changing"],[]);
const seventeenthWord = await words.addWord("Lackadaisical", "lacking enthusiasm and determination; carelessly lazy", ["lazy", "unmotivated"],[]);
const eighteenthWord = await words.addWord("Mellifluous", "(of a voice or words) sweet or musical; pleasant to hear", ["musical", "pleasant"],[]);
const nineteenthWord = await words.addWord("Nefarious", "wicked, villainous, despicable", ["evil", "wicked"],[]);
const twentiethWord = await words.addWord("Obfuscate", "to deliberately make something difficult to understand", ["confuse", "complicate"],[]);
const twentyfirstWord = await words.addWord("Pernicious", "having a harmful effect, especially in a gradual or subtle way", ["harmful", "dangerous"],[]);
const twentysecondWord = await words.addWord("Quintessential", "representing the most perfect or typical example of a quality or class", ["perfect", "typical"],[]);
const twentythirdWord = await words.addWord("Rambunctious", "uncontrollably exuberant; boisterous", ["energetic", "uncontrollable"],[]);
const twentyfourthWord = await words.addWord("Sycophant", "a person who acts obsequiously towards someone important in order to gain advantage", ["flatterer", "follower"],[]);
const twentyfifthWord = await words.addWord("Trepidation", "a feeling of fear or agitation about something that may happen", ["fear", "anxiety"],[]);
const twentysixthWord = await words.addWord("Ubiquitous", "present, appearing, or found everywhere", ["everywhere", "common"],[]);
const twentyseventhWord = await words.addWord("Voracious", "wanting or devouring great quantities of food", ["hungry", "greedy"],[]);
const twentyeighthWord = await words.addWord("Wistful", "having or showing a feeling of vague or regretful longing", ["longing", "nostalgic"],[]);
const twentyninthWord = await words.addWord("Xenophobe", "a person who is fearful or contemptuous of that which is foreign, especially of strangers or of people from different countries or cultures", ["fearful"],[]);
const thirtiethWord = await words.addWord("Yammer", "to talk continuously and often loudly, especially in a way that is annoying to others", ["talkative", "loud"],[]);
const thirtyfirstWord = await words.addWord("Zealot", "a person who is fanatical and uncompromising in pursuit of their religious, political, or other ideals", ["fanatical", "extreme"],[]);



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
