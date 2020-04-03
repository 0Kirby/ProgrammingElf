// pages/exercise/exercise.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    languages: ['Java', 'C', 'Python'],
    index: 0,
    setLang: 'java',
    filenames: ['Main.java', 'main.c', 'main.py'],
    filename: '',
    codes: ['public class Main {\n    public static void main(String[] args) {\n        System.out.println("Java版Hello World!");\n    }\n}',
      '#include <stdio.h>\n\n  int main() {\n      printf("C版Hello World!\\n");\n      return 0;\n  }',
      'print("Python版Hello World!")'
    ],
    code: '',
    result: ''
  },

  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      setLang: this.data.languages[e.detail.value].toLowerCase(),
      filename: this.data.filenames[e.detail.value],
      code: this.data.codes[e.detail.value],
      result: ''
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
      this.setData({
        result: JSON.parse(res.result).stdout + JSON.parse(res.result).stderr +
          JSON.parse(res.result).error
      })
    })
  },

  bindFormReset: function () {
    this.setData({
      index: 0,
      setLang: '',
      filename: '',
      stdin: '',
      content: '',
      code: '',
      result: ''
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      filename: this.data.filenames[0],
      code: this.data.codes[0]
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