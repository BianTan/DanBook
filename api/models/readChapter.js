const { fictionDB } = require('../utils/sqlite')

const readChapterSchema = {
  chapterId: {
    type: 'INTEGER PRIMARY KEY'
  },
  bookId: {
    type: 'INTEGER'
  },
  name: {
    type: 'varchar(25)'
  },
  content: {
    type: 'varchar(25)'
  },
  word_number: {
    type: 'INTEGER'
  }
}

module.exports = fictionDB.createTable('read_chapter', readChapterSchema)
