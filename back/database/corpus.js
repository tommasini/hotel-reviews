const { Pool } = require('pg');
const credentials = require("./config");

async function getDocuments(label, limit) {
    const pool = new Pool(credentials);

    var limitQuery = limit ? "limit $2" : "";
    var values = limit ? [label, limit] : [label];
    const rest = await pool.query(`SELECT * FROM corpus WHERE label = $1 ORDER BY id ${limitQuery}`, values);
    await pool.end();

    return rest.rows;
}

async function getDocument(id) {
    const pool = new Pool(credentials);

    const rest = await pool.query(`SELECT * FROM corpus WHERE Id = $1`, [id]);
    await pool.end();

    return rest.rows;
}

module.exports.getDocuments = getDocuments;
module.exports.getDocument = getDocument;