import {
    HOST,
    LIMIT
} from 'constans.js';

var getList = {
    getMovieData: function(params) {
        let objectId = params.fromId;
        console.log(params)
        let where = {};
        if (objectId) {
            where.objectId = {
                $gt: objectId
            }
        }
        let whereStr = encodeURIComponent(JSON.stringify(where))
        this.leancloudRequest({
            url: `${HOST}/classes/TodoFolder?limit=${LIMIT}&where=${whereStr}`,
            success: (data) => {
                if (!data) {
                    // alert('当前暂时没有新的电影了~');
                    return;
                }
                // let arr = data.data;
                let arr = data;
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
    clickLike: function() {
        this.leancloudRequest({
            url: `${HOST}/classes/LikeList?page=${page}`,
            method: "POST",
            success: () => {

            }
        })
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
                'content-type': 'application/json',
                "X-LC-Id": "FTwd0NMfXvTdENGONHoT5FAp-gzGzoHsz",
                "X-LC-Key": "v6qtxRqeTEjz3Xm0VI7T0kNx"
            },
            success: function(res) {
                try {
                    params.success(res.data.results);
                } catch (e) {
                    console.log(e)
                }
            }
        })
    }
}

module.exports = getList;
