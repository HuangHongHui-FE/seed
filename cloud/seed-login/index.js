// 云函数入口文件
const cloud = require('wx-server-sdk')
const md5 = require('md5')

cloud.init(
  {
    env: 'cloud1-1gn5uyhza8931345'
  }
)
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = md5(wxContext.OPENID)

  // 查询这个openid下有无数据
  let user_data = await db.collection("seed-users").where({
    openId: openId
  }).get()

  // 没有此用户则将openId添加到数据库
  if(user_data.data.length === 0){
    try{
      let data_add =  await db.collection("seed-users").add({
        data: {
          openId: openId
        }
      })
      return {
        data_add,
        openId,
        status: 202  // 新添加的数据
      }
    }
    catch(e){
      console.error(e)
    }
    // 有了则直接返回
  }else{
    return {
      user_data, 
      status: 200  // 已经有了用户
    }
  }
}