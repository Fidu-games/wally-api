exports.InterfaceError = class InterfaceError extends Error {
  constructor (message) {
    super()
    this.message = message
    this.errorType = 'InterfaceError'
  }

  toString () {
    return `${this.errorType}: while performing request`
  }
}
