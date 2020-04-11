// pages/player/player.js
//歌单存储数组
let musiclist = []
//识别点击哪首歌
let nowPlayingIndex = -1
//播放音乐全局唯一背景音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: "",

    //控制播放暂停
    isPlaying: false,
    isLyricShow: false,

    // 歌词信息
    lyric: "",
    //表示是否为同一首歌
    isSame: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    nowPlayingIndex = options.index
    musiclist = wx.getStorageSync('musiclist')
    this._loadMusicDetail(options.musicid)
  },

  // 请求歌曲播放的url，point类似musicid
  _loadMusicDetail(point) {
    if (point == app.getPlayMusicId()) {
      this.setData({
        isSame: true
      })
    } else {
      backgroundAudioManager.stop()
    }
    let music = musiclist[nowPlayingIndex]
    // console.log(music)
    wx.setNavigationBarTitle({
      title: music.name
    })
    this.setData({
      picUrl: music.al.picUrl
    })

    app.setPlayMusicId(point)
    wx.cloud.callFunction({
      name: "music",
      data: {
        $url: 'musicUrl',
        musicid: point
      }
    }).then(res => {
      // console.log(JSON.parse(res.result))
      const result = JSON.parse(res.result)
      //设置权限
      if (result.data[0].url == null) {
        wx.showToast({
          title: '无权限播放',
        })
        return
      }
      if (!this.data.isSame) { //不是同一首
        //获得新歌曲各种基础信息，URL
        backgroundAudioManager.src = result.data[0].url
        backgroundAudioManager.title = music.name
        backgroundAudioManager.coverImgUrl = music.al.picUrl
        backgroundAudioManager.singer = music.ar[0].name
        backgroundAudioManager.epname = music.al.name

        // 保存播放历史
        this.savePlayHistory()
      }
      this.setData({
        isPlaying: true
      })

      //请求歌词信息
      wx.cloud.callFunction({
        name: 'music',
        data: {
          $url: 'lyric',
          musicid: point
        }
      }).then(res => {
        // console.log(res)
        let lyric = '暂无歌词'
        let lrc = JSON.parse(res.result).lrc
        if (lrc) {
          lyric = lrc.lyric
        }
        this.setData({
          lyric
        })
      })
    })
  },
  // 播放、暂停按钮 
  togglePlaying() {
    if (this.data.isPlaying) {
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },
  onPrev() {
    nowPlayingIndex--
    if (nowPlayingIndex < 0) {
      nowPlayingIndex = musiclist.length - 1
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },
  onNext() {
    nowPlayingIndex++
    if (nowPlayingIndex > musiclist.length - 1) {
      nowPlayingIndex = 0
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },

  onChangeLyricShow() {
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },
  //父组件为中介，歌词、进度联动
  timeUpdate(event) {
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },
  //面板链接组件联动
  onPlay() {
    this.setData({
      isPlaying: true
    })
  },
  onPause() {
    this.setData({
      isPlaying: false
    })
  },

  // 保存播放历史
  savePlayHistory() {
    //  当前正在播放的歌曲
    const music = musiclist[nowPlayingIndex]
    const openid = app.globalData.openid
    const history = wx.getStorageSync(openid)
    let bHave = false
    for (let i = 0, len = history.length; i < len; i++) {
      if (history[i].id == music.id) {
        bHave = true
        break
      }
    }
    if (!bHave) {
      history.unshift(music)
      wx.setStorage({
        key: openid,
        data: history,
      })
    }
  },

})