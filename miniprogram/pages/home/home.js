// pages/home/home.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questions: [],
    finish: [],
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
          wx.getStorage({//获取openid并存入全局数据
            key: 'openid',
            success: (res) => {
              getApp().globalData.openid = res.data
            }
          })
          wx.getUserInfo({//获取用户信息并存入全局数据
            lang: "zh_CN",
            success(res) {
              getApp().globalData.userInfo = res
            }
          })
          const db = wx.cloud.database() //获取数据库的引用
          const _ = db.command //获取数据库查询及更新指令
          db.collection("users") //获取集合users的引用
            .where({
              _openid: this.data.openid//根据openid查询用户
            })
            .get() //获取根据查询条件筛选后的集合数据  
            .then(res => {
              if (res.data.length > 0)//判断返回数据的长度
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
                    res.data.forEach(v => {//对时间进行格式化操作
                      v.time = util.formatTime(v.time)
                    })
                    this.setData({
                      questions: res.data
                    })
                    db.collection("answers") //获取集合answers的引用
                      .where({
                        _openid: getApp().globalData.openid
                      })
                      .get() //获取根据查询条件筛选后的集合数据  
                      .then(res => {
                        var temp = this.data.questions//临时保存问题
                        for (var i = 0; i < res.data.length; ++i) {//遍历全部问题和已完成任务的数组
                          for (var j = 0; j < temp.length; ++j)
                            if (temp[j]._id === res.data[i].question)
                              temp.splice(j, 1)//从数组中去除已完成的任务
                        }
                        this.setData({
                          questions: temp,
                          length: temp.length === 0 ? -1 : temp.length//如果长度为0，则设为-1表示空，否则保存实际长度
                        })
                        console.log(this.data.length)
                      })
                      .catch(err => {
                        console.error(err)
                      })
                  } else
                    this.setData({
                      length: -1//表示空
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
    if (getApp().globalData.refreshHome === true) {//判断是否需要刷新数据
      getApp().globalData.refreshHome = false
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