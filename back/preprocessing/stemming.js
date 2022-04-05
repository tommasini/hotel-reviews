import { stemmer } from 'stemmer';
import ngram from './tokenization.js';

export const stemmerWithSplit = (text) => {
    const arr = [];

    text.split(' ').map((word) => {
        arr.push(stemmer(word))
    })
}

export const stemmerWithNgram = (text, n) => {
    const arr = [];

    ngram(text, n).map((word) => {
        arr.push(stemmer(word))
    })
}