import {
    HOST,
    LIMIT
} from 'constans.js';

const AV = require('./utils/av-weapp-min.js');

var load = {
    getMovieData: function(params) {
        let objectId;
        if (params.fromId) {
            objectId = params.fromId;
        } else {
            try {
                var lastViewId = wx.getStorageSync('lastViewId');
                if (lastViewId) {
                    objectId = lastViewId;
                }
            } catch (e) {
                console.log(e)
            }
        }

        let where = {};
        if (objectId) {
            where.objectId = {
                $gt: objectId
            }
        }
        let whereStr = encodeURIComponent(JSON.stringify(where))
        this.leancloudRequest({
            url: `${HOST}/classes/MovieData?limit=${LIMIT}&where=${whereStr}`,
            success: (data) => {
                let arr = data.results;
                let _data = {},
                    idSets = new Set();
                for (let i = 0; i < arr.length; ++i) {
                    let id = arr[i].objectId;
                    _data[id] = arr[i];
                    idSets.add(id);
                    _data[id].isRender = true;
                }
                params.success({
                    movieData: _data,
                    idSets
                });
            }
        })
    },
    likeAction: function(params) {
        if (params.action === 'like') {
            var LikeList = AV.Object.extend('LikeList');
            var likeItem = new LikeList();

            var movie = AV.Object.createWithoutData('MovieData', params.objectId);
            var user = AV.Object.createWithoutData('_User', params.uid);

            likeItem.set('movie', movie);
            likeItem.set('user', user);

            likeItem.save().then(function(data) {
            }, function(error) {
                console.error(error);
            });
        }
    },
    request: function(params) {
        let url = `${params.url}`;
        let method = params.method;

        if (method == 'POST' || method == 'DELETE') {
            var obj = {
                method: params.method,
                mode: 'cors'
            };
            obj.body = JSON.stringify(params.body);
        }
        wx.request({
            url: url,
            method: method || "GET",
            data: method === 'GET' ? null : obj,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                try {
                    params.success(res.data);
                } catch (e) {
                    console.log(e)
                }
            }
        })
    },
    leancloudRequest: function(params) {
        let url = `${params.url}`;
        let method = params.method;

        let header, body;
        if (method === 'POST' || method === 'PUT') {
            body = params.body;
        } else {
            body = '';
        }
        header = {
            'Content-Type': 'application/json',
            "X-LC-Id": "FTwd0NMfXvTdENGONHoT5FAp-gzGzoHsz",
            "X-LC-Key": "v6qtxRqeTEjz3Xm0VI7T0kNx"
        }

        wx.request({
            url: url,
            method: method || "GET",
            data: body,
            header,
            success: function(res) {
                try {
                    params.success(res.data);
                } catch (e) {
                    console.log(e)
                }
            }
        })
    }
}

module.exports = load;
