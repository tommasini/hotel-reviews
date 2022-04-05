const { stemmer } = require('stemmer');
const nGram = require('./tokenization');

const stemmerWithSplit = (text) => {
    const arr = [];

    text.split(' ').map((word) => {
        arr.push(stemmer(word))
    })
}

const stemmerWithNgram = (text, n) => {
    const arr = [];

    nGram(text, n).map((word) => {
        arr.push(stemmer(word))
    })
}

module.exports.stemmerWithSplit = stemmerWithSplit;
module.exports.stemmerWithNgram = stemmerWithNgram;