//获取应用实例
let app = getApp();
let touch = {
    //拖拽数据
    startPoint: null,
    translateX: null,
    translateY: null
};

let defaultData = {
    isAnimation: false,
    userInfo: {},
    touchDot: 0, //触摸时的原点
    interval: "", // 记录/清理 时间记录
    coord: {
        x: 0,
        y: 0
    },
    unReadArr: [
        7797267, 7797268, 7797269
    ],
    likeArr: [],
    unlikeArr: [],
    movieData: {
        7797267: {
            messageId: 7797267,
            picObj: {
                width: 600,
                height: 337,
                url: '../../one.jpeg'
            },
            cnName: '你的名字你的名字你的名字你的名字',
            score: '8.4',
            detail: '在远离大都会的小山村，住着巫女世家出身的高中女孩宫水三叶（上白石萌音 配音）。校园和家庭的原因本就让她充满烦恼，而近一段时间发生的奇怪事件，又让三叶摸不清头脑。不知从何时起，...',
            liked: 0,
            isShow: true,
            animationData: {},
            index: 2
        },
        7797268: {
            detail: "《一条狗的使命》3月3日上映，豆瓣8分。 拉斯·霍尔斯道姆执导，影片讲述了一条狗经历多次重生，在一次次生命的轮回中寻找不同的使命，最后又回到了最初的主人身边的故事。豆瓣热门短评：“催泪型温情片，故事比较俗套但是不影响好看啊。”",
            messageId: 7797268,
            cnName: "一条狗的使命",
            score: 8.0,
            picObj: {
                width: 424,
                height: 600,
                url: "https://cdn.ruguoapp.com/FueNyDQcxhc9o0zeQjtqhTGOXPOd.jpg?imageView2/0/h/1000/interlace/0/q/80"
            },
            liked: 0,
            isShow: false,
            animationData: {},
            index: 1
        },
        7797269: {
            messageId: 7797269,
            picObj: {
                width: 600,
                height: 337,
                url: '../../fine.jpg'
            },
            cnName: '金刚狼3：殊死一战',
            score: '8.3',
            detail: '詹姆斯·曼高德执导，休·杰克曼最后一次饰演金刚狼。该片根据漫威漫画改编，故事背景设定在2029年，讲述迈入暮年的金刚狼渐渐失去了体内的自愈因子，当一个与他能力相似的变种人劳拉出现，金刚狼决定出山保护劳拉的故事。',
            liked: 0,
            isShow: false,
            animationData: {},
            index: 0
        },
    }
}
defaultData.isShowId = defaultData.unReadArr[0];
Page({
    data: defaultData,
    onLoad: function(option) {
        let windowWidth, windowHeight;
        let movieData = this.data.movieData,
            isShowId = this.data.isShowId;
        wx.getSystemInfo({
            success: function(res) {
                windowWidth = res.windowWidth;
                windowHeight = res.windowHeight;
            }
        })
        let that = this;
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function(userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
        })
        this.setData({
            windowWidth,
            windowHeight
        })
    },
    onReady: function() {
        this.animation = wx.createAnimation({
            duration: 250,
            timingFunction: 'ease',
            delay: 0
        })
    },
    touchStart: function(e) {
        touch.startPoint = e.touches[0];
    },
    //触摸移动事件
    touchMove: function(e) {
        let movieData, rotate;
        let currentPoint = e.touches[e.touches.length - 1];
        let translateX = currentPoint.clientX - touch.startPoint.clientX;
        let translateY = currentPoint.clientY - touch.startPoint.clientY;
        this.animation = wx.createAnimation({
            duration: 70,
            timingFunction: 'ease',
            delay: 0
        })

        if (translateX < 0) {
            if (translateX > -10) {
                rotate = -1;
            } else {
                rotate = -4;
            }
        }
        if (translateX > 0) {
            if (translateX < 10) {
                rotate = 1;
            } else {
                rotate = 4;
            }
        }
        // if (translateX < 0) {
        //     rotate = 1/Math.atan(translateY/ translateX);
        // } else {
        //     rotate = Math.atan(translateX / translateY) * 3;
        // }
        this.animation.rotate(rotate).translate(translateX, 0).step();
        movieData = this.data.movieData;
        movieData[this.data.isShowId].animationData = this.animation.export();
        this.setData({
            movieData
        })
        touch.translateX = translateX;
        touch.translateY = translateY;

        if(!this.data.isAnimation){
          if (translateX >= 35) {
              console.log('右划')
              this.animation.rotate(10).translate(this.data.windowWidth+100, 0).step();
              movieData = this.data.movieData;
              movieData[this.data.isShowId].animationData = this.animation.export();
              this.markAsRead();
          }
          if (translateX <= -35) {
              console.log('左划')
              this.animation.rotate(10).translate(-this.data.windowWidth-100, 0).step();
              movieData = this.data.movieData;
              movieData[this.data.isShowId].animationData = this.animation.export();
              this.markAsRead();
          }
          this.setData({
              movieData,
              isAnimation:true
          })
        }
    },
    // 触摸结束事件
    touchEnd: function(e) {
        let movieData;
        if (e.changedTouches[0].clientX > 340) {
            //右划
            this.animation.translate(this.data.windowWidth, 0).step();
            movieData = this.data.movieData;
            movieData[this.data.isShowId].animationData = this.animation.export();
            this.markAsRead();
        } else if (e.changedTouches[0].clientX < 70) {
            //左划
            this.animation.translate(-this.data.windowWidth, 0).step();
            movieData = this.data.movieData;
            movieData[this.data.isShowId].animationData = this.animation.export();
            this.markAsRead();
        } else {
            //返回原位置
            this.animation.rotate(0).translate(0, 0).step();
            this.setData({
                isAnimation:false
            })

            movieData = this.data.movieData;
            movieData[this.data.isShowId].animationData = this.animation.export();
        }

        this.setData({
            movieData
        })

    },
    likeAction: function(params) {
        let id = this.data.isShowId;
        let obj = this.data.movieData;
        let likeArr = [],
            unlikeArr = [];
        if (params.action === 'like') {
            obj[id].liked = 1;
            likeArr.push(id);
        } else if (params.action === 'unlike') {
            obj[id].liked = 2;
            unlikeArr.push(id);
        }
        this.setData({
            movieData: obj,
            likeArr,
            unlikeArr
        })
    },
    onLike: function() {
        let id = this.data.isShowId;
        let likeArr = [];
        this.data.movieData[id].liked = 1;
        likeArr.push(id);
        this.animation.rotate(10).translate(this.data.windowWidth + 100, 100).step();
        let movieData;
        movieData = this.data.movieData;
        movieData[id].animationData = this.animation.export();

        this.setData({
            movieData,
            likeArr
        })
        this.markAsRead();
    },
    onUnlike: function() {
        this.animation = wx.createAnimation({
            duration: 400,
            timingFunction: 'ease',
            delay: 0
        })
        let id = this.data.isShowId;
        let unlikeArr = [];
        this.data.movieData[id].liked = 2;
        unlikeArr.push(id);

        this.animation.rotate(-10).translate(-this.data.windowWidth - 100, 100).step();
        let movieData;
        movieData = this.data.movieData;
        movieData[id].animationData = this.animation.export();

        this.setData({
            movieData,
            unlikeArr
        })
        this.markAsRead();
    },
    markAsRead: function() {
        let id = this.data.isShowId;
        let movieData = this.data.movieData;
        let unReadArr = this.data.unReadArr;
        let i = unReadArr.indexOf(id);
        let nextId = unReadArr[i + 1];
        this.setData({
            isShowId: nextId,
            isAnimation:false
        })
    },
    toUserList: function() {
        try {
            wx.navigateTo({
                url: '../like/like'
            });
        } catch (e) {
            console.log(e);
        } finally {

        }
    }
})
