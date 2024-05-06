const exportedMethods = {
  validateBody(body) {
    if (!body) throw `Error: Comment not provided.`;
    if (typeof body !== "string") throw `Error: Comment must be of type string`;
    body = body.trim();
    if (body.length === 0)
      throw `Error: Comment cannot be empty or just spaces`;
    if (body.length > 250) throw `Error: Comment cannot be more than 250 characters`;
    return body;
  },
};

export default exportedMethods;
