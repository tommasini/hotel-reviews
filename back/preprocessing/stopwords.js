const { removeStopwords, eng } = require('stopword')

const removeStopwordsfromInput = (input) => {
    return removeStopwords(input, eng);
}

module.exports = removeStopwordsfromInput;