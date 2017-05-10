const AV = require('./utils/av-weapp-min.js');
AV.init({
    appId: 'FTwd0NMfXvTdENGONHoT5FAp-gzGzoHsz',
    appKey: 'v6qtxRqeTEjz3Xm0VI7T0kNx',
});
const user = AV.User.current();

App({
    onLaunch: function() {
        try {
            var res = wx.getSystemInfoSync()
            this.globalData.windowInfo.width = res.windowWidth;
            this.globalData.windowInfo.height = res.windowHeight;
        } catch (e) {
          console.log(e)
            // Do something when catch error
        }
    },
    getUserInfo: function(cb) {
        AV.User.loginWithWeapp().then(userInfo => {
            this.globalData.userInfo = userInfo.toJSON();
            cb(this.globalData.userInfo);
        }).catch(console.error);
    },
    globalData: {
        movieData: null,
        userInfo: null,
        windowInfo: {}
    }
})
