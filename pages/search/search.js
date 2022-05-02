// pages/search/search.js
const db = wx.cloud.database();//初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchVal: "",
    //搜索过后商品列表
    goodList:[]
  },
  input(e) {
    this.setData({
      searchVal: e.detail.value
    })
    console.log(e.detail.value)
  },
  clear: function () {
    this.setData({
      searchVal: ""
    })
  },
  //商品关键字模糊搜索
  search: function () {
    wx: wx.showLoading({
      title: '加载中',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    //重新给数组赋值为空
    this.setData({
      'goodList': []
    })
    // 数据库正则对象
    db.collection('shoop').where({
      title: db.RegExp({
        regexp: this.data.searchVal,//做为关键字进行匹配
        options: 'i',//不区分大小写
      })
    })
    .get().then(res => {
      console.log(res.data)
      for (var i = 0; i < res.data.length; i++) {
        var title = "goodList[" + i + "].title"
        var id = "goodList[" + i + "].id"
        var image = "goodList[" + i + "].image"
        var rmb = "goodList[" + i + "].rmb"
        var content = "goodList["+ i +"].content"
        this.setData({
          [title]: res.data[i].title,
          [id]: res.data[i]._id,
          [image]: res.data[i].fileIDs[0],
          [rmb]: res.data[i].rmb,
          [content]: res.data[i].contnet,
        })
        console.log(this.data.goodList[i].content)
        wx.hideLoading();
      }
    }).catch(err => {
      console.error(err)
      wx.hideLoading();
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options.searchVal)//输出其他页面传来的值
    if (options.searchVal != '') {
      console.log("不为空")
      this.setData({
        searchVal: options.searchVal
      })
      this.search();
    }else{
      console.log("为空")
      that.search();
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
})