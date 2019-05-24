# DC-demo
Developed a Classic Wechat mini-app for trainning  (front end to back end)
个人开发的小程序项目。主要有文章，音乐，电影，以及个人四大界面。
目前完成的功能有：
1.文章页面：查看文章（从后端请求HTML富文本文章，之后用rich-text组件渲染，更加贴合生产环境。效果还是不错的。后端用腾讯云开发）
  以及点赞，收藏。（评论功能将很快很快实现）
文章页面是完成了从前端到后端以及数据库整个业务逻辑。 以及结合异步网络请求，本地缓存，跨页面数据绑定来保证较好的用户体验。
2.音乐页面：根据推送的歌单展示歌单信息，加入排行榜，每日歌单，我的收藏等个性化控件。
  播放音乐，跨页面监听音乐播放状态。歌曲收藏。即将要完成歌单评论功能。
3.电影信息页面：这个界面很大一部分是根据网络上别人的博客内容来完成。主要是使用豆瓣api获取最近热映，即将上映，豆瓣top250电影三大类数据。
  实现了电影主要信息以及电影信息详情页面。
4.个人页面：包含个人头像，昵称，个人收藏，我赞过的，消息中心，设置等。(除了个人头像以及昵称，其他这几个控件都没有做完，将会在不就后实现其详情页面)

除了文章页面外的三个页面，完成的只是前段页面样式以及逻辑。用的是本地假数据。
界面用原生小程序框架来开发。当然，我也把一些能模板化的组件都模板化了。使得开发更规范。
此项目云函数并没有包含，原因一是有些函数没有很好的包装好，另外一个原因是，我这个项目打算做一个真正能用的产品。
所以有些函数是相当于起到CMS功能。所以可能会让人看不懂是干什么的。