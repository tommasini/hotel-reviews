import { nGram } from 'n-gram';

export default (input, n) => {
    return nGram(n)(input);
}