var albumsData = require('../../../data/music-data.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onCoverTap: function (event) {
    var albumId = event.currentTarget.dataset.albumid;
    wx.navigateTo({
      url: '../music-detail/music-detail?id=' + albumId,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      album: albumsData.album
    });
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})