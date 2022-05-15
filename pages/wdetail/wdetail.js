// pages/wdetail/wdetail.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sList: [],  // 搜索跳转过来的数据
    m: '',  // 不同跳转过来的方式，跳转到不同的页面
    oneData: {},  // 一个一个单词背时的数据
    mValue: 0,  // 点击刚跳转过来时的value,最大value
    value: 0 // 当前正在背的单词的value
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    const that = this
    console.log(options)

    // 如果是点击搜索跳转进来的
    if(options.m == 's'){
      let str = options.value || 'a'
      that.setData({
        m: 's'
      })
      if(/^[a-zA-Z]*$/.test(str)){  // 匹配全为字母的字符串
        db.collection('seed-words').where({
          word: db.RegExp({
            regexp:  str,
            options: 'i'
          })
        }).get().then(res => {
            // console.log(res.data[0])
            that.setData({
              sList: res.data
            })
        })
      }else if(/^[\u4e00-\u9fa5]*$/.test(str)){  // 匹配全为汉字的字符串
        db.collection('seed-words').where({
          exp: db.RegExp({
            regexp:  str,
            options: 'i'
          })
        }).get().then(res => {
          // console.log(res)
          that.setData({
            sList: res.data
          })
        })
      }

      // 点击开始学习跳转进来的
    }else if(options.m == 'k'){
      let value = parseInt(options.value) || 0   // 应该是第几个要背的单词
      // 根据要背的单词在数据库的顺序， 查单词的详情
      db.collection('seed-words').where({}).skip(value).limit(1).get().then(res => {
        that.setData({
          oneData: res.data[0],
          mValue: value + 1,
          value: value + 1
        })
        // 这时候就要触发一下， 触发一下word里面的事件，一位一进来就已经新增单词了
        eventChannel.emit('nextEvent', {value: that.data.mValue});
      })
      .catch(err => {
        console.error(err)
      })
      that.setData({
        m: 'k'
      })

      // 如果是点击我的单词跳转进来的
    }else if(options.m == 'm'){
      // 查出已经背过得单词的
      db.collection('seed-words').where({}).limit(parseInt(options.num)).get().then(res => {
        console.log(res)
        that.setData({
          sList: res.data,
          m: 'm'
        })
      })
      // 如果是从单词书跳转过来的
    }else if(options.m == 'd'){
      db.collection('seed-words').where({}).get().then(res => {
        // console.log(res)
        that.setData({
          sList: res.data,
          m: 'm'
        })
      })
    }
  },

  pre: function(){
    const that = this
    console.log(that.data.value)
    // 获取新的单词数据, 不更新最大value
    db.collection('seed-words').where({}).skip(that.data.value-2).limit(1).get().then(res => {
      that.setData({
        oneData: res.data[0],
        value: that.data.value - 1
      })
    })
    .catch(err => {
      console.error(err)
    })
  },

  // 切换下一个单词
  next: function(){
    const that = this
    const eventChannel = this.getOpenerEventChannel()
    let curValue = that.data.value + 1
    // console.log(that.data.value, that.data.mValue)
    if(curValue > that.data.mValue){
      // 获取新的单词数据, 并且更新最大value
      db.collection('seed-words').where({}).skip(that.data.value).limit(1).get().then(res => {
        eventChannel.emit('nextEvent', {value: curValue});
        that.setData({
          oneData: res.data[0],
          mValue: curValue,
          value: curValue
        })
      })
      .catch(err => {
        console.error(err)
      })
    }else{
      // 获取新的单词数据, 不更新最大value
      db.collection('seed-words').where({}).skip(that.data.value).limit(1).get().then(res => {
        that.setData({
          oneData: res.data[0],
          mValue: curValue,
          value: curValue
        })
      })
      .catch(err => {
        console.error(err)
      })
    }
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