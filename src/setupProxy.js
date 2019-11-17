const proxy = require('http-proxy-middleware');

module.exports = function(app) {
    //代理在后台设置了，故不在前台继续设置
  /*  app.use(proxy('/login', {
        target: 'http://127.0.0.1:7001/' ,
    }));
    app.use(proxy('/api/task/get', {
        target: 'http://127.0.0.1:7001/' ,
    }));
    app.use(proxy('/api/task/add', {
        target: 'http://127.0.0.1:7001/' ,
    }));*/
};
