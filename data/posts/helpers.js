import { ObjectId } from 'mongodb';
import idValidation from '../../validation/idValidation.js';
import validation from './postValidation.js';
import numValidation from '../../validation/generalValidation.js';

let exportedMethods = {

    createNewPost(poster_id, title, post, tags, charLimit) {
        poster_id = idValidation.validateId(poster_id);
        title = validation.validateTitle(title, charLimit);
        post = validation.validatePost(post);
        tags = validation.validateTags(tags);
        charLimit = numValidation.validateNumber(charLimit);

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