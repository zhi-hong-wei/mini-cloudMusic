const db = wx.cloud.database()
const MAX_LIMIT = 15
Page({
  data: {
    imgurl: [],
    playlist: []
  },

  onLoad: function(options) {
    console.log(options.scene)  //获取通过扫小程序码进入程序的用户信息
    this._getplaylist()
    this._getswiper()
  },

  //加下划线表示私有函数，在此文件有作用
  _getplaylist() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: "music",
      data: {
        start: this.data.playlist.length,
        count: MAX_LIMIT,
        $url: 'playlist'
      }
    }).then(res => {
      // console.log(res)
      this.setData({
        playlist: this.data.playlist.concat(res.result.data)
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  },
  onReachBottom: function() {
    this._getplaylist()
  },
  onPullDownRefresh: function() {
    this.setData({
      playlist: []
    })
    this._getplaylist()
    this._getswiper()
  },
  _getswiper() {  
    db.collection('swiper').get().then(res => {
      // console.log(res)
      this.setData({
        imgurl:res.data
      })
    })
  },

 


})