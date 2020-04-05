// pages/home/home.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questions: [],
    school: '',
    college: '',
    class: '',
    course: '',
    length: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userInfo']) {
          //未登录,跳转到登录页
          wx.redirectTo({
            url: '/pages/login/login',
          })
        } else {
          wx.getStorage({
            key: 'openid',
            success: (res) => {
              getApp().globalData.openid = res.data
            }
          })
          wx.getUserInfo({
            lang: "zh_CN",
            success(res) {
              getApp().globalData.userInfo = res
            }
          })
          const db = wx.cloud.database() //获取数据库的引用
          const _ = db.command //获取数据库查询及更新指令
          db.collection("users") //获取集合users的引用
            .where({
              _openid: this.data.openid
            })
            .get() //获取根据查询条件筛选后的集合数据  
            .then(res => {
              if (res.data.length > 0)
                this.setData({
                  length: res.data.length,
                  school: res.data[0].school,
                  college: res.data[0].college,
                  class: res.data[0].class,
                  course: res.data[0].course
                })
              db.collection("questions") //获取集合questions的引用
                .where({
                  school: this.data.school,
                  college: this.data.college,
                  class: this.data.class,
                  course: this.data.course
                })
                .get() //获取根据查询条件筛选后的集合数据  
                .then(res => {
                  if (res.data.length > 0) {
                    res.data.forEach(v => {
                      v.time = util.formatTime(v.time)
                    })
                    this.setData({
                      questions: res.data
                    })
                  }else
                  this.setData({
                    length: -1
                  })
                })
                .catch(err => {
                  console.error(err)
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