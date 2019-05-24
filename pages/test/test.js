const util = require('../../utils/util.js');
const db = wx.cloud.database({
  env: 'test-env-57b34f'
});
const posts = db.collection('TPost');
const _ = db.command;
const app = getApp();
//刚开始数据库访问失败  找不到原因何在，最后发现原来是数据库权限没有设置！ 数据库权限务必要设置正确！！！
const del = 'del';
Page({
  data: {
    index: 1
  },
  onLoad: function(options) {
    if (wx.getStorageSync('userMainInfo')) {
      console.log('已经获取到userMainInfo')
      this.setData({
        userMainInfo: wx.getStorageSync('userMainInfo'),
        hasUserMainInfo: true
      })
    } else{
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userMainInfoReadyCallback = res => {
        console.log('没呢，会在回调函数中返回userMainInfo',res)
        this.setData({
          userMainInfo: res.result.event.userInfo,
          hasUserMainInfo: true
        })
      }
    }

    if (wx.getStorageSync('userInfo')) {
      console.log('已经获取到userInfo')
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        hasUserInfo: true
      })
    } else{
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log('没呢，会在回调函数中返回userInfo', res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    }

    console.log('mainInfo 是 ',app.globalData.userMainInfo,'userInfo是 ',app.globalData.userInfo);
  },

  onDelete: function(){
    wx.cloud.callFunction({
      name: 'dateOrDelete',
      data: {del: del}
      // 传递给云函数的event参数
    }).then((res) => {
      console.log('这是正确信息')
      console.log(res)
    }).catch((err) => {
      console.log('这是错误信息')
      throw err;
    })
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/pages/test/test？id=123456',//开头带/的完整路径，可以带参数
      imageUrl: '/images/icon/myspace.png'
    }
  },
  getPost: function(event){
    if(this.data.index===6) this.data.index = 1;
    wx.request({
      url: 'http://mini.cn/' + this.data.index+ '.html',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
        //重点是这句话 res.content是从后台获取的数据 进行正则匹配的
        let html = res.data.replace(/\<img/gi, '<img style="width:100%;height:auto" ')
        this.setData({
          html: html
        });
      }
    });
    this.data.index +=1;
  },
  getUserInfo: function(result){
    console.log(app.globalData.userMainInfo, app.globalData.userInfo);
    console.log(result.detail.userInfo);
    if(result.detail.userInfo===undefined){
      console.log('获取授权失败。')
    }
  },
  rrr: function(event){
    db.collection('TPost').doc(1).get().then(res => {
      console.log(res);
      return ['hellooooo',123]
      }).then(res=>console.log(res)).catch(console.error)

  },
  testMap(options){
    var m = new Map();
    var s = new Set();
    s.add(1).add(5).add(33).add(5);
    m.set(1, true).set(23, true).set(7,false).set(1, 'false');
    let array = [...s];
    let array1 = [...m];
    // db.collection('Collected-posts').doc(app.globalData.userMainInfo.openId).update({
    //   data:{
    //     collected_posts: array1
    //   }
    // }).then(res=>console.log(res));
    // db.collection('Collected-posts').add({
    //   data:{
    //     _id: app.globalData.userMainInfo.openId,
    //     collected_posts: array1
    //   }
    // }).then(res => console.log(res));
    db.collection('Collected-posts').doc(app.globalData.userMainInfo.openId).get().then(res => console.log(res.data))
    // util.mapToArray();
    console.log(s,array,m,array1);
    // wx.setStorage({
    //   key: 'sets',
    //   data: s,
    //   fail: err => console.error
    // });
    // wx.getStorage({
    //   key: 'sets',
    //   success: function(res) {
    //     let s = res.data;
    //     console.log(res);
    //     s.forEach((val, key, set) => {
    //       console.log("set[" + key + "] = " + val)
    //     })
    //   },
    // });

  },
})