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
    index: '',
    setLang: '',
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
    output: '',
    qid: '',
    aid: ''
  },

  openToast: function () {//开启弹窗
    this.setData({
      toast: true
    });
    setTimeout(() => {//设置延时
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

  openTopTips: function () {//开启顶部提示
    this.setData({
      topTips: true
    });
    setTimeout(() => {//设置延时
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

  bindPickerChange: function (e) {//选择器事件响应
    this.setData({
      index: e.detail.value,
      setLang: this.data.languages[e.detail.value].toLowerCase(),
      filename: this.data.filenames[e.detail.value],
      code: this.data.codes[e.detail.value],
      result: ''
    })
  },

  bindFormSubmit: function (e) {//提交表单
    const db = wx.cloud.database()
    this.setData({//开始加载
      loading: true
    })
    wx.cloud.callFunction({ //调用云函数
      name: 'glot', //云函数名为glot
      data: {
        language: this.data.setLang,
        filename: e.detail.value.filename,
        stdin: e.detail.value.stdin,
        content: e.detail.value.textarea
      },
    }).then(res => { //Promise
      if (JSON.parse(res.result).stdout == this.data.output)//判断结果是否正确，从而确定提示信息和颜色
        this.setData({
          topTipsColor: this.data.colors[1],
          hint: this.data.messages[1],
        })
      else
        this.setData({
          topTipsColor: this.data.colors[0],
          hint: this.data.messages[0],
        })
      if (this.data.aid == '') {//判断是第一次回答还是修改以前的回答，从而确定是add还是update
        db.collection('answers').add({
            data: {
              question: this.data.qid,
              input: e.detail.value.textarea,
              output: JSON.parse(res.result).stdout + JSON.parse(res.result).stderr +
                JSON.parse(res.result).error,
              title: this.data.title,
              time: new Date()
            }
          })
          .then(res => {
            this.setData({
              aid: res._id
            })
          })
          .catch(console.error)
        getApp().globalData.refreshHome = true//需要刷新首页
        getApp().globalData.refreshList = true//需要刷新列表
      } else
        db.collection('answers').doc(this.data.aid).update({
          data: {
            input: e.detail.value.textarea,
            output: JSON.parse(res.result).stdout + JSON.parse(res.result).stderr +
              JSON.parse(res.result).error,
            time: new Date()
          }
        })
        .then(console.log)
        .catch(console.error)
      this.openTopTips()//开启顶部提示
      this.openToast()//开启弹窗
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
    this.setData({
      aid: options.aid
    })
    db.collection("questions") //获取集合questions的引用
      .where({
        _id: options.id
      })
      .get() //获取根据查询条件筛选后的集合数据  
      .then(res => {
        this.setData({
          qid: res.data[0]._id,
          title: res.data[0].title,
          content: res.data[0].content,
          input: res.data[0].input,
          output: res.data[0].output,
          index: res.data[0].language,
          setLang: this.data.languages[res.data[0].language].toLowerCase(),
          filename: this.data.filenames[res.data[0].language],
        })
        if (this.data.aid != '') {//如果是查看以前的回答，加载以前的代码
          db.collection('answers').doc(this.data.aid).get().then(res => {
            this.setData({
              code: res.data.input,
              result: res.data.output
            })
          })
        } else
          this.setData({
            code: this.data.codes[this.data.index]
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