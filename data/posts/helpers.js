import { ObjectId } from 'mongodb';

let exportedMethods = {

    createNewPost( title, post, tags) {
        let newPost = {
            _id: new ObjectId(),
            title: title,
            post: post,
            tags: tags,

            post_date: new Date(),
            comments: [],
            
        };

        return newPost;
    }
};

export default exportedMethods;