import {dbConnection, closeConnection} from '../config/mongoConnection.js';

const db = await dbConnection();
await db.dropDatabase();

const catherine = await users.addUser();

console.log('Done seeding database');

await closeConnection();
