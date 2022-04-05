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
    console.log('tokenization', tokenization);

    return {
        stopWords,
        cleanedText,
        stemmedText,
        tokenization
    };
}