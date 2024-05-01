import { tickets } from "../../config/mongoCollections.js";
import { ObjectId, ReturnDocument } from "mongodb";
import ticketValidation from "./ticketValidation.js";
import idValidation from "../../validation/idValidation.js";
import helpers from "./helpers.js";

let exportedMethods = {
  async getAllTickets() {
    const ticketCollection = await tickets();
    return await ticketCollection.find({}).toArray();
  },

  async getTicketById(id) {
    id = idValidation.validateId(id);
    const ticketCollection = await tickets();
    const ticket = await ticketCollection.findOne({ _id: new ObjectId(id) });
    if (!ticket) {
      throw "Error: ticket not found";
    }
    return ticket;
  },

  async getTicketsForUser(user_id) {
    user_id = idValidation.validateId(user_id);
    const ticketCollection = await tickets();
    const tickets = await ticketCollection.find({ submitter_id: new ObjectId(user_id) }).toArray();
    if (!tickets) {
      throw "Error: no tickets for this user";
    }
    return tickets;
  },

  async addTicket(submitter_id, type, body) {
    submitter_id = idValidation.validateId(submitter_id);
    type = ticketValidation.validateType(type);
    body = ticketValidation.validateBody(body);

    let newTicket = helpers.createNewTicket(submitter_id, type, body);

    const ticketCollection = await tickets();

    const newInsertInformation = await ticketCollection.insertOne(newTicket);

    if (!newInsertInformation.insertedId) {
      throw "Insert failed!";
    }

    return await this.getTicketById(newInsertInformation.insertedId.toString());
  },

  async resolveTicket(ticket_id) {
    ticket_id = idValidation.validateId(ticket_id);

    const ticketCollection = await tickets();

    const updateInfo = await ticketCollection.findOneAndUpdate(
      {
        _id: new ObjectId(ticket_id),
      },
      { $set: { resolved: true } },
      { returnDocument: "after" }
    );

    if (!updateInfo) {
      throw "Update failed!";
    }

    return {resolutionSuccess: true};
  },
};
export default exportedMethods;
