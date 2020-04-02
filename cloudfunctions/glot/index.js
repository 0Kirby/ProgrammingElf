// 云函数入口文件
const cloud = require('wx-server-sdk')
const got = require('got'); //引用 got
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
// 云函数入口函数
exports.main = async (event, context) => {
  let postResponse = await got('https://run.glot.io/languages/' + event.language + '/latest', {
    method: 'POST', //post请求
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token 698fdc18-be4c-4eed-acd1-578d8a46813f'
    },
    body: JSON.stringify({ //把json数据（对象）解析成字符串
      files: [{
        "name": event.filename,
        "content": event.content
      }],
      stdin: event.stdin,
      command: ""
    })
  })
  return postResponse.body //返回数据
}