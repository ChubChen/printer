/**
 * Created by Administrator on 2015/1/23.
 */

var io = require('socket.io')();
var control = require('print_control');
var SocketControl = control.socketControl;
var SocketServer = function () {
};

io.on('connection', function (socket) {

    //每个连接有单独的控制层
    var socketControl = new SocketControl();

    //监听命令
    socket.on('data', function (data) {
        console.log('data: '+JSON.stringify(data));
        var cmd = data.cmd;
        var bodyNode = data.bodyNode;
        socketControl.handle(cmd, bodyNode, function (err, type,cmd, res) {
            if(err){
              //错误处理
            };
            if(type == 1){
                socket.emit(cmd,res);
            }else if(type == 2){
                socket.broadcast.emit(cmd,res);
            }else if(type == 3){
                io.emit(cmd,res);
            }

        });
    });
    //退出时操作
    socket.on('disconnect', function () {
        console.log(socketControl.userName + '走了');
    });

});

SocketServer.prototype.run = function (server) {
    io.listen(server);
    return io;
}

var socketServer = new SocketServer();
module.exports = socketServer;