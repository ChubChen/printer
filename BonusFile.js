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
        waitBonusTerms.find({status: 1200,gameCode:'T51'}).toArray(function (err, _bonusTerm) {
            async.eachSeries(_bonusTerm, function (term,termCallBack) {
                var ftps = new Array();
                for (var i = 0; i < 6; i++) {
                    ftps.push(i);
                };
                async.eachSeries(ftps, function (index, _callback) {
                    var name = term.gameCode + '/' + moment().format('YYYYMMDD') + '/' + term.termCode + '/' + term.gameCode + '_' + term.termCode + '_'+index+'.txt';
                    var now = new Date().getTime();
                    log.error(terminalCons.ftpTicketFileDir + name);
                    console.log('---'+name);
                    fs.readFile(terminalCons.ftpTicketFileDir + name, 'UTF-8', function (err, data) {
                        if(!err){
                            var arr = data.split('\n');
                            async.eachSeries(arr, function (item, fileReadCall) {
                                mongoDBUtil.db.collection('BTets', {safe: true}, function (err, BTets) {
                                    BTets.insert({info:item}, function () {
                                        log.info(item + '已放入兑奖库');
                                        fileReadCall(null);
                                    });
                                })
                            },function(err){
                                _callback(null);
                            });
                        }else{
                            _callback(null);
                        }
                    })
                },function(err){
                    termCallBack(null);
                });

            },function(err){
                log.error('兑奖期次及票据处理已经全部完成');
            });
        })
    });
};

var bonusFile = new BonusFile();
bonusFile.getFTPMsg();
