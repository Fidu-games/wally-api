module.exports = class Responser {
  constructor () {
    this.success = false
    this.data = {}
    this.errors = ''
    this.messages = ''
  }

  setSuccess ({ messages = '', data = {} }) {
    this.messages = messages
    this.data = data
    this.success = true
  }
}
