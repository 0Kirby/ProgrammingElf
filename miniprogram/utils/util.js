const formatTime = date => {
  const year = date.getFullYear()  //获取年
  const month = date.getMonth() + 1  //获取月份，月份数值需加1
  const day = date.getDate()  //获取一月中的某一天
  const hour = date.getHours() //获取小时
  const minute = date.getMinutes()  //获取分钟
  const second = date.getSeconds() //获取秒

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')  //会单独来讲解这段代码的意思
}

const formatNumber = n => {  //格式化数字
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {  //模块向外暴露的对象，使用require引用该模块时可以获取
  formatTime: formatTime,
  formatNumber: formatNumber
}