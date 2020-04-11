// pages/blog/blog.js
let keyword = ''  /* 多个方法中使用 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //控制底部授权显示与否
    modalShow: false,
    blogList: []
  },

  onLoad: function(options) {
    this._loadBlogList()
  },

  //调云函数取数据
  _loadBlogList(start = 0) {
    wx.showLoading({
      title: '拼命加载中',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'list',
        keyword,
        start,
        count: 10,
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
      //下拉刷新后，自动停止刷新
      wx.stopPullDownRefresh()
    })
  },

//模糊查询，主要查询方法在blog云函数中
  onSearch(event) {
    console.log(event)
    //新结果展示要清空列表
    this.setData({
      blogList:[]
    })
    keyword = event.detail.keyword
    this._loadBlogList(0)
  },

  //点击发布
  onPublish() {
    // 是否授权
    wx.getSetting({
      success: res => {
        // console.log(res)
        // 已授权
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              // console.log(res)
              //获取成功授权后，用户信息
              this.onLoginSuccess({
                detail: res.userInfo
              })
            }
          })
        } else { /* 未授权 */
          this.setData({
            modalShow: true
          })
        }
      }
    })

  },
  // 允许授权方法
  onLoginSuccess(event) {
    console.log(event)
    const detail = event.detail
    wx.navigateTo({
      url: `/pages/blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },
  // 不允许授权方法
  onLoginFail() {
    wx.showModal({
      title: '授权用户才能发布',
      content: '',
    })
  },

  onReachBottom: function() {
    this._loadBlogList(this.data.blogList.length)
  },

  onPullDownRefresh: function() {
    this.setData({
      blogList: []
    })
    this._loadBlogList(0)
  },

  // 点击进入评论,传参数
  goComment(event) {
    console.log(event)
    wx.navigateTo({
      url: `/pages/blog-comment/blog-comment?blogId=${event.target.dataset.blogid}`,
    })
  },

  onShareAppMessage: function (event) {
    console.log(event)
    let blogObj = event.target.dataset.blog
    return {
      title: blogObj.content,
      path: `/pages/blog-comment/blog-comment?blogId=${blogObj._id}`,
      // imageUrl: ''
    }
  }

})
