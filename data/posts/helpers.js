import { ObjectId } from 'mongodb';

let exportedMethods = {

    createNewPost(poster_id, title, post, tags) {
        poster_id = poster_id.toString();
        let newPost = {
            _id: new ObjectId(),
            title: title,
            post: post,
            tags: tags,
            poster_id: new ObjectId(poster_id),
            post_date: new Date(),
            comments: [],

        };

        return newPost;
    }
};

export default exportedMethods;