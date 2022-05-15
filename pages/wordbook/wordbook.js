// pages/wordbook/wordbook.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataLs: [
      {
        id: 1,
        title: '四级单词书',
        num: '2000词',
        src: '../../images/Word/book-4.png'
      },
      {
        id: 2,
        title: '六级单词书',
        num: '2000词',
        src: '../../images/Word/book-6.png'
      },
      {
        id: 3,
        title: '八级单词书',
        num: '2000词',
        src: '../../images/Word/book-4.png'
      }
    ]
  },
  // 点击单词书，跳转到单词详情，所有单词
  goWDetail: function(){
    wx.navigateTo({
      url: `/pages/wdetail/wdetail?m=d`  // m=d为了判断是从单词数跳转过去的
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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