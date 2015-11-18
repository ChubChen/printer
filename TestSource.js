/**
 * Created by w44 on 15-1-12.
 */

var CronJob = require('cron').CronJob;
var nodePlatAssist = require('print_assist').nodePlatAssist;
var moment = require('moment');
var async = require('async');
var util = require('print_util');
var digestUtil = require('print_util').digestUtil;
var log=util.log;

var cons = require('print_constants');
var nodePlatCons = cons.nodePlatCons;

var TestSource = function () {
};

TestSource.prototype.handle = function () {
    var self = this;
    //开启获取待出票队列任务
    self.catchWaitQueenTask.start();
    self.catchWaitQueenTaskStatus = true;
};

TestSource.prototype.catchWaitQueenTask = new CronJob('*/5 * * * * *', function () {
    console.log("###########################   get tickets to waitQueen    ###########################");
    TestSource.prototype.getWaitTickets();
});


TestSource.prototype.getWaitTickets = function () {
    console.log('正在取票！！！！！');
    nodePlatAssist.sentP01(function (err, backMsgNode) {
        if (err) {
            log.error(err);
        } else {
            //log.info( "backMsgNode.body ==========="+backMsgNode.body+":"+typeof(digestUtil.check) );
            //获取到订单集合
            //获取到订单集合
            var backBodyStr = digestUtil.check(backMsgNode.head, nodePlatCons.key, backMsgNode.body);
            var backBodyNode = JSON.parse(backBodyStr);
            log.info("backBody--------"+ backBodyStr);
            var tickets = backBodyNode.rst;
            if (tickets.length == 0) {
                log.info("no tickets to print........");
                return;
            }

            async.each(tickets, function (item) {
                item.ticketSeq = "123";
                item.metaTicket="123123";
                item.numbers = item.number;
                nodePlatAssist.sentP02(item, function (err, backMsgNode) {
                    log.info(backMsgNode);
                });
            });
            //todo 给平台发送出票成功请求

        }
    });
};


var testSource = new TestSource();

testSource.handle();

module.exports = testSource;



