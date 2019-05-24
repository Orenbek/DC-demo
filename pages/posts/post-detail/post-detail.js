const util = require('../../../utils/util.js');
var app = getApp();
const db = wx.cloud.database({
  env: 'test-env-57b34f'
});
const _ = db.command;
const posts = db.collection('TPost');
const collectedPosts = db.collection('Collected-posts');
const thumbUpPosts = db.collection('Thumbup-posts');
const swipers = db.collection('TSwiper-post');
const readPosts = db.collection('Read-posts');
Page({

  onItemTap: function(event) {
    let item = event.currentTarget.dataset.item;
    let postId = this.data.currentPostId;
    let index = this.data.currentIndex;
    let fromSwiper = this.data.fromSwiper;
    let itemData = wx.getStorageSync(item);
    itemData = new Map(itemData);
    let collectOrThumb = itemData.get(postId);
    collectOrThumb = !collectOrThumb;

    itemData.set(postId, collectOrThumb);
    let array = [...itemData];
    wx.setStorageSync(item, array);
    if (item ==='thumbuped_posts'){
      this.setData({
        thumbUped: collectOrThumb
      });
      if (collectOrThumb) {
        this.updateItem('thumbup', 'inc');
        //更新Post数据库
        thumbUpPosts.doc(app.globalData.userMainInfo.openId)
          .update({ data: { thumbuped_posts: _.push(postId) } })
          .catch(console.error);
        if(fromSwiper!==undefined){
          app.globalData.swiper_post[index].thumb_up += 1;
        } else{
          app.globalData.posts_key[index].thumb_up += 1;
        }
        
      } else {
        util.removeFromCollection('Thumbup-posts', app.globalData.userMainInfo.openId, item, postId);
        this.updateItem('thumbup', 'dec');
        if(fromSwiper!==undefined){
          app.globalData.swiper_post[index].thumb_up -= 1;
        } else{
          app.globalData.posts_key[index].thumb_up -= 1;
        }
       
      }
      wx.showToast({
        title: collectOrThumb ? "点赞成功" : "取消成功",
      });
    } else if (item ==='collected_posts'){
      this.setData({
        collected: collectOrThumb
      });
      if (collectOrThumb){
        this.updateItem('collect', 'inc');
        collectedPosts.doc(app.globalData.userMainInfo.openId)
        .update({data: {collected_posts: _.push(postId)}})
        .catch(console.error);
        if(fromSwiper!==undefined){
          app.globalData.swiper_post[index].collected += 1;
        } else{
          app.globalData.posts_key[index].collected += 1;
        }

      } else{
        util.removeFromCollection('Collected-posts', app.globalData.userMainInfo.openId, item, postId);
        this.updateItem('collect', 'dec');
        if(fromSwiper!==undefined){
          app.globalData.swiper_post[index].collected -= 1;
        } else{
          app.globalData.posts_key[index].collected -= 1;
        }
        
      }
      wx.showToast({
        title: collectOrThumb ? "收藏成功" : "取消成功",
      })
    }
    this.setData({
      postData: app.globalData.posts_key[index]
    });
    //特别注意的是，postData是posts_key[index]下的数据。
  },

  onShareTap: function(event) {
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function(res) {
        // res.cancel 用户是不是点击了取消按钮
        // res.tapIndex 数组元素的序号，从0开始
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: "用户是否取消？" + res.cancel + '现在还不能实现分享功能，什么时候才能支持呢?',
        })
      }
    })
  },
