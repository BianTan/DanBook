const fs = require('fs')

class ReadFictionInfo {
  constructor() {
    this.info = {
      name: '',
      author: '',
      chapterCount: 0
    }
    this.list = []
  }

  read(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, function(err, data) {
        if (err) reject(err)
        const content = data.toString('utf-8')
        fiction.init(content)
        resolve(true)
      })
    })
  }

  init(content) {
    this.content = content
    const matchtxt = this.content.matchAll(/序言|内容简介|第(\d|零|一|二|两|三|四|五|六|七|八|九|十|百|千|万|亿)*(卷|章|回|节).*\s/g)
    const list = []
    
    this.content.replace(/书名：(.*?)\r\n/mg, (match, p1) => {
      this.info.name = p1 || '未知'
      return match
    })
    this.content.replace(/作者：(.*?)\r\n/mg, (match, p1) => {
      this.info.author = p1 || '未知'
      return match
    })

    for (const match of matchtxt) {
      if (match[0].length < 50) {
        list.push({
          sub: match[0],
          index: match.index,
          length: match[0].length
        })
      }
    }
    this.format(list)
  }

  format(list) {
    const size = list.length

    for (let i = 0; i < size; i++) {
      const curValue = list[i]
      const nextValue = list[i + 1]
      const startIndex = curValue.index + curValue.length
      list[i].content = nextValue
        ? this.content.substr(
          startIndex,
          nextValue.index - startIndex
        )
        : this.content.substr(startIndex)
      list[i].word_number = list[i].content.length
    }
    
    this.info.chapterCount = size
    this.list = list
  }
}

module.exports = ReadFictionInfo
