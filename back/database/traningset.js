import pkg from 'pg';
const { Pool } = pkg;
import credentials from './config.js';

async function getTrainingSet() {
    const pool = new Pool(credentials);
    const rest = await pool.query(`SELECT c.* FROM trainingset ts
                                    JOIN corpus c ON c.Id = ts.corpus_id`, values);
    await pool.end();

    return rest.rows;
}

module.exports.getTrainingSet = getTrainingSet;