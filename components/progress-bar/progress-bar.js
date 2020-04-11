// components/progress-bar/progress-bar.js
let movableAreaWidth = 0
let movableViewWidth = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()
let currentSec = -1 // 当前的秒数,用来优化
let duration = 0 // 当前歌曲的总时长，以秒为单位
let isMoving = false // 表示当前进度条是否在拖拽，解决：当进度条拖动时候和updatetime事件有冲突的问题
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: "00:00",
      totalTime: "00:00"
    },
    /* 已播放进度条长度 */
    movableDis: 0,
    /* 已播放进度百分比 */
    progress: 0
  },

  // 组件中的生命周期函数，写在lifetimes中，类似onshow
  lifetimes: {
    ready() {
      if (this.properties.isSame && this.data.showTime.totalTime == '00:00') {
        this._setTime()
      }
      this._getMovableDis()
      this._bindBGMEvent()
    },
  },

  methods: {
    // 拖动实现
    onChange(event) {
      // console.log(event)
      if (event.detail.source == 'touch') {
        // 这里用setData会频繁调用，卡顿
        this.data.progress = event.detail.x / (movableAreaWidth - movableViewWidth) * 100
        this.data.movableDis = event.detail.x
        isMoving = true
        // console.log('change', isMoving)
      }
    },
    // 拖动停止点，再改变播放时间
    onTouchEnd() {
      const currentTimeFmt = this._dateFormat(Math.floor(backgroundAudioManager.currentTime))
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
        ['showTime.currentTime']: currentTimeFmt.min + ':' + currentTimeFmt.sec
      })
      //改变歌曲进度
      backgroundAudioManager.seek(duration * this.data.progress / 100)
      isMoving = false
      // console.log('end', isMoving)
    },
    _getMovableDis() {
      const query = this.createSelectorQuery()
      //获取进度条宽度
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((rect) => {
        // console.log(rect)
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
        // console.log(movableAreaWidth, movableViewWidth)
      })
    },
    _bindBGMEvent() {
      backgroundAudioManager.onPlay(() => {
        isMoving = false
        this.triggerEvent('musicPlay')
      })

      backgroundAudioManager.onStop(() => {})

      backgroundAudioManager.onPause(() => {
        this.triggerEvent('musicPause')
      })

      backgroundAudioManager.onWaiting(() => {})

      //播放进度更新就会触发,实现播放分钟数改变、进度条随播放滑动功能
      backgroundAudioManager.onTimeUpdate(() => {
        // console.log('onTimeUpdate')
        if (!isMoving) {
          const currentTime = backgroundAudioManager.currentTime
          const duration = backgroundAudioManager.duration
          const sec = currentTime.toString().split('.')[0]

          //判断秒数是否变化，实现一秒变化一次，而非四次，优化加载效率
          if (sec != currentSec) {
            // console.log(currentTime)
            const currentTimeFmt = this._dateFormat(currentTime)
            this.setData({
              movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
              progress: currentTime / duration * 100,
              ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`,
            })
            currentSec = sec
            // 联动歌词
            this.triggerEvent('timeUpdate', {
              currentTime
            })
          }
        }
      })
      // 歌曲播放完后该做什么
      backgroundAudioManager.onEnded(() => {
        // console.log("onEnded")
        this.triggerEvent('musicEnd')
      })

      //监听能够播放时触发的事件
      backgroundAudioManager.onCanplay(() => {
        // console.log('onCanplay')
        //  duration为总时长，小程序自带bug需定时器延时修改
        if (typeof backgroundAudioManager.duration != 'undefined') {
          this._setTime()
        } else {
          setTimeout(() => {
            this._setTime()
          }, 1000)
        }
      })
    },

    //修改totalTime时间的方法
    _setTime() {
      //拿到时间
      duration = backgroundAudioManager.duration
      const durationFmt = this._dateFormat(duration)
      this.setData({
        ['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}` //只能拼接
      })
    },
    // 格式化时间
    _dateFormat(sec) {
      //截取分钟数和秒数
      const min = Math.floor(sec / 60)
      const s = Math.floor(sec % 60)
      return {
        'min': this._parse0(min),
        'sec': this._parse0(s),
      }
    },
    // 补零
    _parse0(sec) {
      return sec < 10 ? '0' + sec : sec
    }
  }
})