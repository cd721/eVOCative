import { Router } from 'express';
import idValidation from '../validation/idValidation.js';
import userData from '../data/users/users.js';

import postData from '../data/posts/posts.js'
const router = Router();
router.route('/')
    .get(async (req, res) => {
        try {
            const postList = await postData.getAllPosts();
            console.log(postList)
            return res.render("posts/index", { posts: postList });
        } catch (e) {
            return res.status(500).json({ error: e });
        }
    });

router.route('/new')
    .get(async (req, res) => {



        try {
           return res.render("posts/new");
        } catch (e) {
            return res.status(500).json({ error: e });


        }
    })

router.route('/:id')
    .get(async (req, res) => {
        let post_id = req.params.id;
        let post;

        try {
            post_id = idValidation.validateId(post_id);
            post = await postData.getPostById(post_id.toString());
        } catch (e) {
            return res.status(400).render("error");

        }


        try {
            const poster = await userData.getUserById(post.poster_id.toString());
            const poster_name = `${poster.firstName} ${poster.lastName}`;

            return res.render("posts/single", { post: post, poster_name: poster_name });

        } catch (e) {
            return res.status(500).json({ error: e });
        }


    });

export default router;