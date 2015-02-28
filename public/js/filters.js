'use strict';

/* Filters */

var printerFilters = angular.module('printerFilters', []);

printerFilters.filter('checkmark', ['$scope',
  function() {
     return function(input) {
        return input ? '\u2713' : '\u2718';
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
                case 1300:
                    res='images/wrong.png';
                    break;
                case 1900:
                    res='images/unline.png';
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
                case 1200:
                    res='兑奖';
                    break;
                case 1300:
                    res='打印';
                    break;
                case 1900:
                    res='离线';
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
                case 1200:
                    res='兑奖';
                    break;
                case 1300:
                    res='打印';
                    break;
                case 1900:
                    res='离线';
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


