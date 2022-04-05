import { traningset } from './database/traningset';

class Train {
    constructor() {
    }

    getTrainingSet() {
        return traningset.getTrainingSet();
    }
}