export default class Term {

    constructor(name, binary, occurrences, tf, docId) {
        this.name = name;
        this.binary = binary;
        this.occurrences = occurrences;
        this.tf = tf;
        this.idf = 0;
        this.tfidf = 0;
        this.docId = docId;
        this.metric = null;
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

    setTFIDF(value) {
        this.tfidf = value;
    }

    setMetric(value) {
        this.metric = value;
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

Term.fullCreation = function (name, binary, occurrences, tf, idf, tfidf, metric, docId) {
    let term = new Term(name, binary, occurrences, tf, docId);
    term.setIDF(idf);
    term.setTFIDF(tfidf);
    term.setMetric(metric);
    return term;
};