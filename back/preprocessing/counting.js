export function words(text) {
    return text.split(' ').length;
}

export function characters(text) {
    return text.length;
}

export function numberOfOccurrences(term, text) {
    return text.split(' ').reduce((total, item) => {
        return item === term ? total++ : total;
    }, 0)
}

export function exists(term, text) {
    return text.includes(term)
}

export function tf(term, text) {
    return numberOfOccurrences(term, text) / words(text);
}

export function idf(nDocs, value) {
    return Math.log(nDocs / value);

}

export function tfidf(tf, idf) {
    return tf * idf;
}