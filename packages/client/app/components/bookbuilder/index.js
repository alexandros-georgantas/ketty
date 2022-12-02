const BookBuilder = require('./src/BookBuilder')

module.exports = {
  frontend: {
    components: [() => BookBuilder],
  },
}
