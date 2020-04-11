// components/play-list/play-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist: {
      type: Object
    },
   
  },
  observers: {
    ['playlist.playCount'](val) {
      // console.log(val)
      this.setData({
        _count: this._transNum(val, 2)
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _count: 0,

  },

  /**
   * 组件的方法列表
   */
  methods: {
    _transNum(num, point) {
      let numStr = num.toString().split('.')[0]
      if (numStr.length < 6) {
        return numStr
      } else if (numStr.length >= 6 && numStr.length <= 8) {
        // subString第一个数是开始取得位置，第二个是结束的位置,point是小数点位数
        let decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point)
        return parseFloat(parseInt(num / 10000) + '.' + decimal) + '万'
      } else {
        let decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point)
        return parseFloat(parseInt(num / 100000000) + '.' + decimal) + '亿'
      }
    },
    goToMusiclist(){
      wx.navigateTo({
        url: `/pages/musiclist/musiclist?playlistId=${this.properties.playlist.id}`,
      })
    }
  },
  
})