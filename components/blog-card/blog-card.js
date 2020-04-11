// components/blog-card/blog-card.js
import formatTime from '../../utils/formatTime.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: Object
  },

//监听时间，并利用时间戳改变
  observers: {
    ['blog.createTime'](val) {
      if (val) {
        // console.log(val)
        //new Data()获取到createTime中的时间
        const now = new Date(val)
        this.setData({
          _createTime: formatTime(now)
        })
      }
    }
  },
 
  data: {
    _createTime:''
  },

  
  methods: {
    onPreviewImage(event){
      console.log(event)
      const ds = event.target.dataset
      wx.previewImage({
        urls: this.properties.blog.img,  //ds.imgs也可以，imgs和imgsrc是我们定义的属性
        current: ds.imgsrc
      })
    }
  }
})