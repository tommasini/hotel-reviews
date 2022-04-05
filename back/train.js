const traningset = require('./database/traningset');

class Train {
    constructor() {
    }

    getTrainingSet() {
        return traningset.getTrainingSet();
    }
}