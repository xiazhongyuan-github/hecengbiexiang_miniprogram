const app = getApp()
Page({
  data: {
    articleId: '',//文章ID
    session_key: '',
    pageNumber: 1,
    flag: false,
    list: [],// 查询的评论集合
    content: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let that = this
    this.setData({
      articleId: app.globalData.articleId,
      session_key: app.globalData.session_key,
      pageNumber: 1,
      false: false,
      list: [],
      content:''
    })
    that.getHistoryComment(that.pageNumber);
  },

  // 获取历史；评论信息
  getHistoryComment: function (pageNumber) {
    let that = this
    wx.request({
      // 通过此 url,验证是否面登录
      url: app.globalData.postUrl + '/commentController/getCommentsByArticleId',
      method: 'POST',
      data: {
        'articleId': that.data.articleId,
        'openId' : app.globalData.openId
      },
      success: res => {
        if (res.data.retCode == 0) {
          that.setData({
            list: res.data.retData
          })
        }
        else {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: res.data.retMsg,
            showCancel: false
          })

        }
      }
    })
  },
  // 取消点赞
  cancelApplaud: function(eve) {
    let that = this
    let code = eve.currentTarget.dataset.code
    wx.request({
      // 通过此 url,验证是否面登录
      url: app.globalData.postUrl + '/applaudController/cancelApplaud',
      method: 'POST',
      data: {
        'commentCode': code,
        'openId' : app.globalData.openId
      },
      success: res => {
        if (res.data.retCode == 0) {
          that.getHistoryComment()
        }
        else {
          wx.showModal({
            title: '提示',
            content: res.data.retMsg,
            showCancel: false
          })

        }
      }
    })
  },
  //点赞
  applaud: function(eve) {
    let that = this
    let code = eve.currentTarget.dataset.code
    wx.request({
      // 通过此 url,验证是否面登录
      url: app.globalData.postUrl + '/applaudController/applaud',
      method: 'POST',
      data: {
        'commentCode': code,
        'openId' : app.globalData.openId
      },
      success: res => {
        if (res.data.retCode == 0) {
          that.getHistoryComment()
        }
        else {
          wx.showModal({
            title: '提示',
            content: res.data.retMsg,
            showCancel: false
          })

        }
      }
    })
  },

  /**
   * 页面下拉刷新事件的处理函数
   */
  // refresh: function () {
  //     mydata.page = 1
  //     this.getPageInfo(mydata.page, function () {
  //         this.setData({
  //             list: []
  //         })
  //     });
  //     mydata.end = 0;
  // },
  /**
   * 页面上拉触底事件的处理函数
   */
  // bindDownLoad: function () {
  //     var that = this;
  //     if (mydata.end == 0) {
  //         mydata.page++;
  //         that.getPageInfo(mydata.page);
  //     }
  // },
  // bindReply: function (e) {
  //     mydata.commentId = e.target.dataset.commentid;
  //     mydata.replyUserName = e.target.dataset.commentusername;
  //     this.setData({
  //         replyUserName: mydata.replyUserName,
  //         reply: true
  //     })
  // },
  // 合并数组
  // addArr(arr1, arr2) {
  //     for (var i = 0; i < arr2.length; i++) {
  //         arr1.push(arr2[i]);
  //     }
  //     return arr1;
  // },
  // deleteComment: function (e) {
  //     var that = this;
  //     var commentId = e.target.dataset.commentid;
  //
  //     wx.showModal({
  //         title: '删除评论',
  //         content: '请确认是否删除该评论？',
  //         success: function (res) {
  //             if (res.confirm) {
  //                 wx.request({
  //                     url: config.deleteComment,
  //                     method: "POST",
  //                     data: {
  //                         commentId: commentId
  //                     },
  //                     header: {
  //                         "content-type": "application/x-www-form-urlencoded;charset=utf-8",
  //                     },
  //                     success: res => {
  //                         that.refresh();
  //                         wx.showToast({
  //                             title: "删除成功"
  //                         })
  //                     }
  //                 })
  //             } else if (res.cancel) {
  //             }
  //         }
  //     })
  // },
  cancleReply: function (e) {
    mydata.commentId = "";
    mydata.replyUserName = "";
    this.setData({
      replyUserName: mydata.replyUserName,
      reply: false
    })
  },
  showMistake(text) {
    wx.showToast({
      title: text,
      icon: 'none'
    })
  },
  submitForm(e) {
    //获取输入的评论内容
    let commentContent = e.detail.value.comment
    var that = this;
    if (commentContent == "") {
      that.showMistake('请输入评论');
      return;
    }
    // 申请权限
    if (Object.keys(app.globalData.userInfo).length < 1) {
      wx.authorize({
        scope: 'scope.userInfo',
        success() {
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo
            }
          })
        }
      })
    }
    let userInfo = app.globalData.userInfo
    if (Object.keys(userInfo).length < 1) {
      that.data.flag = true
      that.showMistake("请点击授权按钮，允许获取您的名称及头像信息")
      return
    }
    // 提交评论
    wx.request({
      url: app.globalData.postUrl + '/commentController/saveComment',
      method: "POST",
      data: {
        name: userInfo.nickName,
        headPortrait: userInfo.avatarUrl,
        commentContent: commentContent,
        articleId: that.data.articleId,
        session_key: that.data.session_key,
        openId: app.globalData.openId
      },
      header: {
        "content-type": "application/json",
      },
      success: res => {
        if (res.data.retCode === 0) {
          wx.showToast({
            title: "回复成功"
          })
          that.setData({
            content: ''
          })
          that.getHistoryComment()
        } else {
          wx.showToast({
            title: '回复失败，请检查您的网络',
          })
        }
      }
    })
  }
})