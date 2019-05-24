// pages/welcome/welcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  onTap:function(event){
    console.log('onTap');
    wx.switchTab({
      url: '../posts/post',
    });
  }
})