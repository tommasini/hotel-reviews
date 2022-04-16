import clean from './clean.js';
import removeStopwordsfromInput from './stopwords.js';
import ngram from './tokenization.js';
import { stemmerWithNgram, stemmerWithSplit } from './stemming.js';

export default (text, number) => {
    const stopWords = removeStopwordsfromInput(text);

    const cleanedText = clean(stopWords.join(' '));

    const stemmedText = stemmerWithSplit(cleanedText);

    const tokenization = ngram(stemmedText, number);
    const tokenizationParsed = tokenization.map((value) => {
        if (value[1]) {
            return `${value[0]} ${value[1]}`;
        }

        return value[0];
    });
    //deveria se remover os duplicados?
    // tokenization: tokenizationParsed.filter(onlyUnique)
    return {
        stopWords,
        cleanedText,
        stemmedText,
        tokenization: tokenizationParsed
    };
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}