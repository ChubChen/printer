var util = require('print_util');
var mongoDBUtil = util.mongoDBUtil;
var async = require('async');

console.log('开始执行数据库初始化脚本');
        async.waterfall([
            function(cb){
                mongoDBUtil.init(function(err){
                    cb(err);
                });
            },
            function(cb){
                mongoDBUtil.db.createCollection('History', {safe: true}, function (err, collection) {
                    if (err) {
                        cb(err);
                    };
                    console.log('已创建History');
                    cb(null);
                });
            },function(cb){
                mongoDBUtil.db.createCollection('T05Numbers', {safe: true}, function (err, collection) {
                    if (err) {
                        cb(err);
                    }
                    console.log('已创建T05Numbers');
                    cb(null);
                });
            },function(cb){
                mongoDBUtil.db.createCollection('T06Numbers', {safe: true}, function (err, collection) {
                    if (err) {
                        cb(err);
                    }
                    console.log('已创建T06Numbers');
                    cb(null);
                });
            },function(cb){
                mongoDBUtil.db.createCollection('TerminalPrintSuccess', {safe: true}, function (err, collection) {
                    if (err) {
                        cb(err);
                    }
                    console.log('已创建TerminalPrintSuccess');
                    cb(null);
                });
            },function(cb){
                mongoDBUtil.db.createCollection('failTicket', {safe: true}, function (err, collection) {
                    if (err) {
                        cb(err);
                    }
                    console.log('已创建failTicket');
                    cb(null);
                });
            },function(cb){
                mongoDBUtil.db.createCollection('orders', {safe: true}, function (err, collection) {
                    if (err) {
                        cb(err);
                    }
                    console.log('已创建orders');
                    cb(null);
                });
            },function(cb){
                mongoDBUtil.db.createCollection('terminal', {safe: true}, function (err, collection) {
                    if (err) {
                        cb(err);
                    }
                    console.log('已创建terminal');
                    cb(null);
                });
            },function(cb){
                mongoDBUtil.db.createCollection('waitTerminalTicket', {safe: true}, function (err, collection) {
                    if (err) {
                        cb(err);
                    }
                    console.log('已创建waitTerminalTicket');
                    cb(null);
                });
            },function(cb){
                mongoDBUtil.db.createCollection('wrongTicket', {safe: true}, function (err, collection) {
                    if (err) {
                        cb(err);
                    }
                    console.log('已创建wrongTicket');
                    cb(null);
                });
            },function(cb){
                mongoDBUtil.db.createCollection('test', {safe: true}, function (err, collection) {
                    if (err) {
                        cb(err);
                    }
                    console.log('已创建test');
                    cb(null);
                });
            },function(cb){
                mongoDBUtil.db.createCollection('localTerm', {safe: true}, function (err, collection) {
                    if (err) {
                        cb(err);
                    }
                    console.log('已创建localTerm');
                    cb(null);
                });
            },function(cb){
                mongoDBUtil.db.createCollection('WinNumbers', {safe: true}, function (err, collection) {
                    if (err) {
                        cb(err);
                    }
                    console.log('已创建WinNumbers');
                    cb(null);
                });
            },function(cb){
                mongoDBUtil.db.createCollection('customer', {safe: true}, function (err, collection) {
                    if (err) {
                        cb(err);
                    };
                    var body={};
                    body.userName='w44';
                    body.passWord='123456';
                    collection.insert(body, function () {
                        console.log(body.userName + "已入用户库");
                    });
                    console.log('已创建customer');
                    cb(null,'ok');
                });
            }
        ],function(err,data){
            if(err){
                console.log(err);
            }else{
                console.log(data);
            }

        });