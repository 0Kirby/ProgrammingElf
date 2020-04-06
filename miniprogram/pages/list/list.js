// pages/list/list.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questions: [],
    length: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database() //获取数据库的引用
    db.collection("answers") //获取集合answers的引用
      .where({
        _openid: getApp().globalData.openid//从全局数据查询openid
      })
      .get() //获取根据查询条件筛选后的集合数据  
      .then(res => {
        if (res.data.length > 0) {
          res.data.forEach(v => {//对时间进行格式化
            v.time = util.formatTime(v.time)
          })
          this.setData({
            length: res.data.length,
            questions: res.data
          })
        } else
          this.setData({
            length: 0
          })
      })
      .catch(err => {
        console.error(err)
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
    if (getApp().globalData.refreshList === true) {//判断是否需要刷新
      getApp().globalData.refreshList = false
      this.onLoad()
    }
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