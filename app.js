//app.js
App({
  globalData: {
    postUrl: 'https://www.xiazhongyuan.cn:443',
    // postUrl: 'http://127.0.0.1:443',
    articleId: '',
    session_key: '',
    userInfo: {},
    openId: ''
  },
  onLaunch: function (option) {
    let that = this
    that.globalData.articleId = option.query.articleId
    //登录获取换取openID的key
    wx.login({
      success (res) {
        if (res.code) {
          that.globalData.session_key = res.code
            wx.request({
                // 通过此 url,验证是否面登录
                url: that.globalData.postUrl + '/commentController/getOpenId',
                method: 'POST',
                data: {
                    'session_key': that.globalData.session_key
                },
                success: res => {
                    if (res.data.retCode == 0) {
                        that.globalData.openId = res.data.retData
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: res.data.retMsg,
                        })
                    }
                }
            })
        } else {
          wx.showModal({
            title: '登录失败',
            content: '在确保网络正常的情况下，请稍后刷新重试'
          })
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success (res) {
        // 是否已运行获取用户信息（如头像，昵称等不敏感信息）
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              that.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })
  }
})