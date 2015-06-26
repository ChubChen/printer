'use strict';

/* Filters */

var printerFilters = angular.module('printerFilters', []);

printerFilters.filter('checkmark', ['$scope',
  function() {
     return function(input) {
        return input ? '\u2713' : '\u2718';
     };
}]);

//时间戳转日期
printerFilters.filter('unixToDate', [
    function() {
        return function(input) {
            var timeStr = new Date(parseInt(input));
            var datetime = timeStr.toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
            return datetime;
        };
    }]);


//判断是否中奖
printerFilters.filter('ifBouns', [
    function() {
        return function(input) {
            if(input==undefined){
                input='未中奖';
            }else{
                input=input/100+'元';
            }
            return input;
        };
    }]);


//彩票机屏幕切换
printerFilters.filter('consStatus', [
    function() {
        return function(input) {
            var res;
            switch(input)
            {
                case 1000:
                    res='images/free.png';
                    break;
                case 1100:
                    res='images/query.png';
                    break;
                case 1200:
                    res='images/bonus.png';
                    break;
                case 1201:
                    res='images/wrong.png';
                    break;
                case 1300:
                    res='images/wrong.png';
                    break;
                case 1900:
                    res='images/unline.png';
                    break;
                case 9999:
                    res='images/wrong.png';
                    break;
                case 1111:
                    res='images/wrong.png';
                    break;
                default:
                    res='images/wrong.png';
            }
            return res;
        };
    }]);


//游戏代码视图转义
printerFilters.filter('consGameCodeDes', [
    function() {
        return function(input) {
            var res;
            switch(input)
            {
                case 'T05':
                    res='11选5';
                    break;
                case 'T01':
                    res='大乐透';
                    break;
                case 'T02':
                    res='七星彩';
                    break;
                case 'T03':
                    res='排列三';
                    break;
                case 'T04':
                    res='排列五';
                    break;
                case 'T51':
                    res='竞彩足球';
                    break;
                case 'T52':
                    res='竞彩篮球';
                    break;
                default:
                    res='未知';
            }
            return res;
        };
    }]);


//模式代码视图转换
printerFilters.filter('consStatusDes', [
    function() {
        return function(input) {
            var res;
            switch(input)
            {
                case 1000:
                    res='等待出票';
                    break;
                case 1001:
                    res='出票中';
                    break;
                case 1100:
                    res='查询';
                    break;
                case 1200:
                    res='兑奖';
                    break;
                case 1201:
                    res='兑奖中';
                    break;
                case 1300:
                    res='打印';
                    break;
                case 1900:
                    res='离线';
                    break;
                case 9999:
                    res='忙碌';
                    break;
                default:
                    res='出错';
            }
            return res;
        };
    }]);


//pageBar
printerFilters.filter('consPageBarDes', [
    function() {
        return function(input) {
            var res;
            if(input){
                res='active';
            }else{
                res='';
            }
            return res;
        };
    }]);


