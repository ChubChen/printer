/**
 * Created by Administrator on 2015/1/22.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var socketServer = require('./SocketServer.js');
var moment = require('moment');
var util = require('print_util');
var mongoDBUtil = util.mongoDBUtil;
var UserOpLog = util.UserOpLog;
var log = util.log;
var uLog = util.uLog;
var User = util.User;
var memory = require('print_memory');
var webIo = memory.webIo;


var WebServer = function () {
};

WebServer.prototype.start = function (cb) {

    //设置视图
    app.set('views', __dirname + '/views');

    //设置视图解析
    app.set('view engine', 'ejs');

    //public文件夹下面的文件，都暴露出来，客户端访问的时候，不需要使用public路径
    app.use(express.static(__dirname + '/public'));
    app.use(express.static(__dirname + '/node_modules'));

    //是Connect內建的middleware，设置此处可以将client提交过来的post请求放入request.body中

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));
    // parse application/json
    app.use(bodyParser.json());

//每次都运行的，且必须有next才会向下执行
//    app.use(function (req, res, next) {
//        log.info('Time: %d', Date.now());
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
        if (userName !== undefined && passWord !== undefined) {
            body.userName = userName;
            body.passWord = passWord;
        }
        log.info("y用户名密码："+JSON.stringify(body));
        var user = new User({});
        user.get(userName, function(err,data){
            if(err){
                return log.info('error has occurred: $s', err);
            }
            log.info(data+"=================");
            if (data) {
                var auths = '\'root\'';
                log.info(data.authority);
              /*  data.authority.each(function(item,index){
                    console.log(index);
                    if(index == data.authority.length - 1){
                        auths += '\'' + item + '\'';
                    }else{
                        auths += '\'' + item + '\'' + ',';
                    }
                });*/
                var ngUserInfo = 'userInfo=' + '{userName:' + '\'' + userName + '\',authority:[' + auths + ']}';
                var userOp = {
                    created: moment().format('YYYY-MM-DD HH:mm:ss'),
                    userName: userName,
                    operateDes: '登陆系统'
                };
                uLog.info('用户' + userOp.userName + userOp.operateDes);
                var userOpLog = new UserOpLog(userOp);
                userOpLog.save(function(err,log){
                    if(err){
                        uLog.info('用户' + userOp.userName + userOp.operateDes + '日志存储报错：' + err);
                    }
                });
                res.render('app/index', { userName: userName, ngUserInfo: ngUserInfo});
            } else {
                res.render('login', { title: 'Hey', message: '登录失败'});
            }
        });
    });

    var server = app.listen(3000, function () {
        log.info('Listening on port %d', server.address().port);
        var io = socketServer.run(server);
        log.info('SocketServer  Run');
        webIo.init(io);
        cb(io);
    });
};


var webServer = new WebServer();


module.exports = webServer;