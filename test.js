var moment = require('moment');
var util = require('print_util');
var mongoDBUtil = util.mongoDBUtil;
//启动web服务,并获取前端io
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
                console.log(ticketCache);
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
                           day = temp.replace('日', 7).replace('一', 1).replace('二', 2).replace('三', 4).replace('四', 4).replace('五', 5).replace('六', 6).replace(/[^0-9]/g,'');
                       }else{
                           day.replace('日', 7).replace('一', 1).replace('二', 2).replace('三', 4).replace('四', 4).replace('五', 5).replace('六', 6).replace(/[^0-9]/g, '');
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



