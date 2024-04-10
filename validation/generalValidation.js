import { ObjectId } from 'mongodb';

const exportedMethods = {
    //TODO: revise
    validateAccuracyScore(score) {
       //TODO: ensure accuracy score is between 0 and 1
       return score;
    },
    validateGen(label, input) {
        if(!input) throw `Error: ${label || `Variable`} not provided.`;
        if(typeof input !== 'string') throw `Error: ${label || `Variable`} must be of type string.`;
        input = input.trim();
        if(input.length === 0) throw `Error: ${label || `Variable`} cannot be empty or just spaces.`;
    
        return input;
      }
}
export default exportedMethods;
