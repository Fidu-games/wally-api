/**
 * genRandomNumber.
 * @param {Number} limit - the limit of the num generation, always goes
 * from 0 to limit. Example: if limit = 20, the range is 0 to 20 and will return
 * a random number inside that range of numbers.
 */
exports.genRandomNumber = limit => Math.floor(Math.random() * limit);

/**
 * genRandomKey
 * @param {Number} [size = 6] - the size of the random key.
 */
exports.genRandomKey = (size  = 6) => {
    let letters = ['A', 'B', 'C', 'D', 'E', 'F'],
        digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        elements = [letters, digits];
    let key = '', randomElementList, generated = 0;

    while(generated <= size) {
        randomElementList = elements[exports.genRandomNumber(elements.length)];
        key += randomElementList[exports.genRandomNumber(randomElementList.length)];
        generated++;
    }

    return key;
}