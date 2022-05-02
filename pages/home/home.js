// pages/home/home.js
const db = wx.cloud.database()
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      active: 1,
      // 分类下的数据
      dataList: [],
      tabs: ['收藏', '热门', '剧情', '爱情', '科幻', '喜剧'],
      title: '',
      value: ''
    },
    pageData: {
      classify: {
        '剧情': 'juqing',
        '热门': 'remen',
        '爱情': 'aiqing',
        '科幻': 'kehuan',
        '喜剧': 'xiju'
      }
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      
    },


    // 点击分类标签
    onChange(event) {
      const that = this
      wx.showToast({
        title: `切换到 ${event.detail.title}`,
        icon: 'none',
      });

      // 后面dataUp用了
      that.setData({
        title: event.detail.title,
        // 点击标签，清除搜索
        value: ''
      })

      // 点击收藏标签，与点击其他标签要分开处理
      if(event.detail.title == '收藏'){
        that.dataSc();
      }else{
        that.dataUp();  // 获取对应标签数据，并且更新star状态
      }
    },

    


    // 数据对比更新star
    dataUp: function(){
      const that = this
      // 获取对应分类下的数据
      db.collection('seed-movies').where({
        classify: that.pageData.classify[that.data.title]
      }).get().then(res1 => {
        // console.log(res1)

        // 为了更新页面中的star的颜色状态
        // 获取对应分类下用户收藏的数据
        db.collection('seed-user-movies').where({
          user: app.globalData.openId,
          classify: that.pageData.classify[that.data.title]
        }).get().then(res2 => {
          for(let i = 0; i < res1.data.length; i++){
            let id = res1.data[i]._id
            for(let j = 0; j < res2.data.length; j++){
              // console.log(id == res2.data[j].movieId)
              if(id == res2.data[j].movieId){
                res1.data[i].flag = 1
              }
            }
          }
          that.setData({
            dataList: res1.data
          })
        })
      })
    },

    // 点击收藏star
    onStarChange: function(e){
      const that = this
      // 传过来自定义的item
      // console.log(e.target.dataset.item)

      // 添加到seed-user-movies表里
      db.collection('seed-user-movies').add({
        data: {
          user: app.globalData.openId,
          movieId: e.target.dataset.item._id,
          content: e.target.dataset.item.content,
          img: e.target.dataset.item.img,
          title: e.target.dataset.item.title,
          classify: e.target.dataset.item.classify,
          flag: 1
        }
      })
      .then(res => {
        that.dataUp();  // 获取对应标签数据，并且更新star状态

        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          duration: 1000
        })
      })
      .catch(console.error)
    },

    // 点击取消star
    cancelStarChange: function(e){
      const that = this
      // 传过来自定义的item
      // console.log(e.target.dataset.item._id)
      // 删除seed-user-movies表里对用用户与id的数据
      // console.log(that.data.title)
      if(that.data.title == '收藏'){
        db.collection('seed-user-movies').where({
          user: app.globalData.openId,
          _id: e.target.dataset.item._id,
        }).remove().then(res => {
          // console.log(res)
          that.dataSc();
        })
        .catch(console.error)
      }else{
        db.collection('seed-user-movies').where({
          user: app.globalData.openId,
          movieId: e.target.dataset.item._id,
        }).remove().then(res => {
          // console.log(res)
          that.dataUp();
        })
        .catch(console.error)
      }
      wx.showToast({
        title: '取消收藏',
        icon: 'success',
        duration: 1000
      })

      // 这里逻辑有点问题，问题应该不大
      that.setData({
        value: ''
      })
    },

    // 点击收藏标签的数据获取
    dataSc:function(){
      const that = this
      db.collection('seed-user-movies').where({
        user: app.globalData.openId
      }).get().then(res => {
        // console.log(res.data)
        that.setData({
          dataList: res.data
        })
      })
    },

    // 搜索框每次输入，更新value
    onValueUp(e){
      this.setData({
        value: e.detail
      })
    },

    // 点击搜索框搜索
    onSearch: function(){
      wx.showLoading({
        title: '搜索中',
      })
      const that = this
      // console.log(this.data.value)

      // 收藏标签与其他标签的要分开查
      if(that.data.title == '收藏'){
        db.collection('seed-user-movies').where({
          title: db.RegExp({
            regexp:  `${that.data.value}`,
            options: 'i'
          }),
          user: app.globalData.openId
        }).get().then(res1 => {
          that.setData({
            dataList: res1.data
          })
          wx.hideLoading()
        })
      }else{
        db.collection('seed-movies').where({
          title: db.RegExp({
            regexp:  `${that.data.value}`,
            options: 'i',
          }),
          classify: that.pageData.classify[that.data.title]
        }).get().then(res1 => {
          // 获取对应分类下用户收藏的数据， 就是为了让star颜色改变
          db.collection('seed-user-movies').where({
            user: app.globalData.openId,
            classify: that.pageData.classify[that.data.title]
          }).get().then(res2 => {
            for(let i = 0; i < res1.data.length; i++){
              let id = res1.data[i]._id
              for(let j = 0; j < res2.data.length; j++){
                if(id == res2.data[j].movieId){
                  res1.data[i].flag = 1
                }
              }
            }
            that.setData({
              dataList: res1.data
            })
            wx.hideLoading()
          })
        })
      }
      
      
    },

    // 点击取消搜索
    onCancel: function(){
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        duration: 1000
      })
      const that = this
      if(that.data.title == '收藏'){
        that.dataSc();
      }else{
        that.dataUp();
      }
      this.setData({
        value: ''
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
        this.setData({

        }),
        wx.stopPullDownRefresh({
          success: (res) => {},
        })
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