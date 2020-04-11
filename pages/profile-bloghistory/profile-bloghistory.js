// pages/profile-bloghistory/profile-bloghistory.js
const MAX_LIMIT = 10
// const db = wx.cloud.database() /* 小程序端调数据库 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._getListByCloudFn()
  },

  //调用云函数，取出数据赋给data
  _getListByCloudFn() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'getListByOpenid',
        start: this.data.blogList.length,
        count: MAX_LIMIT
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
    })

    //小程序端调数据库
    // db.collection('blog').skip(this.data.blogList.length)
    //   .limit(MAX_LIMIT).orderBy('createTime', 'desc').get().then((res) => {
    //     console.log(res)

    // 坑，要修改date时间为string
    //     let _bloglist = res.data
    //     for (let i = 0, len = _bloglist.length; i < len; i++) {
    //       _bloglist[i].createTime = _bloglist[i].createTime.toString()
    //     }

    //     this.setData({
    //       blogList: this.data.blogList.concat(_bloglist)
    //     })
    //     wx.hideLoading()
    //   })
  },



  goComment(event) {
    wx.navigateTo({
      url: `/pages/blog-comment/blog-comment?blogId=${event.target.dataset.blogid}`,
    })
  },


  onReachBottom: function() {
    this._getListByCloudFn()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(event) {
    const blog = event.target.dataset.blog
    return {
      title: blog.content,
      path: `/pages/blog-comment/blog-comment?blogId=${blog._id}`
    }
  }
})