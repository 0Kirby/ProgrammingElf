// pages/home/home.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questions: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userInfo']) {
          //未登录,跳转到登录页
          wx.redirectTo({
            url: '/pages/login/login',
          })
        } else {
          const db = wx.cloud.database() //获取数据库的引用
          const _ = db.command //获取数据库查询及更新指令
          db.collection("questions") //获取集合questions的引用
            .limit(10) //限制显示多少条记录，这里为10
            .get() //获取根据查询条件筛选后的集合数据  
            .then(res => {
              res.data.forEach(v => {
                v.time = util.formatTime(v.time)
              })
              that.setData({
                questions: res.data
              })
            })
            .catch(err => {
              console.error(err)
            })
        }
      }
    })
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