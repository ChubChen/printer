
var moment = require('moment');
var util = require('print_util');
var mongoDBUtil = util.mongoDBUtil;
var cons = require('print_constants');
var async = require('async');

var dataTransCons = cons.dataTransCons;
/*
//启动web服务,并获取前端io
var test = function(){

}

test.prototype.T51= function(){
    mongoDBUtil.init(function (err) {
        mongoDBUtil.db.collection('History', {safe: true}, function (err, collection) {
            collection.find({gameCode:"T51"}).toArray(function (err, tickets) {
                for(var key in tickets){
                    var ticket = tickets[key];
                    var ticketCache = {};
                    var numberArray = ticket.numbers.split(";")
                    for(var i = 0; i < numberArray.length; i++){
                        var matchCode = numberArray[i].split("|")[1];
                        var match = matchCode.substr(matchCode.length - 4);
                        ticketCache[match] = matchCode;
                    }
                    var results = ticket.metaTicket.split(new RegExp('周'));
                    if(results == undefined || results == null ){
                        cb('竞彩ticket.metaTicket.match(regExp)为空', null);
                    };
                    var resultArray = new Array();

                    for(var i = 0; i< results.length; i++){
                        if(i != 0){
                            var arr = results[i].split('\n\n');
                            var day = arr[0].split("\n")[0];
                            if(arr[0].indexOf(':') > 0){
                                var temp = arr[0].substr(0, arr[0].indexOf(':'));
                                day = temp.replace('日', 7).replace('一', 1).replace('二', 2).replace('三', 3).replace('四', 4).replace('五', 5).replace('六', 6).replace(/[^0-9]/g,'');
                            }else{
                                day = day.replace('日', 7).replace('一', 1).replace('二', 2).replace('三', 3).replace('四', 4).replace('五', 5).replace('六', 6).replace(/[^0-9]/g, '');
                            }
                            var resultTemp = arr[1].replace(/\n/g,'');
                            var pl = "";
                            var pType = ticket.playTypeCode;
                            if (resultTemp.indexOf('(') >= 0 && resultTemp.indexOf(":") > 0) {
                                pType = "03";
                                pl = resultTemp.replace(/\s+/g, '').replace(/\+/g, ',').replace(/元/g, '').replace(/\:/g, '').replace(/\(/g, '').replace(/\)/g, '');
                            }
                            if (resultTemp.indexOf('(') >= 0 && resultTemp.indexOf('其它') > 0) {
                                pType = "03";
                                pl = resultTemp.replace(/\s+/g, '').replace(/\+/g, ',').replace(/元/g, '').replace(/\:/g, '').replace(/\(/g, '').replace(/\)/g, '').replace(/胜其它/g, '90').replace(/平其它/g, '99').replace(/负其它/g, '09');
                            }
                            if (resultTemp.indexOf('(') >= 0 && resultTemp.indexOf(":") < 0 && resultTemp.indexOf('其它') < 0) {
                                pType = "04";
                                pl = resultTemp.replace(/\+\)/g, '').replace(/\+/g, ',').replace(/元/g, '').replace(/\(/g, '').replace(/\)/g, '');
                            }
                            if (resultTemp.indexOf('(') < 0) {
                                if (arr[0].indexOf('让球') > 0) {
                                    pType = "01";
                                } else if (arr[0].indexOf('半全场') > 0) {
                                    pType = "05";
                                } else if (arr[0].indexOf('胜平负') > 0) {
                                    pType = "02";
                                }
                                pl = resultTemp.replace(/\s+/g, '').replace(/\+/g, ',').replace(/元/g, '').replace(/负/g, 0).replace(/平/g, 1).replace(/胜/g, 3);
                            }
                            resultArray.push(pType + '|' + ticketCache[day] + '|' + pl);
                        }
                    }
                    console.log("新" + resultArray.join(";"))
                    console.log("原" + ticket.numbers + "\n");

                }
            });
        });
    });
}

test.prototype.T52=function(){
    mongoDBUtil.init(function (err) {
        mongoDBUtil.db.collection('TerminalPrintSuccess', {safe: true}, function (err, collection) {
            collection.find({gameCode:"T52",id:new RegExp('36842')}).toArray(function (err, tickets) {
                for(var key in tickets) {
                    var ticket = tickets[key];
                    var results = ticket.metaTicket.split(new RegExp('周'));
                    if (!results) {
                        cb('竞彩ticket.metaTicket.match(regExp)为空', null);
                        return
                    }
                    ;
                    var ticketCache = {};
                    var pTypeCache = {};
                    var numberArray = ticket.numbers.split(";")
                    for (var i = 0; i < numberArray.length; i++) {
                        var matchCode = numberArray[i].split("|")[1];
                        var match = matchCode.substr(matchCode.length - 4);
                        ticketCache[match] = matchCode;
                        var pCode = numberArray[i].split("|")[0];
                        pTypeCache[match] = pCode;
                    }
                    var resultArray = new Array();
                    for (var i = 0; i < results.length; i++) {
                        if (i != 0) {
                            var arr = results[i].split('\n\n');
                            console.log(arr);
                            var day = arr[0].split("\n")[0];
                            var yushe;
                            if (day.indexOf(':') > 0 && (day.indexOf('让分') > 0 || day.indexOf('总分') > 0)) {
                                yushe = day.split(':')[1];
                                if (yushe.indexOf('主') >= 0) {
                                    yushe = yushe.split('主')[1];
                                    yushe = '(' + yushe + ')';
                                } else if (yushe.indexOf('客') >= 0) {
                                    yushe = yushe.split('客')[1];
                                    yushe = '(' + yushe + ')';
                                } else {
                                    yushe = '(' + yushe + ')';
                                }
                            }
                            if (arr[0].indexOf(':') > 0) {
                                var temp = arr[0].substr(0, arr[0].indexOf(':'));
                                day = temp.replace('日', 7).replace('一', 1).replace('二', 2).replace('三', 3).replace('四', 4).replace('五', 5).replace('六', 6).replace(/[^0-9]/g, '');
                            } else {
                                day.replace('日', 7).replace('一', 1).replace('二', 2).replace('三', 3).replace('四', 4).replace('五', 5).replace('六', 6).replace(/[^0-9]/g, '');
                            }
                            var resultTemp = arr[1].replace(/\n/g, '');
                            var pl = "";

                            pl = resultTemp.replace(/\s+/g, '').replace(/\+/g, ',').replace(/元/g, '').replace(/负/g, 2).replace(/胜/g, 1).replace(/大/g, 1).replace(/小/g, 2);
                            var jclqTrans = dataTransCons.jclqSfc;
                            for (var key in jclqTrans) {
                                pl = pl.replace(key, jclqTrans[key]);
                            }
                            if (pTypeCache[day] == '01' || pTypeCache[day] == '04') {
                                pl = pl.replace(/@/g,yushe+'@');
                            }
                            resultArray.push(pTypeCache[day] + '|' + ticketCache[day] + '|' + pl);
                        }
                    }
                    temp = resultArray.join(';');
                    console.log(temp);
                }
            });
        });
    });
}

var testT52 = new test();
testT52.T52();


*/
var test = "[中奖注数:1注*2倍\n应退注数:0注*2倍\n中奖金额:5.92元\n应退金额:0.00元\n兑奖状态:可以兑奖\n应付金额:5.92元\n应付金额=中奖金额+应退金额\n第1页/共1页";
var arr = test.split('\n');
async.each(arr, function (item) {
    if (item.indexOf('中奖金额:') != -1) {
        console.log(parseInt(item.replace(/\D/g, '')));
    }
}, function (err) {
})