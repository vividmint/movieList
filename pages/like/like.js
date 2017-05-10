const AV = require('../../utils/av-weapp-min.js');
import {
    appKey,
    appId,
    LIKELIMIT
} from '../../constans.js';

var app = getApp()

Page({
    data: {
        isLoadingEnd: false,
        movieData: {

        },
        listArr: [],
        userInfo: {

        }
    },
    onLoad: function(option) {
        this.setData({
            windowHeight: app.globalData.windowInfo.height,
            windowWidth: app.globalData.windowInfo.width
        })
        app.getUserInfo((userInfo) => {
            this.setData({
                userInfo
            })
            this.getList();
        })
    },
    getList: function(params) {
        var query = new AV.Query('LikeList');
        var user = AV.Object.createWithoutData('_User', app.globalData.userInfo.objectId);
        query.equalTo('user', user);
        if (params) {
            query.lessThan('objectId', params.fromId)
        }
        query.descending('objectId');
        // 想在查询的同时获取关联对象的属性则一定要使用 `include` 接口用来指定返回的 `key`
        query.include('movie');
        query.limit(`${LIKELIMIT}`); // 最多返回 10 条结果

        query.find().then(data => {
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
        }).catch(e => {
            console.log(e)
        })
    },
    lower: function() {
        if (!this.data.isLoadingEnd) {
            let fromId = this.data.listArr[this.data.listArr.length - 1];
            this.getList({
                fromId
            });
        }

    }
})
