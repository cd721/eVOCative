import express from 'express';
const app = express();
// TO-DO: Create imports
//import configRoutes from './routes/index.js'


app.use(express.json());

configRoutes(app);

app.listen(3000, () => {
    console.log(`We now have a server!`);
    console.log(`Your routes will be running on http://localhost:3000`);
});