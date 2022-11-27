const fs = require('fs')
const path = require('path')
const sqlite3 = require('sqlite3').verbose()

class SQlite {
  constructor(dbName) {
    this.connect(dbName)
  }
  
  connect(dbName) {
    console.log('connect db')
    const filePath = path.resolve(__dirname, `./${dbName}.db`)
    console.log('filePath', filePath)
    // 是否存在
    const exist = fs.existsSync(filePath)
    // 不存在则创建
    if (!exist) {
      fs.openSync(filePath, 'w')
    }
    // 连接数据库
    this.db = new sqlite3.Database(filePath)
  }

  createTable(tableName, column) {
    const sqlite_db = this.db
    const keys = Object.keys(column)
    const items = keys.map(key => `${key} ${column[key].type}`).join(', ')
    const sql = `create table if not exists ${tableName}(${items})`
    sqlite_db.run(sql)

    return {
      insertData(item) {
        try {
          const keys = Object.keys(item)
          const data = []
          keys.forEach(k => {
            let value = item[k]
            if (typeof value === 'object') value = JSON.stringify(value)
            data.push(value)
          })

          return new Promise(res => {
            sqlite_db.run(
              `insert into ${tableName}(${keys.join(', ')}) values(${keys.map(() => '?').join(', ')})`,
              data,
              function() {
                res(this.lastID || 0)
              }
            )
          })
        } catch (e) {
          return 0
        }
      },
      insertDataList(data = []) {
        try {
          const list = data.map(item => {
            const keys = Object.keys(item)
            const temp = []
            keys.forEach(k => {
              let value = item[k]
              if (typeof value === 'object') value = JSON.stringify(value)
              temp.push(value)
            })
    
            return temp
          })
          
          const keys = Object.keys(data[0])
          sqlite_db.serialize(() => {
            const stmt = sqlite_db.prepare(`insert into ${tableName}(${keys.join(', ')}) values(${keys.map(() => '?').join(', ')})`)
            list.forEach(item => stmt.run(item))
            stmt.finalize()
          })
        } catch (e) {
          console.log(e)
        }
      },
      find(params = {}, select = []) {
        const search = Object.keys(params)
          .map(key => `${key} = ${params[key]}`)
          .join(' AND ')

        const select_list = select.join(',') || '*'

        return new Promise(reslove => {
          sqlite_db.all(`SELECT ${select_list} FROM ${tableName}${search ? ` WHERE ${search}` : ''}`, function (err, res) {
            if (!err) {
              reslove(res)
            } else {
              console.log('err', err)
              reslove(null)
            }
          })
        })
      },
      findAll() {
        return this.find()
      }
    }
  }
}

const fictionDB = new SQlite('fiction')

module.exports = {
  SQlite,
  fictionDB
}
