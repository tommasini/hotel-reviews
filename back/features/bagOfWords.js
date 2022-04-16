import { idf, tfidf } from '../preprocessing/counting.js';
import Term from '../Term.js';

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

export function sumVector(terms) {
    let nDocuments = terms.filter(term => term.binary).length;
    let totalOfDocuments = terms.length;
    let idfValue = idf(totalOfDocuments, nDocuments);
    var term = Term.partialCreation(terms[0].name, idfValue);

    terms.forEach(element => {
        term.incrementBinary(element.binary);
        term.incrementOccurrences(element.occurrences);
        term.incrementtf(element.tf);
        term.incrementTFIDF(tfidf(element.tf, idfValue));
    });

    return term;
}

export function avgVector(terms) {
    var sumTerm = sumVector(terms);
    sumTerm.setBinary(sumTerm.binary / terms.length);
    sumTerm.setOccurrences(sumTerm.occurrences / terms.length);
    sumTerm.setTF(sumTerm.tf / terms.length);

    return sumTerm;
}
