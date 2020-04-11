// components/musiclist/musiclist.js
const app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: {
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    playid: -1
  },
  //组件的page生命周期函数
  pageLifetimes: {
    show() {
      this.setData({
        playid: parseInt(app.getPlayMusicId())
      })

    }
  },
 
  methods: {
    onSelect(event) {
      console.log(event)
      const e = event.currentTarget.dataset
      const musicid = e.musicid
      this.setData({
        playid: musicid
      })
      wx.navigateTo({
        url: `/pages/player/player?musicid=${musicid}&index=${e.index}`,
      })
    }
  }
})