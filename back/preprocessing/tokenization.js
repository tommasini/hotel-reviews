import { nGram } from 'n-gram';

const ngram = (input, n) => {
    return nGram(n)(input);
}

module.exports = ngram;