// pages/blog-edit/blog-edit.js
const MAX_WORDS_NUM = 140 //文字最大字数
const MAX_IMG_NUM = 9 //图片最大数
const db = wx.cloud.database()
let content = '' //文字内容，传数据库用
let userInfo={}  //存昵称头像到数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0,
    selectPhoto: true,
    footerBottom: 0, //底部随键盘收起和弹出而改变位置
    images: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    //options有blog中的nickName,avatarUrl属性
    userInfo=options
  },

  // 限制字数
  onInput(event) {
    console.log(event)
    let wordsNum = event.detail.value.length
    if (wordsNum >= MAX_WORDS_NUM) {
      wordsNum = `最大字数为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum
    })
    content = event.detail.value
  },

  //选择图片
  onChooseImage() {
    //还能选择几张
    let max = MAX_IMG_NUM - this.data.images.length
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log(res)
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        //选完后还能选几张
        max = MAX_IMG_NUM - this.data.images.length
        if (max <= 0) {
          this.setData({
            selectPhoto: false
          })
        }
      },
    })
  },

  //删除图片
  onDelImage(index) {
    console.log(index)
    //const和let都不可以定义，splice是另一个方法了
    var index = index.currentTarget.dataset.index
    //js数组删除方法，返回值是新的数组
    this.data.images.splice(index, 1)
    this.setData({
      images: this.data.images
    })
    if (this.data.images.length == MAX_IMG_NUM - 1) {
      this.setData({
        selectPhoto: true
      })
    }
  },

  // 阅览图片
  onPreviewImage(event) {
    console.log(event)
    wx.previewImage({
      urls: this.data.images,
      current: event.target.dataset.imgsrc
    })
  },

  // 底部bottom位置改变
  onFocus(event) {
    console.log(event)
    this.setData({
      footerBottom: event.detail.height
    })
  },
  onBlur() {
    this.setData({
      footerBottom: 0
    })
  },

  //发布，传到云存储,是异步的，promise解决
  send() {
    // 文字不能为空，trim去空格方法
    if (content.trim() === '') {
      wx.showModal({
        title: '请输入内容',
        content: '',
      })
      return
    }
    wx.showLoading({
      title: '发布中',
      mask:true  //有一层朦板，无法点击
    })
    let promiseArr = []
    let fileId = []
    //循环遍历。上传所有图片
    for (let i = 0; i < this.data.images.length; i++) {
      //promise每次会返回一个promise对象
      let p = new Promise((resolve, reject) => {
        let item = this.data.images[i]

        //取到文件结尾扩展名
        let suffix = /\.\w+$/.exec(item)[0]
        //每次上传一张
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 1000000 + suffix,
          filePath: item, // 文件路径
          success: res => {
            // get resource ID
            console.log(res.fileID)
            fileId = fileId.concat(res.fileID)  //fileId.push不可以，每次fileid是个数组形式
            resolve()
          },
          fail: err => {
            reject()
          }
        })
      })
      promiseArr.push(p)
    }
    // 上传云数据库
    Promise.all(promiseArr).then(res => {
      db.collection('blog').add({
        data:{
          //扩展运算符，取到对象每个属性
          ...userInfo,
          content,
          img: fileId,
          createTime: db.serverDate()  //取得是服务端的时间
        }
      }).then(res=>{
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
        })
        // 返回博客界面，并刷新列表
        wx.navigateBack()

        // 子组件调用父组件方法
        const pages = getCurrentPages()
        // console.log(pages)
        // 取到上一个页面
        const prevPage = pages[pages.length - 2]
        prevPage.onPullDownRefresh()
      }).catch(err=>{
        wx.hideLoading()
        wx.showToast({
          title: '发布失败',
        })
      })
    })
  },

  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})