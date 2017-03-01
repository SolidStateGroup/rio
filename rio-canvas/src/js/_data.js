//Standardises API Requests
module.exports = {
    token: '',
    type: '',

    status: function (response) { //handle ajax requests
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response);
        } else {
            response.text()
                .then((err)=> {
                    log(response.url, response.status, err);
                });
            return Promise.reject(response);
        }
    },

    get: function (url, data) {
        return this._request('get', url, data || null);
    },

    dummy: function (data) {
        return function () {
            return new Promise(function (resolve) {
                resolve(data);
            });
        };
    },

    put: function (url, data) {
        return this._request('put', url, data);
    },

    post: function (url, data) {
        return this._request('post', url, data);
    },

    delete: function (url, data) {
        return this._request('delete', url, data);
    },

    _request: function (method, url, data) {
        var options = {
                timeout: 120000,
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=utf-8'
                }
            },
            req;

        if (this.token) { //add auth tokens to headers of all requests
            options.headers['X-Auth-Token'] = this.token;
        }

        if (data) {
            options.body = JSON.stringify(data);
        } else if (method == "post" || method == "put") {
            options.body = "{}";
        }

        req = fetch(url, options);
        return req
            .then(this.status)
            .then(function (response) { //always return json
                return response.json();
            })
            .then(function (response) {
                return response;
            });

    },

    setToken: function (_token) {//set the token for future requests
        this.token = _token;
    }
};
