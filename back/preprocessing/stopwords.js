import { removeStopwords, eng } from 'stopword';

export default (input) => {
    return removeStopwords(input.split(' '), eng);
}