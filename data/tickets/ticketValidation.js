const exportedMethods = {
  validateType(type) {
    if (!type) throw `Error: Type not provided.`;
    if (typeof type !== "string") throw `Error: Type must be of type string`;
    type = type.trim();
    if (type.length === 0) throw `Error: Type cannot be empty or just spaces`;
    if (
      type !== "new vocab" ||
      type !== "report a user" ||
      type !== "report a post/comment" ||
      type !== "bug fix" ||
      type !== "update/remove vocab" ||
      type !== "feature request"
    ) {
      throw `Error: Type must be one of the predefined types`;
    }
    return type;
  },
  validateBody(body) {
    if (!body) throw `Error: Ticket body not provided.`;
    if (typeof body !== "string") throw `Error: Ticket body must be of type string`;
    body = body.trim();
    if (body.length === 0)
      throw `Error: Ticket body cannot be empty or just spaces`;
    return body;
  },
};

export default exportedMethods;
