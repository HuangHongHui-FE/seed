// pages/contact/cantact.js

const db = wx.cloud.database()
const app = getApp()
// const todosCollection = db.collection('seed-users')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showShare: false,
        showContact: false,
        options: [
        { name: '微信', icon: 'wechat', openType: 'share' },
        { name: '微博', icon: 'weibo' },
        { name: '复制链接', icon: 'link' },
        { name: '分享海报', icon: 'poster' },
        { name: '二维码', icon: 'qrcode' },
        ],
        options2: [
          { name: '13703949346', icon: 'wechat', openType: 'contact'}
        ],
        // 是否登录的标识
        isLogin: false,
        // 用户授权的信息
        msg: {},
        openId: ''
    },

    // 点击登录
    login: function(){
      // this.seedLogin()  // 先把openid新建进seed-user表里
      this.getUserProfile()
    },

    // 调用登录的云函数
    seedLogin: function(e){
      const that = this
      wx.cloud.callFunction({
        name: 'seed-login'
      }).then(res => {
        // status == 200, 说明不是新用户， 202是新用户
        if(res.result.status == 200){
          app.globalData.openId = res.result.user_data.data[0].openId
          that.setData({
            openId: res.result.user_data.data[0].openId
          })
        }else{
          app.globalData.openId = res.result.openId
          that.setData({
            openId: res.result.openId
          })
        }
        
        // 更新user的头像，签名信息
        db.collection('seed-users').where({
          openId: that.data.openId
        }).update({
          data: {
            avataUrl: e.userInfo.avatarUrl,
            nickName: e.userInfo.nickName
          }
        })
        //保存用户登录信息到缓存
        wx.setStorageSync('msg', 
          {avataUrl: e.userInfo.avatarUrl, nickName: e.userInfo.nickName, openId: that.data.openId}
        )
      })
      console.log(app.globalData.openId)
    },


    getUserProfile: function(){
      const that = this
      wx.getUserProfile({
        desc: '用户完善资料',
      }).then(res=>{
        this.seedLogin(res)

        console.log(res)
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1000,
          mask: true
        })
        // console.log("用户允许了微信授权登录",res);
        that.setData({
          msg: {
            avataUrl: res.userInfo.avatarUrl,
            nickName: res.userInfo.nickName
          },
          isLogin: true
        })
        
        // console.log(that.data.openId)
        // db.collection('seed-users').where({
        //   openId: that.data.openId
        // }).update({
        //   data: {
        //     avataUrl: res.userInfo.avatarUrl,
        //     nickName: res.userInfo.nickName
        //   }
        // })
      }).catch(err=>{  // 点击拒绝授权
        wx.showModal({
          title: '提示',
          content: '确认拒绝授权？',
          success (res) {
            if (res.confirm) {
              wx.showToast({
                title: '用户拒绝授权',
                icon: 'fail',
                duration: 1000,
                mask: true
              })
            } else if (res.cancel) {
              that.getUserProfile()
            }
          }
        })
      })
    },

    // 退出登录
    notLogin: function(){
      const that = this
      wx.showModal({
        title: '提示',
        content: '确认退出登录？',
        success (res) {
          if (res.confirm) {
            app.globalData.openId = ''
            that.setData({
              isLogin: false,
            })
            wx.removeStorageSync('msg')
            wx.showToast({
              title: '退出成功',
              icon: 'success',
              duration: 1000
            })
          } else if (res.cancel) {
            wx.showToast({
              title: '退出取消',
              icon: 'fail',
              duration: 1000
            })
          }
        }
      })
    },

    // 点击我的单词
    myWord: function(){
      console.log('我的单词')
      wx.navigateTo({
          url: `/pages/wdetail/wdetail?num=${app.globalData.all_num}&m=m`  // m=s为了判断是搜索跳转
      })
    },

    // 点击分享好友
    onClick(event) {
        this.setData({ showShare: true });
      },
      onClose() {
        this.setData({ showShare: false, showContact: false });
      },
    
      onSelect(event) {
        Toast(event.detail.name);
        this.onClose();
      },

    // 点击联系我们
    onContact(){
      this.setData({ showContact: true });
    },
    
    
      

    // 点击联系我们
    contact: function(){
      var query = wx.createSelectorQuery();
      console.log(query)
      query.select('.contact');
      query.exec(function (res) {
        console.log(res)
      })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      console.log(options)
      const that = this
      let res = wx.getStorageSync('msg')
      if(res.openId != undefined && res.openId != ''){
        that.setData({
          msg: res,
          isLogin: true
        })
      }else{
        
      }
      

      
      // console.log(app.globalData)
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
      console.log(app.globalData)
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