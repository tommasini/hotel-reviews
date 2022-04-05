import pkg from 'pg';
const { Pool } = pkg;
import credentials from './config.js';

export default async function getTrainingSet() {
    const pool = new Pool(credentials);
    const rest = await pool.query(`SELECT c.* FROM trainingset ts
                                    JOIN corpus c ON c.Id = ts.corpus_id`);
    await pool.end();

    return rest.rows;
}