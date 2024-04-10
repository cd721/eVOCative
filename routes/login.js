import { Router } from 'express';
import idValidation from '../validation/idValidation.js';
import userData from '../data/users/users.js';

import postData from '../data/posts/posts.js'
const router = Router();

router
    .route('/').get(async (req, res) => {
        try {
            return res.render('login');
        } catch (e) {
            return res.status(500).json({error: e});
        }
});
export default router;