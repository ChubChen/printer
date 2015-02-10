/**
 * Created by w44 on 15-1-7.
 */
var net = require('net');
var async = require('async');
var util = require('print_util');
var dataUtil = util.dataUtil;
var mongoDBUtil = util.mongoDBUtil;
var cons = require('print_constants');
var msgParam = cons.msgParam;

var webServer = require('./WebServer.js');
var control= require('print_control');
var TerminalControl =control.terminalControl;
var ticketControl=control.ticketControl;
var pageControl=control.pageControl;

var HOST = '127.0.0.1';
var PORT = 16777;


async.waterfall([function (cb) {
    //启动web服务,并获取前端io
    mongoDBUtil.init(function (err) {
        cb(err);
    });
}, function (cb) {
    //启动web服务,并获取前端io
    webServer.start(function (io) {
        net.createServer(function (sock) {
            //此socket唯一
            var remoteAddress = sock.remoteAddress;
            var remotePort = sock.remotePort;
            var dataBuf = new Buffer(50 * 1024);
            var terminalControl = new TerminalControl(sock, io);
            //数据包长度固定
            var packageBufLen = msgParam.packageBufLen;
            //当前包长
            var curBufLen = 0;
            //数据类长度
            var dataBufLen = 0;
            //接收客户端信息
            console.log('有客户端接入：' + remoteAddress + ' ' + remotePort);
            sock.on('data', function (data) {
                //聚合数据流
                console.log('######################################');
                data.copy(dataBuf, curBufLen, 0, data.length);
                //记录当前接收长度
                curBufLen += data.length;
                //第一步
                //判断是否可以获取包长
                if (curBufLen >= packageBufLen) {
                    //读取数据长度
                    dataBufLen = dataBuf.readInt32BE(0, packageBufLen);
                    console.log('数据包长度：' + dataBufLen);
                } else {
                    return;
                }
                //第二步
                //判断整个包是否已经获取完全(当前长度>=数据长度+包长信息)
                while (curBufLen >= dataBufLen + packageBufLen) {
                    //解析headNode
                    var headNode = dataUtil.parseHeadNode(dataBuf);
                    //如果头报文解析出错，重新试着接包
                    if (headNode == null) {
                        curBufLen = 0;
                    } else {
                        var bodyNodeBuf = new Buffer(dataBufLen + packageBufLen - msgParam.headBufLen);
                        dataBuf.copy(bodyNodeBuf, 0, msgParam.headBufLen, dataBufLen+packageBufLen);
                        //解析bodyNode
                        var bodyNode = dataUtil.handleForBodyNode(headNode, bodyNodeBuf);
                        //可以分流处理不同接口了
                        terminalControl.handle(headNode, bodyNode);
                        //处理完成后，如果对方一次性将多个命令报文一起发过来的处理
                        if (curBufLen > dataBufLen + packageBufLen) {
                            console.log('本次有多余的字节需要处理');
                            var othersBufLen = curBufLen - dataBufLen - packageBufLen;
                            var othersBuf = new Buffer(othersBufLen);
                            //将收到的命令多余字节暂存起来,并清空数据流
                            dataBuf.copy(othersBuf, 0, dataBufLen + packageBufLen, curBufLen);
                            dataBuf.fill();
                            //将暂存的字符移动到数据流
                            othersBuf.copy(dataBuf, 0, 0, othersBufLen);
                            curBufLen = othersBufLen;
                            dataBufLen = 0;
                            if (curBufLen >= packageBufLen) {
                                //读取数据长度
                                dataBufLen = dataBuf.readInt32BE(0, packageBufLen);
                                console.log('数据包长度：' + dataBufLen);
                            }
                        } else {
                            curBufLen = 0;
                        }
                    }
                }
                ;
                console.log("结束");
                // 回发该数据，客户端将收到来自服务端的数据
            });

            // 为这个socket实例添加一个"close"事件处理函数
            sock.on('close', function (data) {
                console.log('CLOSED: ' +
                    remoteAddress + ' ' + remotePort);
                terminalControl.connClose(remoteAddress);
            });
            sock.on('error', function () {
                console.log('ERROE: ' +
                    remoteAddress + ' ' + remotePort);
                terminalControl.connClose(remoteAddress);
            })
        }).listen(PORT, HOST);
        cb(null, "success");
    });
}], function (err, data) {
    console.log('TCP Server listening on ' + HOST + ':' + PORT);
    console.log(data);
    ticketControl.run();
    pageControl.run();
});






