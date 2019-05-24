// pages/music/music-detail/music-detail.js
var app = getApp();
var albumsData = require('../../../data/music-data.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: false,
    collectedMusic: false,
    controllerTaped: false,
    dataUrl: 'http://zhangmenshiting.qianqian.com/data2/music/e074ba1715ef173bd7ae96c4c2349caa/605017284/605017284.mp3?xcode=5b325d0ff8c099c09d88bb873c3ec0e5',
    songTitle: 'LostStar-Adam Levine',
    coverImgUrl: 'http://imge.kugou.com/stdmusic/240/20150718/20150718033819377218.jpg'
  },

  onPlayStopTap: function(event) {
    var isPlayingMusic = app.globalData.g_isPlayingMusic;
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      });
    } else {
      wx.playBackgroundAudio({
        dataUrl: this.data.dataUrl,
        title: this.data.songTitle,
        coverImgUrl: this.data.coverImgUrl
      });
      this.setData({
        isPlayingMusic: true
      });
    }
    app.globalData.g_isPlayingMusic = this.data.isPlayingMusic;

  },

  onCollectionTap: function(event) {
    var albumsCollected = wx.getStorageSync('albums_collected');
    var albumCollected = albumsCollected[this.data.currentAlbumId];
    albumCollected = !albumCollected;
    //更新文章缓存值
    albumsCollected[this.data.currentAlbumId] = albumCollected;
    wx.setStorageSync('albums_collected', albumsCollected);
    //更新数据绑定，从而实现切换图片
    this.setData({
      collected: albumCollected
    })

    wx.showToast({
      title: albumCollected ? "收藏成功" : "取消成功",
    })
  },

  setMusicMonitor: function() {
    var that = this;
    wx.onBackgroundAudioPlay(function() {
      that.setData({
        isPlayingMusic: true
      });
      app.globalData.g_isPlayingMusic = true;
    });
    wx.onBackgroundAudioPause(function() {
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.g_isPlayingMusic = false;
    });
    wx.onBackgroundAudioStop(function() {
      that.setData({
        isPlayingMusic: false
      });
      app.globalData.g_isPlayingMusic = false;
    });
  },

  onControllerTap: function (event) {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear',
      transformOrigin: 'bottom'
    });
    let taped = !this.data.controllerTaped;
    if (taped) {
      animation.height('206rpx').backgroundColor('#405f80').top('990rpx').step();
    }
    else {
      animation.height('116rpx').backgroundColor('#fff').top('1080rpx').step();
    }
    this.setData({
      myAnimation: animation.export(),
      controllerTaped: taped
    });
  },

  onLike: function (event) {
    let collected = !this.data.collectedMusic;
    this.setData({
      collectedMusic: collected
    });
  },

  onLoad: function(options) {
    var albumId = options.id;
    console.log(albumId);
    // this.data.currentAlbumId = albumId;
    this.setData({
      albumData: albumsData.album[0],   //这里应该是albumsData.album[albumId],但是我们现在没有那么多的数据，先用第一个代替了。
      currentAlbumId: albumId   //不用set方法，绑定不成功。
    });

    this.setData({
      isPlayingMusic: app.globalData.g_isPlayingMusic
    });
    this.setMusicMonitor();

    var albumsCollected = wx.getStorageSync('albums_collected');
    if (!albumsCollected[albumId]) {
      // albumsCollected = {};  //这里我犯了一个错误，竟然之前没有看出来。我把这个置空，那之前保存的数据不就没了吗！
      albumsCollected[albumId] = ''; //这里之前有个问题 之前是直接设置成布尔值，后来报错了。之前没有报错的。可能又改了。
      wx.setStorageSync('albums_collected', albumsCollected);
    }
    this.setData({
      collected: albumsCollected[albumId]
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  onShow: function(event){
    // this.setData({
    //   isPlayingMusic: app.globalData.g_isPlayingMusic
    // });  //这个会出现bug  这个涉及到两个页面之间的生命周期函数，复杂。不过好在我问题已经被我解决啦。
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})