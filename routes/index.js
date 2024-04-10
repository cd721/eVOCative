import forumRoutes from './forum.js';
import userRoutes from './users.js';
import quizRoutes from './quiz.js'
import path from 'path';
import { static as staticDir } from 'express';
const constructorMethod = (app) => {
    app.use('/forum', forumRoutes);
    app.use('/quiz', quizRoutes);
    app.use('/posts', forumRoutes);
    app.use('/users', userRoutes);
    app.get('/about', (req, res) => {
        res.sendFile(path.resolve('static/about.html'));
    });
    app.use('/public', staticDir('public'));
    app.get('/', (req, res) => {
        res.render('home');
    })

    app.use('*', (req, res) => {
        res.render('error');
    });
};

export default constructorMethod;
