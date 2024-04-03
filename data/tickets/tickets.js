import { tickets } from '../../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import ticketValidation from './ticketValidation.js';
import idValidation from "../../validation/idValidation.js";
import helpers from './helpers.js'

let exportedMethods = {
    async getTicketById(id) {
        id = idValidation.validateId(id);
        const ticketCollection = await tickets();
        const ticket = await ticketCollection.findOne({ _id: new ObjectId(id) });
        if (!ticket) { throw 'Error: ticket not found' };
        return ticket;
    },



    async addTicket(submitter_id, type, body) {
        submitter_id = idValidation.validateId(submitter_id);
        type = ticketValidation.validateType(type);
        body = ticketValidation.validateBody(body);

        let newTicket = helpers.createNewTicket(submitter_id, type, body);


        const ticketCollection = await tickets();

        const newInsertInformation = await ticketCollection.insertOne(newTicket);

        if (!newInsertInformation.insertedId) { throw 'Insert failed!' };

        return await this.getTicketById(newInsertInformation.insertedId.toString());


    },



};
export default exportedMethods;