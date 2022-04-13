import { numberOfOccurrences, tf, idf } from '../preprocessing/counting.js';

export function addUniqueTerms(terms1, terms2) {
    var allTerms = new Set([
        ...terms1,
        ...terms2
    ]);

    return [...allTerms];
}

export function binaryVector(bagOfWords, terms) {
    return bagOfWords.map((value) => {
        return terms.find(term => term === value) ? 1 : 0;
    });
}

export function numberOfOccurrencesVector(bagOfWords, terms) {
    return bagOfWords.map((value) => {
        return terms.filter(term => term === value).length;
    });
}

export function tfVector(bagOfWords, terms) {
    return numberOfOccurrencesVector(bagOfWords, terms).map((value) => {
        return value !== 0 ? value / terms.length : 0;
    });
}

export function idfVector(bagOfWords, documents) {
    return bagOfWords.map((word) => {
        try {
            var nDocuments = documents.filter((document) => document.find(term => term === word));

            return idf(documents.length, nDocuments.length);
        } catch (error) {
            return null;
        }

    });
}

export function tfIdfVector(bagOfWords, terms, documents) {
    var tfVectorValues = tfVector(bagOfWords, terms);
    var idfVectorValues = idfVector(bagOfWords, documents);

    return bagOfWords.map((word, index) => {
        var tf = tfVectorValues[index];
        var idf = idfVectorValues[index];
        return tf * idf;
    });
}
