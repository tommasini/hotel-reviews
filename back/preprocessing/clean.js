const toLowerCase = (input) => {
    return input.toLowerCase();
}

const trim = (input) => {
    return input.trim();
}

const removeSpecialCharactersAndNumbers = (input) => {
    return input.replace(/[^a-z ]/g, '');
}

const cleanInput = (input) => {
    return removeSpecialCharactersAndNumbers(trim(toLowerCase(input)));
}

module.exports = cleanInput;