const bcrypt = require('bcrypt')
const util = require('util')

const compare = util.promisify(bcrypt.compare).bind(bcrypt)
const hash = util.promisify(bcrypt.hash).bind(bcrypt)

const hashing = async (password) => await hash(password, 10)
exports.hash = hashing
const comparator = async (plainText, hash) => await compare(plainText, hash)
exports.comparePasswords = comparator
