/**
 * Created by Administrator on 2015/1/23.
 */

var io = require('socket.io')();
var control = require('print_control');
var SocketControl = control.socketControl;
var webIo = require('print_memory').webIo;
var moment = require('moment');
var util = require('print_util');
var UserOpLog = util.UserOpLog;
var log = util.log;
var uLog = util.uLog;
var connectedUser = {};
var mongoDBUtil = util.mongoDBUtil;
var SocketServer = function () {
};

io.on('connection', function (socket) {

    //每个连接有单独的控制层
    var socketControl = new SocketControl();
    //监听命令
    socket.on('data', function (data) {
        log.info('data: '+JSON.stringify(data));
        var cmd = data.cmd;
        var bodyNode = data.bodyNode;
        console.log(data.bodyNode);
        socketControl.handle(cmd, bodyNode, function (err, type,cmd, res) {
            if(err){
              //错误处理
                log.error(err);
            };
            if(type == 1){
                socket.emit(cmd,res);
            }else if(type == 2){
                socket.broadcast.emit(cmd,res);
            }else if(type == 3){
                webIo.io.emit(cmd,res);
            }

        });
    });
    //退出时操作
    socket.on('disconnect', function () {
        var userOp = {
            created: moment().format('YYYY-MM-DD HH:mm:ss'),
            userName: socketControl.userName,
            operateDes: '退出系统'
        };
        uLog.info('用户' + userOp.userName + userOp.operateDes);
        var userOpLog = new UserOpLog(userOp);
        userOpLog.save(function(err,log){
            if(err){
                uLog.info('用户' + userOp.userName + userOp.operateDes + '日志存储报错：' + err);
            }
        });
        log.error(socketControl.userName + '走了');
    });
});

SocketServer.prototype.run = function (server) {
    io.listen(server);
    return io;
}

var socketServer = new SocketServer();
module.exports = socketServer;