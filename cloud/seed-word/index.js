// 云函数入口文件
const cloud = require('wx-server-sdk')

const md5 = require('md5')
cloud.init({
  env: 'cloud1-1gn5uyhza8931345'
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = md5(wxContext.OPENID)

  // 查openId下是不是已经有了已经背的单词
  let res = await db.collection("seed-users").where({
    openId: openId
  }).get();

  if(res.data[0].flag == undefined){
    try {
      await db.collection('seed-users').where({
        openId:openId
      }).update({
        data: {
          flag: '奥利给',
          today_num: 0,
          all_num: 0,
          history: []
        }
      })

      // 重新获取新的user数据返回
      res = await db.collection("seed-users").where({
        openId: openId
      }).get();
    } catch(e) {
      console.error(e)
    }
  }
  
  return res
}