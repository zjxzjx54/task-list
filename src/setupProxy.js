const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(proxy('/login', {
        target: 'http://127.0.0.1:7001/' ,
    }));
    app.use(proxy('/api/task/get', {
        target: 'http://127.0.0.1:7001/' ,
    }));
    app.use(proxy('/api/task/add', {
        target: 'http://127.0.0.1:7001/' ,
    }));
};
