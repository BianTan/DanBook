const { fictionDB } = require('../utils/sqlite')

const booksSchema = {
  bookId: {
    type: 'INTEGER PRIMARY KEY'
  },
  name: {
    type: 'varchar(25)'
  },
  author: {
    type: 'varchar(25)'
  },
  cover: {
    type: 'varchar(25)'
  },
  chapterCount: {
    type: 'INTEGER'
  }
}

module.exports = fictionDB.createTable('books', booksSchema)
