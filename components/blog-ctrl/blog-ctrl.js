// components/blog-ctrl/blog-ctrl.js
let userInfo = {}

const db = wx.cloud.database()

let lessonTmplId = 'kqqvI1sgFGxziCJ1SmwQAlqTJPdqsKNvmDXVil8U6Aw'

Component({

  properties: {
    blogId: String,
    blog: Object,
  },
  //父组件中也要赋值，此处是接收
  externalClasses: ['iconfont', 'icon-pinglun1', 'icon-share_icon'],
  /**
   * 组件的初始数据
   */
  data: {
    loginShow: false, //授权框显示与否
    modalShow: false, //评论框显示与否
    content: '',
  },

  methods: {

    //点击评论
    onComment(event) {
      console.log(event)
      //先判断权限
      wx.getSetting({
        success: res => {
          // console.log(res)
          // 已授权
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                // console.log(res)
                userInfo = res.userInfo
                this.setData({
                  modalShow: true
                })
              }
            })
          } else { /* 未授权 */
            this.setData({
              loginShow: true
            })
          }
        }
      })

    },

    // 允许授权方法
    onLoginsuccess(event) {
      // console.log(event)
      userInfo = event.detail
      //授权框消失，评论框显示,有前后顺序
      this.setData({
        loginShow: false
      }, () => {
        this.setData({
          modalShow: true
        })
      })
    },

    // 不允许授权方法
    onLoginfail() {
      wx.showModal({
        title: '授权用户才能评价',
        content: '',
      })
    },

    //存入评论内容
    Input(event) {
      this.setData({
        content: event.detail.value
      })
    },

    // 评价，存数据库，发送订阅
    onSend(event) {
      console.log(event)
      // 插入数据库
      // let formId = event.detail.formId
      const blogids = this.properties.blogId
      let content = this.data.content
      if (content.trim() == '') {
        wx.showModal({
          title: '评论内容不能为空',
          content: '',
        })
        return
      }
      wx.showLoading({
        title: '评论中',
        mask: true,
      })
      db.collection('blog-comment').add({
        data: {
          content,
          createTime: db.serverDate(),
          blogId: this.properties.blogId,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }
      }).then((res) => {
        wx.hideLoading()
        wx.showToast({
          title: '评论成功',
        })
        this.setData({
          modalShow: false,
          content: '',
        })

        // 父元素刷新评论页面
        this.triggerEvent('refreshCommentList')
      })

      //发送订阅消息
      wx.requestSubscribeMessage({
        // 传入订阅消息的模板id，模板 id 可在小程序管理后台申请
        tmplIds: [lessonTmplId],
        success(res) {
          // 申请订阅成功
          if (res.errMsg === 'requestSubscribeMessage:ok') {
            // 这里将订阅的课程信息调用云函数存入云开发数据
            wx.cloud.callFunction({
              name: 'sendMessage',
              data: {
                content,
                templateId: lessonTmplId,
                blogId: blogids
              }
            }).then((res) => {
              console.log(res)
            })
          }
        }
      })
    },
    
  }
})