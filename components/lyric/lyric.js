// components/lyric/lyric.js
let lyricHeight = 0 //每行歌词高度，要换算成px
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow: {
      type: Boolean,
      value: false
    },
    lyric: String,
  },

  //对歌词的监听
  observers: {
    lyric(e) {
      // e中包含时间和歌词
      console.log(e)
      if (e == '暂无歌词') {
        this.setData({
          lyricList: [{
            lrc: e,
            time: 0
          }],
          plyricIndex: -1
        })
      } else {
        this.analysisLyric(e)
      }
    }
  },

  data: {
    lyricList: [],

    // 当前选中的歌词的索引
    plyricIndex: 0,
    // 滚动条滚动的高度
    scrollTop: 0,
  },
  //生命周期函数，onshow
  lifetimes: {
    ready() {
      wx.getSystemInfo({
        success(res) {
          // console.log(res)
          // 求出1rpx的大小,64rpx是自己在xss中定义的每行高度，750rpx是每个手机宽度
          lyricHeight = res.screenWidth / 750 * 64
        },
      })
    }
  },
  methods: {
    // 解析歌词，正则匹配，拿到每句歌词和时间
    analysisLyric(Slyric) {
      let line = Slyric.split('\n')
      let _lyricList = []
      //逐行解析
      line.forEach((elem) => {
        // 匹配 [00:00:000]
        let time = elem.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        // console.log(time)
        // 获取到的时间是个只有一个值的数组['x']，开始请求会为null，所以需要以下判断
        if (time != null) {
          // 拿到具体每行歌词
          let lrc = elem.split(time)[1]
          // 拿到具体时间00:00:000,取time数组的第一个字符串，也是唯一一个，见41行打印
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          let second = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
          _lyricList.push({
            lrc,
            time: second,
          })
        }
      })
      this.setData({
        lyricList: _lyricList
      })
    },
    // 歌词进度联动效果
    update(currentTime) {
      //注意L大小写
      let lyriclist = this.data.lyricList
      //没有歌词时
      if (lyriclist.length == 0) {
        return
      }
      //歌曲唱完后，滚动到底部且没有歌词高亮
      if (currentTime > lyriclist[lyriclist.length - 1].time) {
        if (this.data.plyricIndex != -1) {
          this.setData({
            plyricIndex: -1,
            scrollTop: (lyriclist.length) * lyricHeight
          })
        }
      }
      // 歌词、进度联动效果
      for (let i = 0, len = lyriclist.length; i < len; i++) {
        if (currentTime <= lyriclist[i].time) {
          this.setData({
            plyricIndex: i - 1,
            scrollTop: (i - 1) * lyricHeight
          })
          break
        }
      }
    }
  }
})