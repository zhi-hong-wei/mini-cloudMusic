// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

var rp = require('request-promise');

const db = cloud.database()


const playbase = db.collection('playlist')

const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async(event, context) => {
  // let list = await db.collection('playlist').get()

  //突破云函数获取数据量限制
  //count()返回的是对象,.total获得总数据量
  let total = playbase.count().total
  let batchTimes = Math.ceil(total / MAX_LIMIT) /* 查询次数 */
  let tasks = []
  for (let i = 0; i < batchTimes.length; i++) {
    let promise = playbase.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  let list = {
    data: []
  }
  if (tasks.length > 0) {
    list = (await promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }

  //请求数据
  let playlist = await rp(URL).then((res) => {
    return JSON.parse(res).result
  })
  // console.log(playlist)

  // 去重复处理
  const newData = []
  let len = playlist.length
  let lenlist = list.data.length //list.data记住
  for (let i = 0; i < len; i++) {
    let flag = true
    for (let j = 0; j < lenlist; j++) {
      if (playlist[i].id === list.data[j].id) {
        flag = false
        break
      }
    }
    if (flag) {
      newData.push(playlist[i])
    }
  }

  // 歌单列表插入数据库中
  for (let i = 0; i < newData.length; i++) {
    await db.collection('playlist').add({
      data: {
        ...newData[i],
        createTime: db.serverDate(),
      }
    }).then(res => {
      console.log('插入成功')
    }).catch(err => {
      console.log(err)
    })
  }

  return newData.length
}