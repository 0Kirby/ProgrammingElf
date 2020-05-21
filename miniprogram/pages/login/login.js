// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topTips: false,
    hideTopTips: false,
    topTipsColor: "",
    colors: ["weui-toptips_warn", "weui-toptips_done"],
    hint: "",
    messages: ["授权失败！请重新授权>w<", "授权成功！很快将跳转到主界面~"]
  },

  openTopTips: function () { //开启顶部提示
    this.setData({
      topTips: true
    });
    setTimeout(() => { //设置延时
      this.setData({
        hideTopTips: true
      });
      setTimeout(() => {
        this.setData({
          topTips: false,
          hideTopTips: false,
        });
      }, 300);
    }, 2000);
  },

  getUserInfomation: function (event) {
    if (event.detail.userInfo) { //用户按了允许授权按钮
      this.setData({
        topTipsColor: this.data.colors[1],
        hint: this.data.messages[1],
      })
      wx.cloud.callFunction({ //调用云函数获取openid
          name: 'login',
          data: {},
          success: res => {
            wx.setStorage({ //将openid存入storage
              key: "openid",
              data: res.result.openid
            })
          },
          fail: err => {
            console.error('[云函数] [login] 调用失败', err)
          }
        }),
        this.openTopTips()
      getApp().globalData.userInfo = event.detail.userInfo //将用户信息写入全局数据
      wx.switchTab({ //跳转到主界面
        url: '/pages/home/home',
      })
    } else { //用户按了拒绝按钮
      this.setData({
        topTipsColor: this.data.colors[0],
        hint: this.data.messages[0],
      })
      this.openTopTips()
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})