
import { ObjectId } from 'mongodb';
let exportedMethods = {

    createNewComment(commenter_id, body, commenterName) {
        let newComment = {
            _id: new ObjectId(),
            commenter_id: new ObjectId(commenter_id),
            body: body,
            name: commenterName,

            comment_date: new Date()

        };

        return newComment;
    }
};

export default exportedMethods;