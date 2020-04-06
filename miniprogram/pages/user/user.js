// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toast: false,
    hideToast: false,
    loading: false,
    types: ['学生', '教师'],
    index: 0,
    name: '',
    school: '',
    number: '',
    class: '',
    course: '',
    oid: '',
    length: 0
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

  bindPickerChange: function (e) {//选择器事件响应
    this.setData({
      index: e.detail.value,
      type: this.data.types[e.detail.value]
    })
  },

  bindFormSubmit: function (e) {//提交表单
    const db = wx.cloud.database()
    this.setData({
      loading: true
    })
    if (this.data.length === 0)//长度为0表示新建，采用add，否则用update
      db.collection('users').add({
        data: {
          type: e.detail.value.type,
          name: e.detail.value.name,
          number: e.detail.value.number,
          school: e.detail.value.school,
          college: e.detail.value.college,
          class: e.detail.value.class,
          course: e.detail.value.course
        }
      })
      .then(res => {
        getApp().globalData.refreshHome = true//需要刷新首页
        this.openToast()
        this.setData({
          length: 1,
          loading: false
        })
      })
      .catch(console.error)
    else
      db.collection('users').where({
        _openid: this.data.openid
      }).update({
        data: {
          type: e.detail.value.type,
          name: e.detail.value.name,
          number: e.detail.value.number,
          school: e.detail.value.school,
          college: e.detail.value.college,
          class: e.detail.value.class,
          course: e.detail.value.course
        }
      })
      .then(res => {
        getApp().globalData.refreshHome = true//需要刷新首页
        this.openToast()
        this.setData({
          loading: false
        })
      })
      .catch(console.error)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database() //获取数据库的引用
    const _ = db.command //获取数据库查询及更新指令
    this.setData({
      openid: getApp().globalData.openid//从全局数据中读取openid
    })
    db.collection("users") //获取集合users的引用
      .where({
        _openid: this.data.openid
      })
      .get() //获取根据查询条件筛选后的集合数据  
      .then(res => {//将初始数据写入表单
        if (res.data.length > 0)
          this.setData({
            length: res.data.length,
            index: res.data[0].type,
            type: this.data.types[res.data[0].type],
            name: res.data[0].name,
            number: res.data[0].number,
            school: res.data[0].school,
            college: res.data[0].college,
            class: res.data[0].class,
            course: res.data[0].course
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