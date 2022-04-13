import clean from './clean.js';
import removeStopwordsfromInput from './stopwords.js';
import ngram from './tokenization.js';
import { stemmerWithNgram, stemmerWithSplit } from './stemming.js';

export default (text, number) => {
    const stopWords = removeStopwordsfromInput(text);
    console.log('stopWords', stopWords);

    const cleanedText = clean(stopWords.join(' '));
    console.log('cleanedText', cleanedText);

    const stemmedText = stemmerWithSplit(cleanedText);
    console.log('stemmedText', stemmedText);

    const tokenization = ngram(stemmedText, number);
    const tokenizationParsed = tokenization.map((value) => {
        if (value[1]) {
            return `${value[0]} ${value[1]}`;
        }

        return value[0];
    });
    console.log('tokenizationParsed', tokenizationParsed);

    return {
        stopWords,
        cleanedText,
        stemmedText,
        tokenization: tokenizationParsed
    };
}