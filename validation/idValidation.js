import { ObjectId } from 'mongodb';

const exportedMethods = {
    //TODO: revise
    validateId(id, varName = "value") {
        if (!id) throw `Error: You must provide a ${varName}`;
        if (typeof id !== 'string') throw `Error:${varName} must be a string`;
        id = id.trim();
        if (id.length === 0)
            throw `Error: ${varName} cannot be an empty string or just spaces`;
        if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
        return id;
    },
}
export default exportedMethods;
