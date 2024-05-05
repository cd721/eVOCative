import { posts } from '../../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import postValidation from './postValidation.js';
import idValidation from "../../validation/idValidation.js";
import helpers from './helpers.js'

let exportedMethods = {

    async getAllPosts() {
        const postCollection = await posts();
        return await postCollection.find({}).toArray();
    },

    async getPostById(id) {
        id = idValidation.validateId(id);
        const postCollection = await posts();
        const post = await postCollection.findOne({ _id: new ObjectId(id) });
        if (!post) { throw 'Error: post not found' };
        return post;
    },



    async addPost(poster_id,title, post, tags) {

        let charLimit = 50;

        post = postValidation.validatePost(post);
        title = postValidation.validateTitle(title, charLimit);
        tags = postValidation.validateTags(tags);
        poster_id = idValidation.validateId(poster_id);

        let newPost = helpers.createNewPost(poster_id, title, post, tags);

        const postCollection = await posts();

        const newInsertInformation = await postCollection.insertOne(newPost);

        if (!newInsertInformation.insertedId) { throw 'Insert failed!' };

        return await this.getPostById(newInsertInformation.insertedId.toString());

    },

    async getAllTags() {
        const postCollection = await posts();
        const allPosts = await postCollection.find({}).toArray();
        const allTags = new Set();

        for (let i = 0; i < allPosts.length; i++) {
            const post = allPosts[i];
            if (post.tags) {
                for (let j = 0; j < post.tags.length; j++) {
                    const tag = post.tags[j];
                    allTags.add(tag);
                }
            }
        }
        return Array.from(allTags);
    }
};
export default exportedMethods;