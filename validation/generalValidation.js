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
    if (ind === '') {
      ind = 0;
    } else {
      ind = Number(ind);
    }
    ind = this.validateNumber(ind);
    if (ind !== 0 && ind !== 1 && ind !== 2 && ind !== 3) throw `Error: Index must be 0, 1, 2, or 3.`;
    return ind;
  },
};
export default exportedMethods;
