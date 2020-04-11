// components/bottom/bottom.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalShow:Boolean
  },
  options: {
    // 开启引用样式
    styleIsolation: 'apply-shared',
    // 开启多个插槽使用
    multipleSlots:true
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose(){
      this.setData({
        modalShow:false
      })
    }
  }
})
