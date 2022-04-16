export default class Term {

    constructor(name, binary, occurrences, tf, docId) {
        this.name = name;
        this.binary = binary;
        this.occurrences = occurrences;
        this.tf = tf;
        this.idf = 0;
        this.tfidf = 0;
        this.docId = docId;
    }

    incrementBinary(value) {
        this.binary += value;
    }

    incrementOccurrences(value) {
        this.occurrences += value;
    }

    incrementtf(value) {
        this.tf += value;
    }

    incrementTFIDF(value) {
        this.tfidf += value;
    }

    setIDF(value) {
        this.idf = value;
    }

    setBinary(value) {
        this.binary = value;
    }

    setOccurrences(value) {
        this.occurrences = value;
    }

    setTF(value) {
        this.tf = value;
    }
}


Term.partialCreation = function (name, idf) {
    let term = new Term(name, 0, 0, 0, null);
    term.setIDF(idf);
    return term;
};