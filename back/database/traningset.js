import pkg from 'pg';
const { Pool } = pkg;
import credentials from './config.js';

export async function getTrainingSet() {
    const pool = new Pool(credentials);
    const rest = await pool.query(`SELECT c.* FROM trainingset ts
                                    JOIN corpus c ON c.Id = ts.corpus_id`);
    await pool.end();

    return rest.rows;
}

export async function saveResults(terms, label, type, ngram) {
    await deleteAllResults();

    let values = "";
    for (const term of terms) {
        values += `('${term.name}','${term.binary}','${term.occurrences}','${term.tf}','${term.idf}','${term.tfidf}','${label}','${ngram}','${type}'),`;
    }
    values = values.slice(0, -1);

    const pool = new Pool(credentials);
    const rest = await pool.query(`INSERT INTO public.results(
        name, binaryvalue, occurrences, tf, idf, tfidf, label, ngram, type)
        VALUES ${values}`);
    await pool.end();
}

async function saveTerm(term, label, type, ngram) {
    const pool = new Pool(credentials);
    const rest = await pool.query(`INSERT INTO public.results(
                                    name, binaryvalue, occurrences, tf, idf, tfidf, label, ngram, type)
                                    VALUES ('${term.name}','${term.binary}','${term.occurrences}','${term.tf}','${term.idf}','${term.tfidf}','${label}','${ngram}','${type}')`);
    await pool.end();
}

async function deleteAllResults() {
    const pool = new Pool(credentials);
    const rest = await pool.query(`DELETE from public.results`);
    await pool.end();
}