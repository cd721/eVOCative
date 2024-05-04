import { Router } from "express";
import idValidation from "../validation/idValidation.js";
import userData from "../data/users/users.js";
import commentData from "../data/comments/comments.js";
import xss from "xss";

import postData from "../data/posts/posts.js";
const router = Router();
router.route("/").get(async (req, res) => {
  try {
    const postList = await postData.getAllPosts();

    // check poster id still exists in the database, if not remove post from post list
    for (let i = 0; i < postList.length; i++) {
      try {
        const poster = await userData.getUserById(
          postList[i].poster_id.toString()
        );
      } catch (error) {
        postList.splice(i, 1);
        i--;
      }
    }

    //console.log(postList)
    return res.render("posts/index", { posts: postList });
  } catch (e) {
    return res.status(500).render("errorSpecial", { error: e });
  }
});

router
  .route("/new")
  .get(async (req, res) => {
    try {
      return res.render("posts/new");
    } catch (e) {
      return res.status(500).render("errorSpecial", { error: e });
    }
  })
  .post(async (req, res) => {
    try {
      let poster_id = req.session.user._id;
      let title = xss(req.body.title);
      let post = xss(req.body.post);
      let tags = xss(req.body.tags);
      tags = tags.split(",").map((tag) => tag.trim());
      //console.log({poster_id: poster_id, title: title, post: post, tags: tags});

      await postData.addPost(poster_id, title, post, tags);
      return res.redirect("/forum");
    } catch (e) {
      return res.status(500).render("errorSpecial", { error: e });
    }
  });

router
  .route("/newScore")
  .get(async (req, res) => {
    try {
      let user = await userData.getUserById(req.session.user._id);
      let post = {
        title: "My Accuracy Score",
        body: `My accuracy score is currently ${user.accuracy_score}!`,
        tags: "Accuracy Score, Score Challenge",
      };
      return res.render("posts/new", { post: post });
    } catch (e) {
      return res.status(500).render("errorSpecial", { error: e });
    }
  })
  .post(async (req, res) => {
    try {
      let poster_id = req.session.user._id;
      let title = xss(req.body.title);
      let post = xss(req.body.post);
      let tags = xss(req.body.tags);
      tags = tags.split(",").map((tag) => tag.trim());
      //console.log({poster_id: poster_id, title: title, post: post, tags: tags});

      await postData.addPost(poster_id, title, post, tags);
      return res.redirect("/forum");
    } catch (e) {
      return res.status(500).render("errorSpecial", { error: e });
    }
  });

router
  .route("/:id")
  .get(async (req, res) => {
    let post_id = req.params.id;
    let post;

    try {
      post_id = idValidation.validateId(post_id);
      post = await postData.getPostById(post_id.toString());
    } catch (e) {
      return res.status(400).render("notFoundError");
    }

    try {
      const poster = await userData.getUserById(post.poster_id.toString());
      const poster_name = `${poster.firstName} ${poster.lastName}`;

      let comments = post.comments;
      comments = comments.reverse();

      return res.render("posts/single", {
        post: post,
        poster_name: poster_name,
        comments: comments,
      });
    } catch (e) {
      return res.status(500).render("errorSpecial", { error: e });
    }
  })
  .post(async (req, res) => {
    try {
      let commenter_id = req.session.user._id;
      let comment = xss(req.body.comment);
      let post_id = xss(req.body.postID);

      //add comment to post
      await commentData.addComment(post_id, commenter_id, comment);
      return res.redirect(`/forum/${post_id}`);
    } catch (e) {
      return res.status(500).render("errorSpecial", { error: e });
    }
  });

export default router;
