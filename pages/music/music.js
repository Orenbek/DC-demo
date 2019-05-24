// pages/music/music.js
var app = getApp();
var albumsData = require('../../data/music-data.js');
Page({

  data: {
    isPlayingMusic: false,
    collectedMusic: false,
    controllerTaped: false,
    dataUrl: 'http://zhangmenshiting.qianqian.com/data2/music/e074ba1715ef173bd7ae96c4c2349caa/605017284/605017284.mp3?xcode=5b325d0ff8c099c09d88bb873c3ec0e5',
    songTitle: 'lost stars - Adam Levine',
    coverImgUrl: 'http://imge.kugou.com/stdmusic/240/20150718/20150718033819377218.jpg'
  },

  on3itemTap: function(event) {
    var itemId = event.currentTarget.dataset.itemid;
    wx.navigateTo({
      url: 'music-detail/music-detail?id=' + itemId,
    });
  },

  onWholeAlbumsTap: function(event) {
    wx.navigateTo({
      url: 'all-albums/all-albums',
    });
  },

  onCoverTap: function(event) {
    var albumId = event.currentTarget.dataset.albumid;
    wx.navigateTo({
      url: 'music-detail/music-detail?id=' + albumId,
    })
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

  onControllerTap: function(event) {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear',
      transformOrigin: 'bottom'
    });
    let taped = !this.data.controllerTaped;
    if (taped) {
      animation.height('206rpx').backgroundColor('#405f80').top('896rpx').step();
    } else {
      animation.height('116rpx').backgroundColor('#fff').top('986rpx').step();
    }
    this.setData({
      myAnimation: animation.export(),
      controllerTaped: taped
    });
  },

  onLike: function(event) {
    let collected = !this.data.collectedMusic;
    this.setData({
      collectedMusic: collected
    });
  },

  onLoad: function(options) {
    this.setData({
      isPlayingMusic: app.globalData.g_isPlayingMusic,
      albums: albumsData.albums
    });
  },

  onShow: function(event) {
    let animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear',
      transformOrigin: 'bottom'
    });
    animation.height('116rpx').backgroundColor('#fff').top('986rpx').step();

    this.setData({
      myAnimation: animation.export(),
      controllerTaped: false,
      isPlayingMusic: app.globalData.g_isPlayingMusic
    });
    this.setMusicMonitor();
  }

})