import { Router } from 'express';
import userValidation from '../data/users/userValidation.js';
import userData from '../data/users/users.js';
const router = Router();

router
    .route('')
        .get(async (req, res) => {
            try {
                return res.render('login');
            } catch (e) {
                return res.status(500).json({error: e});
            }
        })
        .post(async (req, res) => {
            let login = req.body;
            let errorList = [];
            let username = login.loginUser;
            let password = login.loginPass;
            let userList;

            try {
                username = userValidation.validateName(username);
            } catch (e) {
                errorList.push(e);
            }

            try {
                password = userValidation.validatePassword(password);
            } catch (e) {
                errorList.push(e);
            }

            try {
                userList = await userData.getAllUsers();
            } catch (e) {
                errorList.push(e);
            }
            
            if(errorList.length > 0) {
                res.render('login', {
                    errors: errorList,
                    hasErrors: true,
                    username: username,
                    log: login
                });
                return;
            }
            else {
                console.log('it work!');
            }
        });
export default router;