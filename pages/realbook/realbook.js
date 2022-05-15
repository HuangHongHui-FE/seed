// pages/realbook/realbook.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataLs: [
      {
        id: 1,
        title: '2020四级真题',
        num: '第(一)套',
        src: '../../images/Word/book-4.png',
        cloudId: 'cloud://cloud1-1gn5uyhza8931345.636c-cloud1-1gn5uyhza8931345-1305284859/2020年09月大学英语4级（卷一）.pdf'
      },
      {
        id: 2,
        title: '2020四级真题',
        num: '第(二)套',
        src: '../../images/Word/book-4.png',
        cloudId: 'cloud://cloud1-1gn5uyhza8931345.636c-cloud1-1gn5uyhza8931345-1305284859/2020年09月大学英语4级（卷二）.pdf'
      },
      {
        id: 3,
        title: '2020四级真题',
        num: '第(三)套',
        src: '../../images/Word/book-4.png',
        cloudId: 'cloud://cloud1-1gn5uyhza8931345.636c-cloud1-1gn5uyhza8931345-1305284859/2020年09月大学英语4级（卷三）.pdf'
      },
      {
        id: 1,
        title: '2020六级真题',
        num: '第(一)套',
        src: '../../images/Word/book-6.png',
        cloudId: 'cloud://cloud1-1gn5uyhza8931345.636c-cloud1-1gn5uyhza8931345-1305284859/2020年09月大学英语6级（卷一）.pdf'
      },
      {
        id: 2,
        title: '2020六级真题',
        num: '第(二)套',
        src: '../../images/Word/book-6.png',
        cloudId: 'cloud://cloud1-1gn5uyhza8931345.636c-cloud1-1gn5uyhza8931345-1305284859/2020年09月大学英语6级（卷二）.pdf'
      },
      {
        id: 3,
        title: '2020六级真题',
        num: '第(三)套',
        src: '../../images/Word/book-6.png',
        cloudId: 'cloud://cloud1-1gn5uyhza8931345.636c-cloud1-1gn5uyhza8931345-1305284859/2020年09月大学英语6级（卷三）.pdf'
      }
    ]
  },

  // 打开pdf
  openPdf: function(e){
    let cloudId = e.currentTarget.dataset.cloudid

    wx.cloud.downloadFile({
        fileID: cloudId,
        success: res => { 
          console.log("文件下载成功",res);
          //提示框
          wx.showToast({
            title: '文件下载成功',
            icon:"success",
            duration:1000
          })

          //打开文件
          const filePath = res.tempFilePath
          wx.openDocument({
            filePath: filePath,
            success: function (res) {
              console.log('打开文档成功',res)
            }
          })
        },
      fail: err => {
          console.log("文件下载失败",err);
        }    
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