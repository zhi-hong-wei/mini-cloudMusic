// components/search/search.js
let keyword = ''
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      value: '请输入关键字'
    }
  },
  externalClasses: [
    'iconfont',
    'icon-sousuo'
  ],
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //输入值
    onInput(event) {
      keyword = event.detail.value
    },
  
  //可以在此处查询数据库，但不好，组件复用性低。
  onSearch() {
    this.triggerEvent('search', {
      keyword
    })
  }
  },
})