const bcrypt = require("bcrypt"),
      util = require('util');

const compare = util.promisify(bcrypt.compare).bind(bcrypt),
      hash = util.promisify(bcrypt.hash).bind(bcrypt);

let hashing = async (password) => await hash(password, 10);
exports.hash = hashing;
let comparator = async (plainText, hash) => await compare(plainText, hash);
exports.comparePasswords = comparator;