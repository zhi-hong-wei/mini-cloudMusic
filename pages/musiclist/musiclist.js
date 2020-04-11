// pages/musiclist/musiclist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [],
    listInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    wx.showLoading({
      title: '加载中',
    })
    // 请求歌曲列表
    wx.cloud.callFunction({
      name: "music",
      data: {
        playlistId: options.playlistId,
        $url: 'musiclist'
      }
    }).then(res => {
      console.log(res)
      const pl = res.result.playlist
      this.setData({
        musiclist: pl.tracks,
        listInfo: {
          coverImgUrl: pl.coverImgUrl,
          name: pl.name
        }
      })
      //储存本地，用于播放
      this._setStorage()
      wx.hideLoading()
    })

  },

  _setStorage(){
    wx.setStorageSync('musiclist', this.data.musiclist)
  }
})
