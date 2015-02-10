/**
 * Created by w44 on 15-1-12.
 */

var moment=require('moment');

var util = require('print_util');
var httpUtil = util.httpUtil;
var digestUtil = util.digestUtil;
var log = util.log;
var cons = require('print_constants');
var prop=cons.prop;


log.error(111);

//var body={};
//body.size=10;
//body.minId=26609;
//var head={};
//head.ver='s.1.01';
//head.id=digestUtil.createUUID();
//head.timestamp = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
//bodyStr=JSON.stringify(body);
//var digest = digestUtil.md5(bodyStr + head.timestamp + '12345');
//console.log(digest);
//head.channelCode='C0002';
//head.cmd=prop.node_plat_command.queryQ17;
//head.userId=null;
//head.userType=0;
//head.digest=digest;
//head.digestType='md5';
//var message={};
//message.head=head;
//message.body=bodyStr;
//    //'{\"size\":10,\"minId\":26609}';
//
//httpUtil.send(prop.node_plat_opt,JSON.stringify(message),function(err,data){
//  console.log(err);
//  console.log(data);
//});


