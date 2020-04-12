# mini-cloudMusic
基于云开发的音乐小程序

> 基于原生云音乐小程序开发，技术实现主要是：云函数，云数据库，云存储三大基础能力,目前主要是着重小程序端的展示，后期会开发对应的后台管理系统，打造一个最佳实践项目，通过这个项目也可以帮助你快速使用小程序和node.js开发一个属于你自己的小程序，此项目会持续更新，欢迎`watch`和`star`～

<hr/>


### 快速开始


> 在运行本项目前，请先确保是小程序云开发环境，具体操作见[官网指导](https://developers.weixin.qq.com/miniprogram/dev/framework/)


### 功能列表

- [x] 用户信息获取、显示
- [x] 我的动态列表
- [x] 最近播放列表
- [ ] 我的电台
- [ ] 我的收藏
- [x] 推荐歌单
- [x] 推荐电台
- [x] 歌单数据去重
- [x] 突破获取数据条数的限制
- [x] 播放数量细节处理
- [x] 云函数路由优化tcb-router
- [ ] 添加喜欢歌单列表
- [ ] 我收藏的歌单列表
- [x] 歌曲播放页面
- [x] 歌词滚动
- [x] 切换上一首/下一首
- [x] 歌词随播放进度联动
- [x] 歌词高亮显示
- [x] 进度条拖动播放
- [x] 进度条与播放时间联动
- [x] iconfont字体图标
- [x] 自动播放下一首
- [x] 发布个人动态
- [x] 上传文字、图片
- [x] 时间格式化处理
- [x] 是否授权判断
- [x] 搜索功能（用户/发表的动态）
- [x] 评论功能
- [x] 分享功能
- [x] 模板消息订阅
- [x] 生成小程序码
- [x] 统一的播放组件，方便进行切换页面后可以随时进入到播放页面

### 目录结构简要介绍

> 这里主要介绍下各级目录

```
 - cloud // 项目云函数文件
 - components // 封装的项目中可复用的组件
 - images // 项目中tabbar栏的图片
 - pages // 项目中的业务页面都在这个目录中
 - utils // 可以复用的工具方法可以放到这个目录当中，目前封装了时间格式化、让小程序支持async await写法的相关方法
 - app.js // 全局入口文件
 - app.json // 页面的配置文件
 - app.wxss // 全局样式
 - iconfont.wxss // 引入iconfont基础样式
 - project.config.json // 项目的配置文件

```

### todo

- 我的收藏
- 播放模式（随机/单曲/顺序）
- 歌手页面


### 效果图预览

> 下面简要列出几张效果图


<div align="center">
 <image width="300" src="https://i.loli.net/2020/04/12/hZFz9ijwk1ItuXQ.png"/>
 <image width="300" src="https://i.loli.net/2020/04/12/soMeym9nwxD8Bbg.png"/>
 <image width="300" src="https://i.loli.net/2020/04/12/fiOZMnjUxYy74Sc.png"/>
</div>

<div align="center">
 <image width="300" src="https://i.loli.net/2020/04/12/ImbnaD6HrTtdpsz.png"/>
 <image width="300" src="https://i.loli.net/2020/04/12/F3lrzetXGpnTZjc.png"/>
 <image width="300" src="https://i.loli.net/2020/04/12/uBsxlJ1v8PbmHAi.png"/>
</div>


### 有待完善部分

还有一些功能点以及细节都还有待进一步完善，目前先把大致主要的功能进行了下实现，当然如果发现什么问题，欢迎能够提交`issues`,发现之后我会及时进行更正,欢迎 `star` 和 `fork`，感谢大家支持🙏。
