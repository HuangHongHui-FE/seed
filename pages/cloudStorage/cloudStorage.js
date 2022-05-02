// pages/cloudStorage/cloudStorage.js
Page({
    chooseImage(){
        // 上传图片第一步：选择要上传的图片
        wx.chooseImage({
          count: 1,  // 可以选择多少张图片
          sizeType: ['original','compressed'],
          sourceType: ['album','camera'],  // 设置图片来源
          success: (res) => {
            this.uploadImg(res.tempFilePaths[0])
          },
          fail: (res) => {},
          complete: (res) => {},
        })
      },
      // 上传图片第二步：直接上传图片到云存储
      uploadImg(temFile){
          wx.cloud.uploadFile({
              cloudPath:'oldfriend.png',
              filePath:temFile,
              success:res=>{
                  console.log('上传成功',res);
              },fail:err=>{

              }
          })
      },
    /**
     * 页面的初始数据
     */
    data: {

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