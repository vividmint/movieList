// demo.js
Page({
    data: {
        list: []
    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        let list = []
        for (let i = 0; i < 10; i++) {
            list.push({
                zIndex:i,
                id:i,
                text: "xxxxxxx" + i,
                animationData: {}
            })
        }
        this.setData({
            list: list
        })

        setInterval(()=>{
          let _list = [].concat(this.data.list);
          _list.shift()
          this.setData({
            list: _list
          })
        },5000)
    },
    ontap: function(e) {
        this.animation = wx.createAnimation({
            duration: 100,
            timingFunction: 'ease',
            delay: 0
        })
        let list = [
          ...this.data.list
        ]
        this.animation.rotate(10).translate(10, 15).step();
        let id = e.target.dataset.id;
        console.log(id)
            list[id].animationData = this.animation.export();
        this.setData({
            list: list
        })
    },
    onReady: function() {
        // 页面渲染完成
    },
    onShow: function() {
        // 页面显示
    },
    onHide: function() {
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    }
})
