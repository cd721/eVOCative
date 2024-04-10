import { ObjectId } from 'mongodb';

let exportedMethods = {
    createNewTicket(submitter_id, type, body) {
        let newTicket = {
            _id: new ObjectId(),
            submitter_id: new ObjectId(submitter_id),
            type: type,
            body: body,

            submission_date: new Date(),
            resolved: false,

        };
        return newTicket;
    }

}

export default exportedMethods;