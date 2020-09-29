module.exports = class Responser {
  constructor ({ success = false, data = {}, errors = '', messages = '' }) {
    this.success = success
    this.data = data
    this.errors = errors
    this.messages = messages
  }

  setSuccess ({ messages = '', data = {} }) {
    this.messages = messages
    this.data = data
    this.success = true
  }
}
