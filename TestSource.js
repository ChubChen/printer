/**
 * Created by w44 on 15-1-12.
 */

var CronJob = require('cron').CronJob;

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
};


var testSource = new TestSource();

testSource.handle();

module.exports = testSource;



