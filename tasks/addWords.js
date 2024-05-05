import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import words from '../data/words/words.js'

const db = await dbConnection();

try {
await words.addWord("gingerly", "very carefully or cautiously", ["adverb", "rare"], []);
await words.addWord("esoteric", "not understood by many people", ["adjective", "useful"], []);
await words.addWord("flimflam", "to trick, scam, or deceive", ["verb", "informal"], []);
await words.addWord("magnanimous", "generously, especially to someone", ["verb", "informal"], []);
}catch(e){
    console.log(e)
}
console.log("Done adding words")


await closeConnection();
