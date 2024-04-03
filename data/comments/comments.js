import { comments,posts } from '../../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import commentValidation from './commentValidation.js';
import idValidation from "../../validation/idValidation.js";
import helpers from './helpers.js'
import users from '../users/users.js';

let exportedMethods = {
    async getCommentById(id) {
        id = idValidation.validateId(id);
        const commentCollection = await comments();
        const comment = await commentCollection.findOne({ _id: new ObjectId(id) });
        if (!comment) { throw 'Error: comment not found' };
        return comment;
    },



    async addComment(post_id,commenter_id, body) {
        post_id = idValidation.validateId(post_id);
        commenter_id = idValidation.validateId(commenter_id);
        body = commentValidation.validateBody(body);

        let newComment = helpers.createNewComment(commenter_id, body);

        const commentCollection = await comments();

        const newInsertInformation = await commentCollection.insertOne(newComment);

        if (!newInsertInformation.insertedId) { throw 'Insert comment failed!' };


        const postCollection = await posts();

        const updateInfo = await postCollection.updateOne(
            {
                _id: post_id
            },
            {
                $push: {
                    comments:
                        newComment
                }
            }
        );

        if (!updateInfo.acknowledged) { throw 'Update post failed!' };

        return await this.getCommentById(newComment._id.toString());

    },

};
export default exportedMethods;