//小程序已经支持Promise函数了，但是我用过了，用不对，还是菜。
  onLoad: function(options) {
    console.log('onloading')
    let postId = parseInt(options.id);
    let index = parseInt(options.index);
    let fromSwiper = options.fromswiper;
    this.data.currentPostId = postId;
    this.data.currentIndex = index;
    this.data.fromSwiper = fromSwiper;
    this.checkAndGet(postId, index, fromSwiper);
    this.readOrNot(index,fromSwiper);
    this.collectedOrThumbUp();
  },
  
  checkAndGet(postId, index, fromSwiper) {
      if (fromSwiper === 'swiper') {
        this.data.postData = app.globalData.swiper_post[index];
        this.setData({
          postData: app.globalData.swiper_post[index]
        })
      } else if (fromSwiper == undefined) {
        this.data.postData = app.globalData.posts_key[index];
        this.setData({
          postData: app.globalData.posts_key[index]
        })
      }

      wx.request({
        url: this.data.postData.content_src,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: res => {
          let postContent = res.data.replace(/\<img/gi, '<img style="width:100%;height:auto" ')
          this.setData({
            postContent: postContent
          });
        },
        error: err => {
          console.log(err)
        }
      });
      
  },

  readOrNot: function (index,fromSwiper) {
      let postId = this.data.currentPostId;
      wx.getStorage({
        key: 'read_posts',
        success: res => {
          let read_posts = res.data;
          let a = read_posts.indexOf(postId);
          if (a < 0) {
            read_posts.push(postId);
            wx.setStorage({
              key: 'read_posts',
              data: read_posts,
            });
            this.readOrNot_a(fromSwiper);
          }
          //这里先判断一下当前postId有没有被写进read_posts缓存数组中
        },
        fail: err => {
          wx.setStorage({
            key: 'read_posts',
            data: [postId],
          });
          this.readOrNot_a(fromSwiper);
        }
      });
  },

  readOrNot_a(fromSwiper){
    let index = this.data.currentIndex;
    let postId = this.data.currentPostId;
    //阅读后产生的阅读量进行本地绑定。
    if (fromSwiper === undefined) {
      app.globalData.posts_key[index].read += 1;
      this.setData({
        postData: app.globalData.posts_key[index]
      })
    } else if (fromSwiper === 'swiper') {
      app.globalData.swiper_post[index].read += 1;
      this.setData({
        postData: app.globalData.swiper_post[index]
      })
    }
    this.updateItem('read');
    // this.data.postData.read +=1;
    // this.setData({postData: this.data.postData});
    //这里由于上一个函数postData是异步绑定，而且是绑定的全局值，下面全局值已经加了一，然后postData又加一，所以会出现多加一位。
    //反正这步要是想不明白就很复杂。解决这种多个值互相绑定，并且进行异步操作过程当中多次赋值问题。我总结最有效的方法是总是修改一个
    //之后，别的值都绑定这个的值。我在这里每次postData都绑定全局的值，而不再是postData绑定postData。
    readPosts.doc(app.globalData.userMainInfo.openId).update({
      data: {
        read_posts: _.push(postId)
      }
    }).catch(console.error);
  },

  collectedOrThumbUp(){
    let postId = this.data.currentPostId;
    wx.getStorage({
      key: 'collected_posts',
      success: res => {
        let collectedPosts = new Map(res.data);
        if(!collectedPosts.has(postId)){
          collectedPosts.set(postId,false)
        }
        this.setData({
          collected: collectedPosts.get(postId)
        });
        let collected = [...collectedPosts];
        wx.setStorageSync('collected_posts', collected);
      },
      fail: err => {
        collectedPosts.doc(app.globalData.userMainInfo.openId).get().then(res => {
          let collectedPosts = new Set(res.data.collected_posts);
          if (!collectedPosts.has(postId)) {
            this.setData({ collected: false })
          } else{
            this.setData({ collected: true })
          }
          var collectedPs = new Map();
          collectedPosts.forEach((val, key, set) => {
            collectedPs.set(val,true);
          })
          let collectedPm = [...collectedPs];
          wx.setStorage({
            key: 'collected_posts',
            data: collectedPm,
          });
        });
      }

    });
    wx.getStorage({
      key: 'thumbuped_posts',
      success: res => {
        let thumbUpedPosts = new Map(res.data);
        if (!thumbUpedPosts.has(postId)) {
          thumbUpedPosts.set(postId, false)
        }
        this.setData({
          thumbUped: thumbUpedPosts.get(postId)
        });
        let thumbUp = [...thumbUpedPosts];
        wx.setStorageSync('thumbuped_posts', thumbUp);
      },
      fail: err => {
        thumbUpPosts.doc(app.globalData.userMainInfo.openId).get().then(res => {
          let thumbupPosts = new Set(res.data.thumbuped_posts);
          if (!thumbupPosts.has(postId)) {
            this.setData({ thumbUped: false })
          } else {
            this.setData({ thumbUped: true })
          }
          var thumbupPs = new Map();
          thumbupPosts.forEach((val, key, set) => {
            thumbupPs.set(val, true);
          })
          let thumbupPm = [...thumbupPs];
          wx.setStorage({
            key: 'thumbuped_posts',
            data: thumbupPm,
          });
        });
      }

    });
  },

  updateItem: function (item,incORdec) {
    wx.cloud.callFunction({
      name: 'postFn',
      data: {
        postId: this.data.currentPostId,
        item: item,
        incORdec: incORdec
      }
    }).catch(console.error)
  },

  onReady: function(event) {
    wx.setNavigationBarTitle({
      title: this.data.postData.title,
      fail: console.error
    });
  }

})