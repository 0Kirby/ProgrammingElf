// pages/detail/detail.js
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
    messages: ["结果错误！", "结果正确！"],
    toast: false,
    hideToast: false,
    loading: false,
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
    result: '',
    title: '',
    content: '',
    input: '',
    output: ''
  },

  openToast: function () {
    this.setData({
      toast: true
    });
    setTimeout(() => {
      this.setData({
        hideToast: true
      });
      setTimeout(() => {
        this.setData({
          toast: false,
          hideToast: false,
        });
      }, 300);
    }, 1000);
  },

  openTopTips: function () {
    this.setData({
      topTips: true
    });
    setTimeout(() => {
      this.setData({
        hideTopTips: true
      });
      setTimeout(() => {
        this.setData({
          topTips: false,
          hideTopTips: false,
        });
      }, 300);
    }, 3000);
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
    this.setData({
      loading: true
    })
    wx.cloud.callFunction({ //调用云函数
      name: 'glot', //云函数名为http
      data: {
        language: this.data.setLang,
        filename: e.detail.value.filename,
        stdin: e.detail.value.stdin,
        content: e.detail.value.textarea
      },
    }).then(res => { //Promise
      if (JSON.parse(res.result).stdout == this.data.output)
        this.setData({
          topTipsColor: this.data.colors[1],
          hint: this.data.messages[1],
        })
      else
        this.setData({
          topTipsColor: this.data.colors[0],
          hint: this.data.messages[0],
        })
      this.openTopTips()
      this.openToast()
      this.setData({
        loading: false,
        result: JSON.parse(res.result).stdout + JSON.parse(res.result).stderr +
          JSON.parse(res.result).error
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database() //获取数据库的引用
    const _ = db.command //获取数据库查询及更新指令
    db.collection("questions") //获取集合questions的引用
      .where({
        _id: _.eq(options.id)
      })
      .get() //获取根据查询条件筛选后的集合数据  
      .then(res => {
        this.setData({
          title: res.data[0].title,
          content: res.data[0].content,
          input: res.data[0].input,
          output: res.data[0].output
        })
      })
      .catch(err => {
        console.error(err)
      })
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