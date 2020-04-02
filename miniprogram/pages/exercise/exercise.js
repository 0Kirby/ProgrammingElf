// pages/exercise/exercise.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    languages: ['Java', 'C', 'Python'],
    index: 0,
    setLang: "java",
    filename: "Main.java",
    stdin: ""
  },

  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      setLang: this.data.languages[e.detail.value].toLowerCase()
    })
  },

  bindFormSubmit: function (e) {
    wx.cloud.callFunction({ //调用云函数
      name: 'glot', //云函数名为http
      data: {
        language: this.data.setLang,
        filename: e.detail.value.filename,
        stdin: e.detail.value.stdin,
        content: e.detail.value.textarea
      },
    }).then(res => { //Promise
      console.log(JSON.parse(res.result))
    })
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