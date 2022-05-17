import pkg from 'pg';
import Term from '../Term.js';
const { Pool } = pkg;
import credentials from './config.js';

export async function getTrainingSet() {
    const pool = new Pool(credentials);
    const rest = await pool.query(`SELECT c.* FROM trainingset ts
                                    JOIN corpus c ON c.Id = ts.corpus_id`);
    await pool.end();

    return rest.rows;
}

export async function getValidationSet() {
    const pool = new Pool(credentials);
    const rest = await pool.query(`Select * from corpus
                                    where Id not in (Select corpus_id FROM trainingset)
                                    limit 50`);
    await pool.end();

    return rest.rows;
}

export async function getBestKResults() {
    const pool = new Pool(credentials);
    const rest = await pool.query(`SELECT r.*, br.metric FROM bestresults br
                                    JOIN results r ON r.Id = br.result_id`);
    await pool.end();

    return parseRowsToTerms(rest.rows, true);
}

export async function loadResults() {
    const pool = new Pool(credentials);
    const rest = await pool.query(`SELECT * FROM results`);
    await pool.end();

    return parseRowsToTerms(rest.rows);
}

function parseRowsToTerms(rows, formatByMetrics = false) {
    var happyResults = {
        termsSumMetrics: [],
        termsAvgMetrics: [],
        bigramsTermsSumMetrics: [],
        bigramsTermsAvgMetrics: [],
    }

    var notHappyResults = {
        termsSumMetrics: [],
        termsAvgMetrics: [],
        bigramsTermsSumMetrics: [],
        bigramsTermsAvgMetrics: [],
    }

    rows.forEach(element => {
        var term = new Term.fullCreation(element.name, element.binaryvalue, element.occurrences, element.tf, element.idf, element.tfidf, element.metric);
        if (element.label == "Happy") {
            pushToClassObject(element, happyResults, term);
        }
        else {
            pushToClassObject(element, notHappyResults, term);
        }
    });

    if (formatByMetrics) {
        happyResults.termsSumMetrics = splitByMetrics(happyResults.termsSumMetrics);
        happyResults.termsAvgMetrics = splitByMetrics(happyResults.termsAvgMetrics);
        happyResults.bigramsTermsSumMetrics = splitByMetrics(happyResults.bigramsTermsSumMetrics);
        happyResults.bigramsTermsAvgMetrics = splitByMetrics(happyResults.bigramsTermsAvgMetrics);
        notHappyResults.termsSumMetrics = splitByMetrics(notHappyResults.termsSumMetrics);
        notHappyResults.termsAvgMetrics = splitByMetrics(notHappyResults.termsAvgMetrics);
        notHappyResults.bigramsTermsSumMetrics = splitByMetrics(notHappyResults.bigramsTermsSumMetrics);
        notHappyResults.bigramsTermsAvgMetrics = splitByMetrics(notHappyResults.bigramsTermsAvgMetrics);
    }

    return {
        happyResults,
        notHappyResults
    };
}

function splitByMetrics(terms) {
    var resultByMetrics = {
        binary: [],
        occurrences: [],
        tf: [],
        tfidf: [],
        idf: []
    }

    terms.forEach((term) => {
        if (term.metric == "occurrences") {
            resultByMetrics.occurrences.push(term);
        }
        else if (term.metric == "tf") {
            resultByMetrics.tf.push(term);
        }
        else if (term.metric == "tfidf") {
            resultByMetrics.tfidf.push(term);
        }
        else if (term.metric == "binary") {
            resultByMetrics.binary.push(term);
        }
    });

    return resultByMetrics;
}

function pushToClassObject(element, classObject, term) {
    if (element.ngram == 1 && element.type == "avg") {
        classObject.termsAvgMetrics.push(term);
    }
    if (element.ngram == 1 && element.type == "sum") {
        classObject.termsSumMetrics.push(term);
    }
    if (element.ngram == 2 && element.type == "avg") {
        classObject.bigramsTermsAvgMetrics.push(term);
    }
    if (element.ngram == 2 && element.type == "sum") {
        classObject.bigramsTermsSumMetrics.push(term);
    }
}

export async function saveResults(terms, label, type, ngram, deleteAll = false) {
    if (deleteAll) {
        await deleteAllBestResults();
        await deleteAllResults();
    }

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

export async function saveBestResults(terms, label, type, ngram, metric, deleteAll = false) {
    if (deleteAll) {
        await deleteAllBestResults();
    }

    let names = "";
    for (const term of terms) {
        names += `'${term.name}',`;
    }
    names = names.slice(0, -1);

    const pool = new Pool(credentials);
    const rest = await pool.query(`INSERT INTO bestresults(metric,result_id)
                                    SELECT '${metric}', id FROM public.results
                                    WHERE name in (${names})
                                         AND ngram = '${ngram}' 
                                         AND type = '${type}'
                                         AND label = '${label}'`);
    await pool.end();
}

async function deleteAllResults() {
    const pool = new Pool(credentials);
    const rest = await pool.query(`DELETE from public.results`);
    await pool.end();
}

async function deleteAllBestResults() {
    const pool = new Pool(credentials);
    const rest = await pool.query(`DELETE from public.bestresults`);
    await pool.end();
}