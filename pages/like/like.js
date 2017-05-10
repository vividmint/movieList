const AV = require('../../utils/av-weapp-min.js');
import {
    appKey,
    appId,
    LIKELIMIT
} from '../../constans.js';

var app = getApp()

Page({
    data: {
        isEmpty: false,
        isLoadingEnd: false,
        movieData: {

        },
        listArr: [],
        userInfo: {

        }
    },
    onLoad: function(option) {
        wx.showLoading({
            title: '加载中...',
        })

        this.setData({
            windowHeight: app.globalData.windowInfo.height,
            windowWidth: app.globalData.windowInfo.width
        })
        wx.setNavigationBarTitle({
            title: '我的心愿单'
        })
        app.getUserInfo((userInfo) => {
            this.setData({
                userInfo
            })
            this.getList({
                success: (data) => {
                    wx.hideLoading();
                    if (data.length === 0) {
                        this.setData({
                            isEmpty: true
                        })
                        return;
                    }
                    let listArr = [].concat(this.data.listArr),
                        movieData = Object.assign({}, this.data.movieData);
                    for (let i = 0; i < data.length; ++i) {
                        let id = data[i].id;
                        listArr.push(data[i].id);
                        movieData[id] = data[i].attributes.movie.attributes;
                    }
                    this.setData({
                        listArr,
                        movieData
                    })
                }
            });
        })
    },
    getList: function(params) {
        var query = new AV.Query('LikeList');
        var user = AV.Object.createWithoutData('_User', app.globalData.userInfo.objectId);
        query.equalTo('user', user);
        if (params.fromId) {
            query.lessThan('objectId', params.fromId)
        }
        query.descending('objectId');
        // 想在查询的同时获取关联对象的属性则一定要使用 `include` 接口用来指定返回的 `key`
        query.include('movie');
        query.limit(`${LIKELIMIT}`); // 最多返回 10 条结果

        query.find().then(data => {
            params.success(data);
        }).catch(e => {
            console.log(e)
        })
    },
    lower: function() {
        if (!this.data.isLoadingEnd) {
            wx.showLoading({
                title: '加载中...',
            })
            let fromId = this.data.listArr[this.data.listArr.length - 1];
            this.getList({
                fromId,
                success: (data) => {
                    wx.hideLoading();
                    if (data.length === 0) {
                        this.setData({
                            isLoadingEnd: true
                        })
                        return;
                    }
                    let listArr = [].concat(this.data.listArr),
                        movieData = Object.assign({}, this.data.movieData);
                    for (let i = 0; i < data.length; ++i) {
                        let id = data[i].id;
                        listArr.push(data[i].id);
                        movieData[id] = data[i].attributes.movie.attributes;
                    }
                    this.setData({
                        listArr,
                        movieData
                    })
                }
            });
        }
    },
    onShareAppMessage: function() {
        return {
            title: '电影心愿单',
            path: '/page/index',
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
                console.log(res)
            }
        }
    }
})
