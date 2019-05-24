const util = require('../../utils/util.js');
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
const posts = db.collection('TPost');
const readPosts = db.collection('Read-posts');
const collectedPosts = db.collection('Collected-posts');
const thumbUpPosts = db.collection('Thumbup-posts');
const swipers = db.collection('TSwiper-post');
Page({

  data: {
    totalCount: 0
  },
  onPostTap: function(event) {
    var postId = event.currentTarget.dataset.postid; //这里的i要小写，只有连字符前的第一个字母要大写。
    var postIndex = event.currentTarget.dataset.postindex;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId + '&index=' + postIndex,
    })
  },

  onSwiperTap: function(event) {
    //target指的是当前点击的组件，currentTarget指的是事件捕获的组件
    // target这里指的是image，而currentTarget指的是swiper组件
    var postId = event.currentTarget.dataset.postid; //这里的i要小写，只有连字符前的第一个字母要大写。
    var swiperIndex = event.currentTarget.dataset.swiperindex;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId + '&index=' + swiperIndex + '&fromswiper=swiper',
    })
  },

   onLoad: function(options) {
     this.getPost();
     this.getSwiper();
    
  },

  getPost: function(options){
    posts.orderBy('_id','desc').limit(5).get().then(res => {
      this.setData({
        posts_key: res.data,
      });
      this.data.totalCount += res.data.length;
    }).then(() => {
      for (let x in this.data.posts_key) {
        let date = this.data.posts_key[x].date;
        this.data.posts_key[x].postTime = util.formatTime(date);
      }
    }).then(() => {
      this.setData({
        posts_key: this.data.posts_key,
      });
      app.globalData.posts_key = this.data.posts_key;
      //这里进行缓存是不可取的，1，缓存后数据不会被更新，难更新。阅读量，收藏量是随时都在变的。
      //2，缓存何时销毁其实很难把控。
      // try {
      //   wx.setStorageSync('posts_key', that.data.posts_key)
      //   //尝试过异步的方法了，但是不行，会出错。
      // } catch (e) {
      //   console.log('数据储存错误',e)
      // }
    }).catch(err => {
      console.log(err);
    });
  },

   getSwiper(){
     swipers.get().then(res => {
       this.setData({
         swiper_post: res.data,
       })
     }).then(() => {
       for (let x in this.data.swiper_post) {
         let date = this.data.swiper_post[x].date;
         this.data.swiper_post[x].postTime = util.formatTime(date);
       }
     }).then(() => {
       this.setData({
         swiper_post: this.data.swiper_post
       })
       app.globalData.swiper_post = this.data.swiper_post;
     }).catch(err => {
       console.log(err);
     });
  },


  onReady: function() {
    console.log('onReady!');
    //这里是用户第一次使用时，在数据库中根据用户id给用户添加几个记录。post-detail页面会用到。
    if (wx.getStorageSync('userMainInfo')) {
      readPosts.doc(app.globalData.userMainInfo.openId).get({
        fail: (err) => {
          readPosts.add({
            data: {
              _id: app.globalData.userMainInfo.openId,
              read_posts: []
            },
            fail: console.error
          })
        }
      });
      collectedPosts.doc(app.globalData.userMainInfo.openId).get({
        fail: (err) => {
          collectedPosts.add({
            data: {
              _id: app.globalData.userMainInfo.openId,
              collected_posts: []
            },
            fail: console.error
          })
        }
      });
      thumbUpPosts.doc(app.globalData.userMainInfo.openId).get({
        fail: (err) => {
          thumbUpPosts.add({
            data: {
              _id: app.globalData.userMainInfo.openId,
              thumbuped_posts: []
            },
            fail: console.error
          })
        }
      });
    } else {
      app.userMainInfoReadyCallback = res => {
        readPosts.doc(res.result.event.userInfo.openId).get({
          fail: () => {
            readPosts.add({
              data: {
                _id: res.result.event.userInfo.openId,
                read_posts: []
              },
              fail: console.error
            })
          }
        });
 
      collectedPosts.doc(res.result.event.userInfo.openId).get({
        fail: () => {
          collectedPosts.add({
            data: {
              _id: res.result.event.userInfo.openId,
              collected_posts: []
            },
            fail: console.error
          })
        }
      });
      thumbUpPosts.doc(res.result.event.userInfo.openId).get({
        fail: () => {
          thumbUpPosts.add({
            data: {
              _id: res.result.event.userInfo.openId,
              thumbuped_posts: []
            },
            fail: console.error
          })
        }
      });
      }
    }
   
  },
  
  onShow(event){
    console.log('onshow!');
    if(app.globalData.posts_key!=undefined){
      this.setData({
        posts_key: app.globalData.posts_key
      });
    }
  },

  onUnload: function(event){
    console.log(event);

  },

  onReachBottom: function() {
    console.log('Reached bottom!');
    var totalPosts = {};
    posts.orderBy('_id', 'desc').limit(2).skip(this.data.totalCount).get()
      .then(res => {
        if(res.data.length!==0){
          let newPosts = res.data;
          for (let x in newPosts) {
            let date = newPosts[x].date;
            newPosts[x].postTime = util.formatTime(date);
          }
          totalPosts = this.data.posts_key.concat(newPosts);
          this.data.totalCount += res.data.length;
        } else{
          totalPosts = this.data.posts_key;
        }
      }).then(() => {
        this.setData({
          posts_key: totalPosts,
        });
        app.globalData.posts_key = this.data.posts_key;
      }).catch(err => {
        console.log(err);
      });

  },
})