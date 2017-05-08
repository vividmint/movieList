//获取应用实例
let app = getApp();
let getList = require('../../load.js')
let touch = {
    //拖拽数据
    startPoint: null,
    translateX: null,
    translateY: null,
    timeStampStart: null,
    timeStampEnd: null
};
let defaultData = {
    zIndex: 100000,
    page: 0,
    isAnimation: false,
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
}

Page({
    data: defaultData,
    onLoad: function(option) {
        let windowWidth, windowHeight, isShowId, listArr, zIndex;

        let movieData = this.data.movieData;

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
                userInfo
            })
        })
        getList.getMovieData({
            page: this.data.page,
            success: ({
                movieData,
                idSets
            }) => {
                listArr = Array.from(idSets);
                isShowId = listArr[0];
                let zIndex;
                for (let i = 0; i < listArr.length; i++) {
                    zIndex = this.data.zIndex - i;
                    movieData[listArr[i]].zIndex = zIndex;
                }
                that.setData({
                    movieData,
                    idSets,
                    isShowId,
                    listArr,
                    zIndex
                })
                console.log('listAr1r',this.data.listArr)

                setTimeout(()=>{
                  listArr = [
                    ...this.data.listArr
                  ];
                  listArr.shift();
                  console.log('listArr2',listArr)
                  this.setData({
                    listArr:listArr,
                    isShowId:listArr[0]
                  })
                },3000)
            }
        })

        this.setData({
            windowWidth,
            windowHeight
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
        console.log(time)
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
        let listArr = this.data.listArr;
        let result = this.finRemainArr({
            listArr,
            id
        });
        this.deleteItem(id)

        if (result <= 1) {
            this.loadMore();
        }
        let i = listArr.indexOf(id);
        let nextId = listArr[i + 1];
        this.setData({
            isShowId: nextId
        })
        console.log('mark', this.data.isShowId)

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
    finRemainArr: function(params) {
        let lastArr;
        let i = params.listArr.indexOf(params.id) + 1;
        lastArr = [].concat(params.listArr).splice(i);
        return lastArr.length;
    },
    loadMore: function() {
        console.log('more')
        let page = ++this.data.page;
        let _movieData, _listArr, _isShowId;
        getList.getMovieData({
            page,
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
                console.log('-', _listArr)
                let zIndex = this.data.zIndex;
                for (let i = 0; i < _listArr.length; i++) {
                    zIndex--;
                    _movieData[_listArr[i]].zIndex = zIndex;
                }
                let listArrPlus = this.data.listArr.concat(_listArr);
                this.setData({
                    movieData: _movieData,
                    listArr: listArrPlus,
                    zIndex
                })
            }
        })
    },
    deleteItem: function(id) {
        let index = this.data.listArr.indexOf(id);
        let listArr = [].concat(this.data.listArr);
        let _listArr;
        if (index >= 3) {
            _listArr = listArr.slice(index);
            console.log('slice', _listArr)
            let isShowId = _listArr[0];
            this.setData({
                listArr: _listArr,
                isShowId
            })
            if(this.data.listArr.length<=3){
              this.loadMore();
            }
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
