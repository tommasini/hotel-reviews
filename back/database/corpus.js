import pkg from 'pg';
const { Pool } = pkg;
import credentials from './config.js';

export const getDocuments = async (label, limit) => {
    const pool = new Pool(credentials);

    var limitQuery = limit ? "limit $2" : "";
    var values = limit ? [label, limit] : [label];
    const rest = await pool.query(`SELECT * FROM corpus WHERE label = $1 ORDER BY id ${limitQuery}`, values);
    await pool.end();

    return rest.rows;
}

export const getDocument = async (id) => {
    const pool = new Pool(credentials);

    const rest = await pool.query(`SELECT * FROM corpus WHERE Id = $1`, [id]);
    await pool.end();

    return rest.rows;
}