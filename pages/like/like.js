//index.js
//获取应用实例
var app = getApp()
var defaultData = {
    likeArr: [7797267,7797268],
    unlikeArr: [],
    movieData: {
        7797267: {
            messageId: 7797267,
            picObj: {
                width: 600,
                height: 337,
                url: '../../fine.jpg'
            },
            cnName: '你的名字你的名字你的名字你的名字',
            score: '8.4',
            detail: '在远离大都会的小山村，住着巫女世家出身的高中女孩宫水三叶（上白石萌音 配音）。校园和家庭的原因本就让她充满烦恼，而近一段时间发生的奇怪事件，又让三叶摸不清头脑。不知从何时起，...',
            liked: 1,
            isShow: true
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
            liked: 1,
            isShow: false
        }
    }
}
Page({
    data: defaultData,
    onLoad: function(option) {
        // 页面初始化 options为页面跳转所带来的参数
        var windowWidth, windowHeight;
        var movieData = this.data.movieData,
            isShowId = this.data.isShowId;
        wx.getSystemInfo({
            success: function(res) {
                windowWidth = res.windowWidth;
                windowHeight = res.windowHeight;
            }
        })
        this.setData({
            windowWidth,
            windowHeight
        })
    },
    likeAction: function(params) {
        let id = this.data.isShowId;
        let obj = this.data.movieData;
        let likeArr = [],
            unlikeArr = [];
        if (params.action === 'like') {
            obj[id].liked = 1;
            // let likeData = this.data.likeArr.splice(obj[id], 1);
            likeArr.push(id);
            console.log(likeArr);
        } else if (params.action === 'unlike') {
            obj[id].liked = 2;
            unlikeArr.push(id);
        }
        this.setData({
            movieData: obj,
            likeArr,
            unlikeArr
        })
        console.log(this.data);
    }
})
