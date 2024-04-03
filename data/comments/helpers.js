
import { ObjectId } from 'mongodb';
let exportedMethods = {

    createNewComment(commenter_id, body) {
        let newComment = {
            _id: new ObjectId(),
            commenter_id: new ObjectId(commenter_id),
            body: body,

            comment_date: new Date()

        };

        return newComment;
    }
};

export default exportedMethods;