/**
 * Created by w44 on 15-3-23.
 */

var async = require('async');

var moment = require('moment');

var util = require('print_util');
var mongoDBUtil = util.mongoDBUtil;
var log = util.log;

var cons = require('print_constants');
var terminalCons = cons.terminalCons;
var nodePlatCons = cons.nodePlatCons;

var fs = require('fs');


var BonusFile = function () {
};


BonusFile.prototype.getFTPMsg = function () {
    log.error('*******兑奖****** File');
    mongoDBUtil.db.collection('WaitBonusTerms', {safe: true}, function (err, waitBonusTerms) {
        waitBonusTerms.find({status: 1200, gameCode: 'T51'}).toArray(function (err, _bonusTerm) {
            async.eachSeries(_bonusTerm, function (term, termCallBack) {
                var ftps = new Array();
                for (var i = 0; i < 6; i++) {
                    ftps.push(i);
                }
                ;
                async.eachSeries(ftps, function (index, _callback) {
                    var name = term.gameCode + '/' + '20150321' + '/' + term.termCode + '/' + term.gameCode + '_' + term.termCode + '_' + index + '.txt';
                    var now = new Date().getTime();
                    log.error(terminalCons.ftpTicketFileDir + name);
                    log.info('---' + name);
                    fs.readFile(terminalCons.ftpTicketFileDir + name, 'UTF-8', function (err, data) {
                        if (!err) {
                            var arr = data.split('\n');
                            async.eachSeries(arr, function (item, fileReadCall) {
                                mongoDBUtil.db.collection('BTets', {safe: true}, function (err, BTets) {
                                    if (item) {
                                        BTets.insert({info: item}, function () {
                                            log.info(item + '已放入兑奖库');
                                            fileReadCall(null);
                                        });
                                    } else {
                                        fileReadCall(null);
                                    }
                                })
                            }, function (err) {
                                _callback(null);
                            });
                        } else {
                            _callback(null);
                        }
                    })
                }, function (err) {
                    termCallBack(null);
                });

            }, function (err) {
                log.error('兑奖期次及票据处理已经全部完成');
            });
        })
    });
};


BonusFile.prototype.getTicketToBouns = function () {
    log.error('*******兑奖****** File');
    var now = new Date().getTime();
    mongoDBUtil.db.collection('BTets', {safe: true}, function (err, bTets) {
        bTets.find().toArray(function (err, _bonusInfo) {
            async.eachSeries(_bonusInfo, function (infoLine, termCallBack) {
                infoLine = infoLine.info;
                try {
                    if (infoLine.trim() != '') {
                        log.info(infoLine);
                        //todo 此处应判断当前库中是否有这张票,然后再做进一步操作
                        //5@2ad27e577d504423bb9c258abeaa1291@600@[{"bonus":600,"bonusBeforeTax":600,"level":2,"count":1}]@600@15007@01,02,03,04,05@1200
                        var strArr = infoLine.split('@');
                        var id = strArr[0];
                        var length = 32 - (id + '').length;
                        for (var i = 0; i < length; i++) {
                            id = '0' + id;
                        }
                        var bonus = strArr[2];
                        mongoDBUtil.db.collection('History', {safe: true}, function (err, history) {
                            history.findAndRemove({id: id}, [], function (err, ticket) {
                                if (ticket) {
                                    delete ticket['_id'];
                                    ticket.bonus = bonus;
                                    ticket.bonusTime = now;
                                    log.error(ticket.bonusInfo);
                                    if (!ticket.bonusInfo) {
                                        mongoDBUtil.db.collection('TicketsWaitBonus', {safe: true}, function (err, ticketsWaitBonus) {
                                            ticketsWaitBonus.insert(ticket, function () {
                                                log.info(ticket.id + '已进入待兑奖库');
                                                termCallBack(null);
                                            });
                                        })
                                    } else {
                                        termCallBack(null);
                                    }
                                } else {
                                    //找不到票
                                    log.info(id + '找不到票');
                                    termCallBack(null);
                                }
                            })
                        });
                    } else {
                        termCallBack(null);
                    }
                    ;
                } catch (err) {
                    log.info('已出错');
                    log.info(infoLine);
                    termCallBack(null);
                }
            }, function (err) {
                log.error('兑奖期次及票据处理已经全部完成');
            });
        })
    });
};


BonusFile.prototype.getBonusFile = function (path) {
    var self = this;
    fs.readdir(path,function (err, files) {
        //err 为错误 , files 文件名列表包含文件夹与文件
        if (err) {
            console.error('error:\n' + err);
            return;
        }
        files.forEach(function (file) {
            fs.stat(path + '/' + file, function (err, stat) {
                if (err) {
                    log.info(err);
                    return;
                }
                if (stat.isDirectory()) {
                    // 如果是文件夹遍历
                    self.getBonusFile(path + '/' + file);
                } else {
                    // 读出所有的文件
                    fs.readFile(path + '/' + file, 'UTF-8', function (err, data) {
                        if (!err) {
                            var arr = data.split('\n');
                            async.eachSeries(arr, function (item, fileReadCall) {
                                if(item){
                                    log.error(item);
                                    mongoDBUtil.db.collection('BonusInfo', {safe: true}, function (err, CTets) {
                                        CTets.findOne({info: item}, function (err, data) {
                                            if (!data) {
                                                CTets.insert({info: item, status: terminalCons.bonus.status.wait, crateTime: new Date().getTime()}, function () {
                                                    log.info(item + '已放入兑奖信息库');
                                                    fileReadCall(null);
                                                });
                                            } else {
                                                fileReadCall(null);
                                            }
                                        });
                                    });
                                }else{
                                    fileReadCall(null);
                                }
                            }, function (err) {
                            });
                        }
                    });
                }
            });

        });
    });
};



BonusFile.prototype.getMongDBFile = function () {

    mongoDBUtil.db.collection('HadBonusTickets', {safe: true}, function (err, collection) {
        collection.find({
            terminalReturnTime: { $gt: 1427558400000, $lt: 1427644799000 }  //{ "takeTime" : { $gt: 1427558400000, $lt: 1427644799000 } }
        }).toArray(function (err, tickets) {
            if (!err && tickets) {
                async.eachSeries(tickets, function (result, cb) {
                    fs.appendFile('/data/file.txt', result.id + '\n', 'utf-8', function (err) {
                        if (err) {
                            log.info(err);
                        } else {
                            log.info(result.id + '已写入' + '/data/file.txt');
                            cb(null);
                        }
                    });
                }, function () {
                    log.info('ok');
                })
            }
        })
    })

}


var bonusFile = new BonusFile();

mongoDBUtil.init(function () {

   //var date=moment().format('YYYYMMDD');
   bonusFile.getBonusFile('/data/app/tets/');
});

