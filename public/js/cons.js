/**
 * Created by w44 on 15-2-1.
 */

 /* jshint -W097 */
'use strict';

var printerGlobalParam = angular.module('printerGlobalParam',[]);

printerGlobalParam.service('params', function(){
    return {
        game: {
                    'T01': '大乐透',
                    'T02': '七星彩',
                    'T03': '排列3',
                    'T04': '排列5',
                    'T05': '11选5',
                    'T06': '快赢481',
                    'T51': '竞彩足球',
                    'T52': '竞彩篮球',
                    'T53': '胜负彩',
                    'T54': '四场进球',
                    'T55': '六场半全场',
                    'F01': '双色球'
                },
        statusList: {
                    '0000': '请选择',
                    '1000': '出票',
                    '1100': '查询',
                    '1200': '兑奖',
                    '1300': '打印'
                }
    };
});