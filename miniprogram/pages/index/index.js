//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    dataArr: [],
  },
  /**
* 用户点击右上角分享
*/
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '不可错过的头条新闻',
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }

  },
  //获取到图片的个数
  imageCount: function (obj) {
    if ("thumbnail_pic_s03" in obj) {
      return [obj.thumbnail_pic_s, obj.thumbnail_pic_s02, obj.thumbnail_pic_s03];
    }
    if ("thumbnail_pic_s02" in obj) {
      return [obj.thumbnail_pic_s, obj.thumbnail_pic_s02];
    }
    if ("thumbnail_pic_s" in obj) {
      return [obj.thumbnail_pic_s];
    }
  },
  onLoad: function () {
    this.onPullDownRefresh();
  },
  onPullDownRefresh: function () {
    this.requestHTTP();
  },
  array_contain: function (obj) {
    var i = this.globalData.tempArrs.length;
    while (i--) {
      if (this.globalData.tempArrs[i].title === obj.title) {
        console.log("true");
        return true;
      }
    }
    console.log("false");
    return false;
  },
  geturlPath: function (url) {
    var index = url.indexOf("mobile/");
    if (index > 0) {
      url = url.substring(index);
      return url.replace(".html", "");
    }
  },
  requestHTTP: function () {
    var that = this
    console.log("requestHTTP");
    wx.request({
      url: 'http://v.juhe.cn/toutiao/index',
      data: {
        'type': "top",
        'key': 
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        const dataArrs = res.data.result.data
        for (var i = 0; i < dataArrs.length; i++) {
          console.log(i);
          var obj = dataArrs[i];
          obj.countArrs = that.imageCount(obj);
          obj.httpurl = that.geturlPath(obj.url);
          if (that.array_contain(obj)) { continue };
          that.globalData.tempArrs.push(obj);
        }
        that.setData({
          dataArr: that.globalData.tempArrs
        })
        wx.stopPullDownRefresh();
      },
      fail: function () {
        // fail
        console.log('使用你自己的key');
      },
      complete: function () {
        // complete

      }
    })
  },
  globalData: {
    tempArrs: []
  }
})
