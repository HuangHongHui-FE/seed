// pages/word/word.js
const db = wx.cloud.database()
const _ = db.command
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // isLogin: true,
        // 搜索框填入的
        value: '',
        dataObj: {},
        // 打卡日历的显示与否
        show: false,
        formatter(day) {
            // console.log(day)
            // const month = day.date.getMonth() + 1;
            // const date = day.date.getDate();
            // console.log(month, date)
            return day;
        },
        // minDate: new Date(2022, 3, 1).getTime(),
        // maxDate: new Date(2022, 4, 9).getTime(),
        
    },

    // 点击开始学习
    start_study: function(){
        // console.log('开始学习')
        const that = this
        let all_num = that.data.dataObj.all_num
        console.log(all_num)
        wx.navigateTo({
            url: `/pages/wdetail/wdetail?value=${all_num}&m=k`,  // m=k为了判断是点击开始学习的跳转
            events: {
                // 监听器, 当点击next的时候会更新今天已经背的数据，还有总共已经背的单词数据
                nextEvent: function(e) {
                    console.log(e)  // 获取的是已经背的单词数，更新数据库
                    that.setData({
                        dataObj: {
                            all_num: e.value,
                            flag: that.data.dataObj.flag,
                            history: that.data.dataObj.history, ///  hou?????????????????????
                            openId: that.data.dataObj.openId,
                            today_num: that.data.dataObj.today_num + 1
                        }
                    })

                    // 数据库数据也更新
                    // console.log(that.data.dataObj.openId)
                    db.collection('seed-users').where({
                        openId: that.data.dataObj.openId
                    })
                    .update({
                        data: {
                            today_num: _.inc(1),
                            all_num: _.inc(1),
                            history: that.data.dataObj.history  // 也要更新？？？？？？？？？？？？
                        }
                    }).then(res => {
                        console.log(res)
                    })
                }
              }
        })

    },

    input: function(e){
        this.setData({
            value: e.detail.value
        })
    },

    // 点击搜索
    search: function(){
        const that = this
        // console.log(this.data.value)
        let str = that.data.value
        if(/^[a-zA-Z]*$/.test(str) || /^[\u4e00-\u9fa5]*$/.test(str)){
            wx.navigateTo({
                url: `/pages/wdetail/wdetail?value=${str}&m=s`  // m=s为了判断是搜索跳转
            })
        }else{
            wx.showToast({
                title: '输入有误',
                icon: 'error',
                duration: 1000
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const that = this
        wx.cloud.callFunction({
            name: 'seed-word'
        }).then(res => {
            res = res.result.data[0]
            app.globalData.all_num = res.all_num
            // console.log(res)
            // 判断是不是新的一天
            let dateObj = new Date();
            let day = dateObj.getDate();
            let month = dateObj.getMonth() + 1;
            let year = dateObj.getFullYear();
            let str = "" + year + '-' + month + "-" + day
            if(!res.history.includes(str)){
                db.collection('seed-users').where({
                    openId: that.data.dataObj.openId
                }).update({
                    data: {
                        history: _.push(str),
                        today_num: 0
                    }
                }).then(res1 => {
                    res.history.push(str);
                    res.today_num = 0;
                })
            }
            that.setData({
                dataObj: res
            })
        })
    },

    // 点击打卡日历
    history: function(){
        const that = this
        let history = that.data.dataObj.history
        let first = history[0].split('-'), last = history[history.length-1].split('-');
        
        that.setData({
            show: true,
            // 定义让他在日历上显示哪些日期
            formatter(day){
                const month = day.date.getMonth();
                const date = day.date.getDate();
                // console.log(month, date)   // 4    1,2,3,4...
                for(let i = 0; i < history.length; i++){
                    // console.log(parseInt(history[i].split('-')[2])) // 3, 2
                    // console.log(parseInt(history[i].split('-')[1])) // 4 , 5
                    if(month == parseInt(history[i].split('-')[1]) - 1 && date == history[i].split('-')[2]){
                        day.type = 'multiple-selected'
                    }
                }
                return day
            },
            minDate: new Date(parseInt(first[0]), parseInt(first[1]) - 1, parseInt(first[2])).getTime(),
            maxDate: new Date(parseInt(last[0]), parseInt(last[1]) - 1, parseInt(last[2])).getTime()
        })
    },
    onClose() {
        this.setData({ show: false });
    },
    onConfirm(event) {
        console.log(event)
        this.setData({
            show: false
        });
    },


    // 跳转到单词本
    goWordBook: function(){
        wx.navigateTo({
            url: '/pages/wordbook/wordbook'  // m=d为了判断是从单词数跳转过去的
        })
    },

    // 跳转到真题资料
    goRealBook: function(){
        wx.navigateTo({
            url: '/pages/realbook/realbook'  // m=d为了判断是从单词数跳转过去的
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
        console.log(this.data.dataObj, app.globalData.openId)
        if(!this.data.dataObj[history]){
            // console.log('a')
            this.onLoad()
        }
        if(app.globalData.openId == ''){
            wx.switchTab({
              url: '/pages/contact/cantact'
            })
        }
    },
    // 编写宣言
    edit: function(){
        const that = this
        db.collection('seed-users').where({
            openId: that.data.dataObj.openId
        })
        .update({
            data: {
                flag: that.data.dataObj.flag
            },
        }).then(res => {
            wx.showToast({
                title: '修改成功',
                icon: 'success',
                duration: 1000
              })
        })
    },
    flagInput: function(e){
        let dataObj = this.data.dataObj
        dataObj.flag = e.detail.value
        this.setData({
            dataObj
        })
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