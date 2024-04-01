import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import users from '../data/users/users.js';

const db = await dbConnection();
await db.dropDatabase();

const catherine = await users.addUser("Catherine", "DeMario", "cdemario@stevens.edu", "password");

console.log('Done seeding database');

await closeConnection();
