import { removeStopwords, eng } from 'stopword';

export default removeStopwordsfromInput = (input) => {
    return removeStopwords(input, eng);
}