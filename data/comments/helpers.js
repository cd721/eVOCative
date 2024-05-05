import { ObjectId } from "mongodb";
import idValidation from "../../validation/idValidation.js";
import validation from "./commentValidation.js";
import usernameValidation from "../users/userValidation.js";

let exportedMethods = {
  createNewComment(commenter_id, body, commenterName) {
    commenter_id = idValidation.validateId(commenter_id);
    body = validation.validateBody(body);
    commenterName = usernameValidation.validateUsername(commenterName);

    let newComment = {
      _id: new ObjectId(),
      commenter_id: new ObjectId(commenter_id),
      body: body,
      name: commenterName,

      comment_date: new Date(),
    };

    return newComment;
  },
};

export default exportedMethods;
