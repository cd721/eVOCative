import { posts } from '../../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import commentValidation from './commentValidation.js';
import idValidation from "../../validation/idValidation.js";
import helpers from './helpers.js'

let exportedMethods = {
    async getCommentById(id) {
        id = idValidation.validateId(id);
        const postCollection = await posts();
        const comment = await postCollection.findOne(
            { 'comments._id': new ObjectId(id) },
            { projection: { _id: 0, 'comments.$': 1 } }
        );
        if (!comment) { throw 'Error: comment not found' };
        return comment;
    },



    async addComment(post_id, commenter_id, body) {
        post_id = idValidation.validateId(post_id);
        commenter_id = idValidation.validateId(commenter_id);
        body = commentValidation.validateBody(body);

        let newComment = helpers.createNewComment(commenter_id, body);


        const postCollection = await posts();

        const updateInfo = await postCollection.updateOne(
            {
                _id: new ObjectId(post_id)
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