import clean from './clean.js';
import ngram from './tokenization.js';
import { stemmerWithNgram, stemmerWithSplit } from './stemming.js';

export default (text, number) => {
    const cleanedText = clean(text);
    console.log('cleanedText', cleanedText);
    const stemmedText = stemmerWithSplit(cleanedText);
    console.log('stemmedText', stemmedText);
    const tokenization = ngram(stemmedText, number);
    console.log('tokenization', tokenization);

    return {
        cleanedText,
        stemmedText,
        tokenization
    };
}