import { ObjectId } from "mongodb";

const exportedMethods = {
  //TODO: revise
  validateAccuracyScore(score) {
    score = this.validateNumber(score);
    if (score < 0 || score > 1) throw `Error: Score must be between 0 and 1.`;
    return score;
  },

  validateNumber(num) {
    if (typeof num !== "number") throw `Error: Variable must be a number.`;
    return num;
  },

  validateGen(label, input) {
    if (!input) throw `Error: ${label || `Variable`} not provided.`;
    if (typeof input !== "string")
      throw `Error: ${label || `Variable`} must be of type string.`;
    input = input.trim();
    if (input.length === 0)
      throw `Error: ${label || `Variable`} cannot be empty or just spaces.`;

    return input;
  },

  validateIndex(ind) {
    ind = Number(ind);
    ind = this.validateNumber(ind);
    if (ind !== 1 && ind !== 2 && ind !== 3 && ind !== 4) throw `Error: Index must be 1, 2, 3, or 4.`;
    return ind;
  },
};
export default exportedMethods;
