const { Pool } = require('pg');
const credentials = require("./config");

async function getTrainingSet() {
    const pool = new Pool(credentials);
    const rest = await pool.query(`SELECT c.* FROM trainingset ts
                                    JOIN corpus c ON c.Id = ts.corpus_id`, values);
    await pool.end();

    return rest.rows;
}

module.exports.getTrainingSet = getTrainingSet;