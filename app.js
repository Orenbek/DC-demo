App({
  onLaunch: function() {
    if (!wx.cloud) {
      wx.showToast({
        title: '请使用2.2.3或以上的基础库以使用云能力',
        icon: 'none',
        duration: 5000
      })
    } else {
      wx.cloud.init({
        env: 'test-env-57b34f',
        traceUser: true,
      })

      if (!wx.getStorageSync('userMainInfo')) {
        wx.cloud.callFunction({
          name: 'login',
          success: res => {
            this.globalData.userMainInfo = res.result.event.userInfo;
            wx.setStorageSync('userMainInfo', res.result.event.userInfo);
            if (this.userMainInfoReadyCallback) {
              this.userMainInfoReadyCallback(res)
            }
          },
          fail: err => {
            console.log('login函数返回错误', err)
          }
        })
      } else {
        this.globalData.userMainInfo = wx.getStorageSync('userMainInfo');
      }


    }

    // 登录
    // wx.login({
    //   success: res => {
    //     console.log('applaunched', res)
    //   }
    // })

    // 获取用户信息
    if (!wx.getStorageSync('userInfo')) {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo
                wx.setStorage({
                  key: 'userInfo',
                  data: res.userInfo
                });
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          } else {
            wx.setStorage({
              key: 'userInfo',
              data: null
            });
          }
        }
      })
    } else {
      this.globalData.userInfo = wx.getStorageSync('userInfo');
    }

    
  },
  globalData: {
    userMianInfo: null,
    userInfo: null,
    g_isPlayingMusic: false,
    g_currentMusicPostId: null,
    doubanBase: "http://t.yushu.im"
  }
})