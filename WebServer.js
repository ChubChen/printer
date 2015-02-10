/**
 * Created by Administrator on 2015/1/22.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var socketServer = require('./SocketServer.js');
var util = require('print_util');
var mongoDBUtil = util.mongoDBUtil;

var memory = require('print_memory');
var webIo = memory.webIo;

var WebServer = function () {
};

WebServer.prototype.start = function (cb) {

    //设置视图
    app.set('views', __dirname + '/views');

    //设置视图解析
    app.set('view engine', 'jade')

    //public文件夹下面的文件，都暴露出来，客户端访问的时候，不需要使用public路径
    app.use(express.static(__dirname + '/public'));

    //是Connect內建的middleware，设置此处可以将client提交过来的post请求放入request.body中

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
    app.use(bodyParser.json())

//每次都运行的，且必须有next才会向下执行
//    app.use(function (req, res, next) {
//        console.log('Time: %d', Date.now());
//        next();
//    });

    app.get('/', function (req, res) {
        res.render('login', { title: 'Hey', message: 'Hello there!'});
    });

    app.get('/app/index.html', function (req, res) {
        res.render('app/index', { title: 'Hey', message: 'Hello there!'});
    });

    app.post('/login.htm', function (req, res) {
        var body = {};
        var userName = req.body.userName;
        var passWord = req.body.passWord;
        if (userName != undefined && passWord != undefined) {
            body.userName = userName;
            body.passWord = passWord;
        }
        ;
        console.log(JSON.stringify(body));
        mongoDBUtil.db.collection('customer', {safe: true}, function (err, collection) {
            collection.find(body).toArray(function (err, datas) {
                console.log(datas);
                if (datas.length == 1) {
                    var ngUserName = 'userName=' + '\'' + userName + '\'';
                    res.render('app/index', { userName: userName, ngUserName: ngUserName});
                } else {
                    res.render('login', { title: 'Hey', message: '登录失败'});
                }
            })
        });
    });

    var server = app.listen(3000, function () {
        console.log('Listening on port %d', server.address().port);
        var io = socketServer.run(server);
        console.log('SocketServer  Run');
        webIo.init(io);
        cb(io);
    });
};


var webServer = new WebServer();


module.exports = webServer;