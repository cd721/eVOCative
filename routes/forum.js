import { Router } from 'express';
import idValidation from '../validation/idValidation.js';
import userData from '../data/users/users.js';
import xss from "xss";

import postData from '../data/posts/posts.js'
const router = Router();
router.route('/')
    .get(async (req, res) => {
        try {
            const postList = await postData.getAllPosts();

            //Make the list of tags more readable
            for (let i = 0; i < postList.length; i++) {
                postList[i].tags = postList[i].tags.join(", ");
            }

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
    .post(async (req, res) => {
        try {
            let poster_id = req.session.user._id;
            let title = xss(req.body.title);
            let post = xss(req.body.post);
            let tags = xss(req.body.tags);
            tags = tags.split(",").map(tag => tag.trim());
            console.log({poster_id: poster_id, title: title, post: post, tags: tags});

            await postData.addPost(poster_id, title, post, tags);
            return res.redirect("/forum");

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