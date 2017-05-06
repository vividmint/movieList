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
    slideTime: 0,
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
    },
    touchStart: function(e) {
        touch.startPoint = e.touches[0];
        this.animation = wx.createAnimation({
            duration: 80,
            timingFunction: 'ease',
            delay: 0
        })


    },
    //触摸移动事件
    touchMove: function(e) {
        let movieData, rotate;
        let currentPoint = e.touches[e.touches.length - 1];
        let translateX = currentPoint.clientX - touch.startPoint.clientX;
        let translateY = currentPoint.clientY - touch.startPoint.clientY;

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
        this.animation.rotate(rotate).translate(translateX, 10).step();
        let id = this.data.isShowId;
        movieData = this.data.movieData;
        movieData[id].animationData = this.animation.export();
        this.setData({
            movieData
        })
        if (translateX >= 35) {
            console.log('右划')

        }
        if (translateX <= -35) {
            console.log('左划')

        }

    },
    // 触摸结束事件
    touchEnd: function(e) {
        // return;
        let movieData;
        let translateX = e.changedTouches[0].clientX - touch.startPoint.clientX;
        let translateY = e.changedTouches[0].clientY - touch.startPoint.clientY;
        console.log("end", translateX);
        let id = this.data.isShowId;
        let animation = wx.createAnimation({
            duration:300,
            timingFunction: 'ease',
            delay: 0
        })
        if (translateX > 170) {
            //右划
            this.markAsRead();
            animation.rotate(0).translate(this.data.windowWidth, 0).step();
            movieData = this.data.movieData;
            movieData[id].animationData = animation.export();
            this.setData({
                movieData
            })
        } else if (translateX < -170) {
            //左划
            this.markAsRead();
            animation.rotate(0).translate(-this.data.windowWidth, 0).step();
            movieData = this.data.movieData;
            movieData[id].animationData = animation.export();
            this.setData({
                movieData
            })
        } else {
            //返回原位置
            let animation = wx.createAnimation({
                duration: 250,
                timingFunction: 'ease',
                delay: 0
            })
            animation.rotate(0).translate(0, 0).step();
            movieData = this.data.movieData;
            movieData[this.data.isShowId].animationData = animation.export();
            this.setData({
                movieData,
            })
        }



    },

    onLike: function() {
        this.clickAnimation({
            direction: 'right'
        });
        let id = this.data.isShowId;
        let likeArr = this.data.likeArr;
        likeArr.push(id);
        this.setData({
            likeArr
        })
        this.markAsRead();
    },
    onUnlike: function() {
        this.clickAnimation({
            direction: 'left'
        });
        let id = this.data.isShowId;
        let unlikeArr = this.data.unlikeArr;
        unlikeArr.push(id);

        this.setData({
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
            isShowId: nextId
        })
    },
    clickAnimation: function(params) {
        let x, y, duration, rotate, movieData;
        duration = 700;
        y = 100;
        if (params.direction === 'left') {
            rotate = -10;
            x = -this.data.windowWidth - 100;
        } else {
            rotate = 10;
            x = this.data.windowWidth + 100;
        }

        this.animation = wx.createAnimation({
            duration,
            timingFunction: 'ease',
            delay: 0
        })
        let id = this.data.isShowId;
        this.animation.rotate(rotate).translate(x, y).step();
        movieData = this.data.movieData;
        movieData[id].animationData = this.animation.export();
        this.setData({
            movieData
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
