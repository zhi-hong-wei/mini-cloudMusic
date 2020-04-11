//app.js
App({
  onLaunch: function() {
    this.checkUpate()
    wx.cloud.init({
      env: "dazhi-ukbsv",
      traceUser: true
    })

    this.getOpenid()

    this.globalData = {
      playingMusicId: -1,
      openid: -1
    }
  },

  setPlayMusicId(musicid) {
    this.globalData.playingMusicId = musicid
  },

  getPlayMusicId() {
    return this.globalData.playingMusicId
  },

  //获取openID
  getOpenid() {
    wx.cloud.callFunction({
      name: 'login'
    }).then((res) => {
      // console.log(res)
      const openid = res.result.openid
      this.globalData.openid = openid
      // 存储在本地，两个参数，第一个是要存储的内容，第二个是数组容器
      if (wx.getStorageSync(openid) == '') {
        wx.setStorageSync(openid, [])
      }
    })
  },

  //小程序更新机制
  checkUpate() {
    const updateManager = wx.getUpdateManager()
    // onCheckForUpdate事件检测版本更新,事件处理函数里完成更新
    updateManager.onCheckForUpdate((res) => {
      if (res.hasUpdate) {
        //坚挺是否成功
        updateManager.onUpdateReady(() => {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用',
            success(res) {
              if (res.confirm) {
                updateManager.applyUpdate()
              }
            }
          })
        })
      }
    })
  },
})