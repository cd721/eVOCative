import { ObjectId } from "mongodb";
import idValidation from '../../validation/idValidation.js';
import validation from './ticketValidation.js';

let exportedMethods = {
  createNewTicket(submitter_id, type, body) {
    submitter_id = idValidation.validateId(submitter_id);
    type = validation.validateType(type);
    body = validation.validateBody(body);

    let newTicket = {
      _id: new ObjectId(),
      submitter_id: new ObjectId(submitter_id),
      type: type,
      body: body,

      submission_date: new Date(),
      resolved: false,
    };
    return newTicket;
  },
};

export default exportedMethods;
