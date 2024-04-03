const exportedMethods = {

    validateBody(body) {
        if (typeof body !== 'string') throw `Error: Comment must be of type string!`;
        body = body.trim();
        if (body.length === 0) throw `Error: Comment cannot be empty or just spaces!`;
        return body;
    },


};

export default exportedMethods;