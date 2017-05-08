import {
    HOST_PORT
} from 'constans.js';

var getList = {
    getMovieData: function(params) {
        let page = params.page;
        console.log(params)
        this.request({
            // url: `${HOST_PORT}/classes/TodoFolder?page=${page}`,
            url:HOST_PORT+'/api/list?page='+page,
            success: (data) => {
              if (!data) {
                  // alert('当前暂时没有新的电影了~');
                  return;
              }
              let arr = data.data;
                // let arr = data;
                let _data = {},
                    idSets = new Set();
                for (let i = 0; i < arr.length; ++i) {
                    let id = arr[i].objectId;
                    _data[id] = arr[i];
                    idSets.add(id);
                }
                params.success({
                    movieData: _data,
                    idSets
                });
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
