import { ObjectId } from 'mongodb';

const exportedMethods = {
    //TODO: revise
    validateAccuracyScore(score) {
       //TODO: ensure accuracy score is between 0 and 1
       return score;
    },
}
export default exportedMethods;
