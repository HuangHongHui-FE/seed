// app.js
// import {promisifyAll} from "miniprogram-api-promise"

// const wxp = wx.p = {}
// promisifyAll(wx,wxp)


App({
  onLaunch(e) {
    wx.cloud.init({
      env:'cloud1-1gn5uyhza8931345'  // 云开发环境ID
    })
    let res = wx.getStorageSync('msg')
    if(res.openId !== undefined){
      this.globalData = {
        openId: res.openId
      }
    }else{
      this.globalData = {
        openId: ''
      }
    }

    wx.cloud.callFunction({
      name: 'seed-word'
    }).then(res => {
      res = res.result.data[0]
      this.globalData.all_num = res.all_num
    })
  }
})
