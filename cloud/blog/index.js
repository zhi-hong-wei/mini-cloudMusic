// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const TcbRouter = require('tcb-router')

const db = cloud.database()

const blogCollection = db.collection('blog')

const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async(event, context) => {
  const app = new TcbRouter({
    event
  })

  app.router('list', async(ctx, next) => {
    //模糊查询
    const keyword = event.keyword
    let w = {}
    if (keyword.trim() != '') {
      w = {
        // 对变量的正则表达式查询
        content: new db.RegExp({
          regexp: keyword,
          options: 'i' /* i不区分大小写 */
        })
      }
    }

    //where（w）代表查询，w是对象
    let blogList = await blogCollection.where(w).skip(event.start).limit(event.count)
      .orderBy('createTime', 'desc').get().then((res) => {
        return res.data
      })

    ctx.body = blogList
  })

  // 进入评论页获取数据
  app.router('detail', async(ctx, next) => {
    let blogId = event.blogId
    // 详情查询
    let detail = await blogCollection.where({
      _id: blogId
    }).get().then((res) => {
      console.log(res)
      return res.data
    })
    // 评论查询
    // 获取数据库评论数量，返回对象
    const countResult = await blogCollection.count()
    // 返回num数量
    const total = countResult.total
    let commentList = {
      data: []
    }
    if (total > 0) {
      const batchTimes = Math.ceil(total / MAX_LIMIT)
      const tasks = []  //存放promise对象，后面调用promise.all
      for (let i = 0; i < batchTimes; i++) {
        let promise = db.collection('blog-comment').skip(i * MAX_LIMIT)
          .limit(MAX_LIMIT).where({
            blogId
          }).orderBy('createTime', 'desc').get()
        tasks.push(promise)
      }
      if (tasks.length > 0) {
        commentList = (await Promise.all(tasks)).reduce((acc, cur) => {
          return {
            data: acc.data.concat(cur.data)
          }
        })
      }

    }

    ctx.body = {
      commentList,
      detail,
    }

  })

//我的发现页面，查询云数据库
  const wxContext = cloud.getWXContext()  /* 获得openID */
  app.router('getListByOpenid', async (ctx, next) => {
    ctx.body = await blogCollection.where({
      _openid: wxContext.OPENID
    }).skip(event.start).limit(event.count)
      .orderBy('createTime', 'desc').get().then((res) => {
        return res.data
      })
  })


  return app.serve()
}