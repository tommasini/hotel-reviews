import { stemmer } from 'stemmer';
import ngram from './tokenization.js';

export const stemmerWithSplit = (text) => {
    return text.replace(/ +(?= )/g, '').split(' ').map((word) => {
        return stemmer(word)
    });
}

export const stemmerWithNgram = (text, n) => {
    return nGram(text, n).map((word) => {
        return stemmer(word)
    });
}