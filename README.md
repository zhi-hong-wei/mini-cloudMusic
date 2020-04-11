# mini-cloudMusic
基于云开发的音乐小程序

> 基于原生云音乐小程序开发，技术实现主要是：云函数，云数据库，云存储三大基础能力,目前主要是着重小程序端的展示，后期会开发对应的后台管理系统，打造一个最佳实践项目，通过这个项目也可以帮助你快速使用小程序和node.js开发一个属于你自己的小程序，此项目会持续更新，欢迎`watch`和`star`～

<hr/>


### 快速开始

#### 注意事项


```
export const baseUrl: string = 'http://localhost:3000' // 这里配置的这个url是后端服务的请求地址，示例中代表在本地启用的服务端口是3000，如果希望在真机上调试，那么就需要将后端服务部署到一个云主机上

```

> 在运行本项目前，请先确保已经全局安装了Taro，安装可见[官网指导](https://nervjs.github.io/taro/docs/GETTING-STARTED.html)

```
启动后端接口服务

git clone https://github.com/Binaryify/NeteaseCloudMusicApi.git

cd NeteaseCloudMusicApi

npm i

npm run start

接下来启动前端项目

git clone https://github.com/lsqy/taro-music.git

cd taro-music

npm i

npm run dev:weapp

```

### 功能列表

- [x] 用户登陆
- [x] 退出登陆
- [x] 我的关注列表
- [x] 我的粉丝列表
- [ ] 我的动态列表
- [x] 最近播放列表
- [ ] 我的电台
- [ ] 我的收藏
- [x] 推荐歌单
- [x] 推荐电台
- [x] 推荐电台
- [x] 我创建的歌单列表
- [x] 我收藏的歌单列表
- [x] 共用的歌单详情列表
- [x] 歌曲播放页面
- [x] 歌词滚动
- [x] 歌曲切换播放模式（随机播放/单曲循环/顺序播放）
- [x] 切换上一首/下一首
- [x] 喜欢/取消喜欢某首歌曲
- [x] 评论列表
- [x] 视频播放
- [x] 热搜列表
- [x] 搜索（包含单曲/歌单/视频/歌手/专辑/电台/用户）
- [x] 统一的播放组件，方便进行切换页面后可以随时进入到播放页面

### 目录结构简要介绍

> 这里主要介绍下`src`目录，因为开发主要是在这个目录下进行的

```
- src
 - actions // `redux`中的相关异步操作在这里进行
 - assets // 静态资源目录，这里引入了所需的图片资源，以及`fontawesome`字体图标资源
 - components // 封装的项目中可复用的组件，目前只是抽象了`CLoading`(加载效果组件)、`CLyric`(歌词组件)、`CMusic`(正在播放组件)、`CSlide`(滑块组件)、`CTitle`、`CUserListItem`
 - constants // 项目中的常量定义，目前定义了`typescript`的公共定义、`reducers`的名称定义、状态码的定义
 - pages // 项目中的业务页面都在这个目录中
 - reducers // `redux`中的相关同步操作在这里进行
 - services // 可复用的服务可以放在这个目录中，目前只是封装了接口请求的公共服务，可以根据自己项目的需要进行其他服务的扩充
 - store // redux的初始文件
 - utils // 可以复用的工具方法可以放到这个目录当中，目前封装了格式化、歌词解析的相关方法
  - decorators // 抽象的装饰器，主要为了解决在切换页面之后仍然可以继续保持播放状态，因为目前`taro`不支持全局组件
 - app.scss // 全局样式
 - app.tsx // 全局入口文件
 - base.scss // 基础样式
 - config.ts // 项目的全局配置，目前只是配置了`baseUrl`是后端服务的基准请求地址

```

### todo

- 复用的评论列表
- 搜索功能 *已完成部分功能*
- 个人主页支持跳转
- 歌手页面
- `react-hooks`重构部分功能,正在进行中

### 最近更新

- [x] 搜索功能
- [x] 视频播放
- [x] mv播放
- [x] 视频与mv中的评论列表

<div align="center">
  <image width="900" src="https://oscimg.oschina.net/oscnet/498fdfc98cc89d72196dded4f54afa29ed4.jpg"/>
</div>

### 效果图预览

> 下面简要列出几张效果图


<div align="center">
  <image width="900" src="https://oscimg.oschina.net/oscnet/f52f4448ce3475f5ecd002958ae1413a3dd.jpg"/>
</div>

<div align="center">
  <image width="900" src="https://oscimg.oschina.net/oscnet/446008d8690a962a105f839c46d7638b89b.jpg"/>
</div>

<div align="center">
  <image width="900" src="https://oscimg.oschina.net/oscnet/38e5dcac4baaca87195e95a115132cb7958.jpg"/>
</div>


### 有待完善部分

还有一些功能点以及细节都还有待进一步完善，目前先把大致主要的功能进行了下实现，当然如果发现什么问题，欢迎能够提交`issues`,发现之后我会及时进行更正,欢迎 `star` 和 `fork`，感谢大家支持🙏。
