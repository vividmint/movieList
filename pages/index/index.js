//获取应用实例
let app = getApp();
const AV = require('../../utils/av-weapp-min.js');
let load = require('../../load.js')

let zIndex = 10000 //zindex全局变量
let touch = {
    //拖拽数据
    startPoint: null,
    translateX: null,
    translateY: null,
    timeStampStart: null,
    timeStampEnd: null
};
Page({
    data: {
        slideTimes: 0,
        userInfo: {},
        touchDot: 0, //触摸时的原点
        coord: {
            x: 0,
            y: 0
        },
        idSets: null,
        listArr: null,
        likeArr: [],
        unlikeArr: [],
        movieData: {}
    },
    onLoad: function(option) {
        let isShowId, listArr;
        let movieData = this.data.movieData;
        this.setData({
          windowHeight:app.globalData.windowInfo.height,
          windowWidth:app.globalData.windowInfo.width
        })
        let that = this;
        app.getUserInfo(function(userInfo) {
            //更新数据
            that.setData({
                userInfo
            })
        })
        load.getMovieData({
            success: ({
                movieData,
                idSets
            }) => {
                listArr = Array.from(idSets);
                isShowId = listArr[0];
                for (let i = 0; i < listArr.length; i++) {
                    movieData[listArr[i]].zIndex = --zIndex;
                }
                that.setData({
                    movieData,
                    idSets,
                    isShowId,
                    listArr
                })
            }
        })

    },

    touchStart: function(e) {
        touch.startPoint = e.touches[0];
        let timeStampStart = new Date().getTime();
        this.animation = wx.createAnimation({
            duration: 70,
            timingFunction: 'ease',
            delay: 0
        })
        this.touch = {
            timeStampStart
        }

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
        this.animation.rotate(rotate).translate(translateX, 10).step();
        let id = this.data.isShowId;
        movieData = this.data.movieData;
        movieData[id].animationData = this.animation.export();
        this.setData({
            movieData
        })

    },
    // 触摸结束事件
    touchEnd: function(e) {
        // return;
        let movieData;
        let translateX = e.changedTouches[0].clientX - touch.startPoint.clientX;
        let translateY = e.changedTouches[0].clientY - touch.startPoint.clientY;
        let timeStampEnd = new Date().getTime();
        let time = timeStampEnd - this.touch.timeStampStart;
        let id = this.data.isShowId;
        let animation = wx.createAnimation({
            duration: 250,
            timingFunction: 'ease',
            delay: 0
        })
        if (time < 150) {
            //快速滑动
            if (translateX > 60) {
                //右划
                console.log('右划...')
                this.markAsRead();
                animation.rotate(0).translate(this.data.windowWidth, 0).step();
                movieData = this.data.movieData;
                movieData[id].animationData = animation.export();
                this.setData({
                    movieData
                })
            } else if (translateX < -60) {
                //左划
                console.log('左划...')
                this.markAsRead();
                animation.rotate(0).translate(-this.data.windowWidth, 0).step();
                movieData = this.data.movieData;
                movieData[id].animationData = animation.export();
                this.setData({
                    movieData
                })
            } else {
                //返回原位置
                animation.rotate(0).translate(0, 0).step();
                movieData = this.data.movieData;
                movieData[this.data.isShowId].animationData = animation.export();
                this.setData({
                    movieData,
                })
            }
        } else {
            if (translateX > 160) {
                //右划
                console.log('右划...')
                this.markAsRead();
                animation.rotate(0).translate(this.data.windowWidth, 0).step();
                movieData = this.data.movieData;
                movieData[id].animationData = animation.export();
                this.setData({
                    movieData
                })
            } else if (translateX < -160) {
                //左划
                console.log('左划...')
                this.markAsRead();
                animation.rotate(0).translate(-this.data.windowWidth, 0).step();
                movieData = this.data.movieData;
                movieData[id].animationData = animation.export();
                this.setData({
                    movieData
                })
            } else {
                //返回原位置
                animation.rotate(0).translate(0, 0).step();
                movieData = this.data.movieData;
                movieData[this.data.isShowId].animationData = animation.export();
                this.setData({
                    movieData,
                })
            }
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
        load.likeAction({
            action: 'like',
            uid: app.globalData.userInfo.objectId,
            objectId: id
        })
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
        load.likeAction({
            action: 'unlike',
            uid: app.globalData.userInfo.objectId,
            objectId: id
        })
    },
    markAsRead: function() {
        let id = this.data.isShowId;
        let movieData = this.data.movieData;
        let listArr = this.data.listArr;
        let length = this.finRemainArrLength({
            listArr,
            id
        });
        let slideTimes = this.data.slideTimes;
        slideTimes++;
        if (length <= 1) {
            this.loadMore();
        }
        let i = listArr.indexOf(id);
        let nextId = listArr[i + 1];

        this.setData({
            isShowId: nextId,
            slideTimes
        })
        if (this.data.slideTimes >= 4) {
            this.deleteItem(id)
        }
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
    finRemainArrLength: function(params) {
        let i = params.listArr.indexOf(params.id) + 1;
        return params.listArr.slice(i).length;
    },
    loadMore: function() {
        console.log('more')
        let _movieData, _listArr, _isShowId, fromId;
        fromId = [].concat(this.data.listArr).pop()
        load.getMovieData({
            fromId: fromId,
            success: ({
                movieData,
                idSets,
            }) => {
                if (idSets.size === '0') {
                    alert('当前暂时没有新的电影了~');
                    return;
                }
                _movieData = Object.assign({}, this.data.movieData, movieData);
                _listArr = Array.from(idSets);
                for (let i = 0; i < _listArr.length; i++) {
                    _movieData[_listArr[i]].zIndex = --zIndex;
                    _movieData[_listArr[i]].isRender = true;
                }
                let listArrPlus = this.data.listArr.concat(_listArr);
                this.setData({
                    movieData: _movieData,
                    listArr: listArrPlus
                })
            }
        })
    },
    deleteItem: function(id) {
        let index = this.data.listArr.indexOf(id);
        let listArr = [].concat(this.data.listArr);
        let _listArr;
        if (index >= 3) {
            setTimeout(() => {
                let movieData = Object.assign({}, this.data.movieData);
                for (let i = 0; i < index - 2; i++) {
                    let id = listArr[i];
                    movieData[id].isRender = false;
                }
                this.setData({
                    slideTimes: 0,
                    movieData
                })
            }, 1000)

        }
        console.log('delete', this.data.listArr)
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
