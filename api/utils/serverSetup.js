const express = require('express')
const http = require('http')
const fs = require('fs')
const { resolve } = require('path')

const ReadFictionInfo = require('./ReadFiction')
const books = require('../models/books')
const readChapter = require('../models/readChapter')

const multer = require('multer')
const upload = multer({ dest: 'upload_temp/' })

const runStart = (app, server) => {

  app.get('/books', (req, res) => {
    res.send('hello')
  })

  app.post('/book', upload.any(), async (req, res) => {
    // 设置文件的存放地址
    const des_file = resolve('./books', req.files[0].originalname)
    try {
      //从临时上传目录读取文件
      const data = fs.readFileSync(req.files[0].path, 'utf-8')
      // 写入新文件
      fs.writeFileSync(des_file, data)
      // 删除临时目录文件
      fs.unlinkSync(req.files[0].path)
      // 创建一个小说实例
      const fiction = new ReadFictionInfo()
      fiction.init(data.toString('utf-8'))
      // 小说信息
      const { name, author, chapterCount } = fiction.info
      // 保存小说详情
      const bookId = await books.insertData({
        name,
        author,
        chapterCount,
        cover: ''
      })
      // 保存小说分段章节
      readChapter.insertDataList(fiction.list.map(({ sub, content }) => ({
        bookId,
        name: sub,
        content,
        word_number: content.length
      })))
      res.send('ok')
    } catch (e) {
      console.log('err', e)
      res.send(e)
    }
  })
  
  app.get('/book/list', async (req, res) => {
    const list = await books.findAll()
    res.send({
      code: 200,
      data: list,
      msg: 'ok'
    })
  })
  app.get('/book/desc', async (req, res) => {
    const { bookId } = req.query
    const list = await books.find({ bookId })
    if (list && list.length > 0) {
      res.send({
        code: 200,
        data: list[0],
        msg: 'ok'
      })
    } else {
      res.send({
        code: 1000,
        data: {},
        msg: 'error'
      })
    }
  })
  app.get('/book/chapter/list', async (req, res) => {
    const { bookId } = req.query
    const list = await readChapter.find({ bookId }, ['chapterId', 'name', 'word_number'])
    res.send({
      code: 200,
      data: list,
      msg: 'ok'
    })
  })
  app.get('/book/chapter/detail', async (req, res) => {
    const { bookId, chapterId } = req.query
    const list = await readChapter.find({
      chapterId,
      bookId
    })
    if (list && list.length > 0) {
      res.send({
        code: 200,
        data: list[0],
        msg: 'ok'
      })
    } else {
      res.send({
        code: 1000,
        data: {},
        msg: 'error'
      })
    }
  })

  server.listen(3000, () => {
    console.log(`✅ 程序已在 3000 端口启动`)
  })
}

module.exports = function () {
  const app = express()
  const server = http.createServer(app)

  const cors = require('cors')
  app.use(cors())

  runStart(app, server)
}
