// pages/blog-comment/blog-comment.js
import formatTime from '../../utils/formatTime.js'
let blogId = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blog: {},
    commentList: [],
    // blogId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    blogId = options.blogId
    this._getBlogDetail(blogId)
  },

  //这里blogId传的是形参
  _getBlogDetail(blogId) {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })

    wx.cloud.callFunction({
      name: 'blog',
      data: {
        //这里blogId是云函数定义的event.blogId
        blogId,
        $url: 'detail',
      }
    }).then((res) => {
      let commentList = res.result.commentList.data
      //转换时间格式
      for (let i = 0, len = commentList.length; i < len; i++) {
        commentList[i].createTime = formatTime(new Date(commentList[i].createTime))
      }


      this.setData({
        commentList,
        blog: res.result.detail[0],
      })

      wx.hideLoading()
      console.log(res)
    })
  },

  refreshComment() {
    this._getBlogDetail(blogId)
  },

  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let blog = this.data.blog
    return {
      title: blog.content,
      path: `/pages/blog-comment/blog-comment?blogId=${blog._id}`,
      // imageUrl: ''
    }
  }
})