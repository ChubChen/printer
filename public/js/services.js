/* jshint -W097 */
'use strict';

/* Services */

var printerServices = angular.module('printerServices', ['ngResource']);

var socket;
printerServices.factory('socket', ['$rootScope',
    function ($rootScope) {
        socket = io.connect(null);
        //连接Socket,注册身份
        var data = {};
        var cmd = 'login';
        var bodyNode = {};
        data.cmd = cmd;
        data.bodyNode = bodyNode;
        var userName = $rootScope.userInfo.userName;
        bodyNode.userName = userName;
        socket.emit('data', data);
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        };
    }]);


printerServices.factory('window', ['$window',
    function ($window) {
        return {
            alert: function (str) {
                $window.alert(str);
            }
        };
    }]);

printerServices.factory('Pagination', ['socket',
    function (socket) { 
        var Pagination = function(ticketsData){
                            this.cursor = 1;
                            this.index = 0;
                            this.pageCount = 8;
                            this.prevPage = 1;
                            this.curPage = 1;
                            this.limit = 15;
                            this.sum = 0;
                            this.init = false;
                            this.base = 1;
                            this.ticketsData = ticketsData;
                        };

        Pagination.prototype.queryCallback = function(data,$scope){
            $scope.msg = '';
            if(data.length){
                $scope.message = '查询成功';
                $scope.totalAmount = data.totalAmount;
                $scope.preBouns = data.preBouns;
                $scope.aftBouns = data.aftBouns;
                $scope.length = data.length;
            }else{
                $scope.curPage = data.curPage;
                $scope.count = data.count;
                $scope.limit = data.limit;
                $scope.successTickets = [];
                //$scope.totalAmount = 0;
                //$scope.preBouns = 0;
                //$scope.aftBouns = 0;
                var that = this;
                var recordLimitOfOnePage = this.limit;
                if(!this.init){
                    this.sum = data.datas.length;
                    this.init = true;
                    $scope.base = this.base;
                }
                if(data.datas.length < this.limit){
                    recordLimitOfOnePage = data.datas.length;
                }
                for(var i=0; i<recordLimitOfOnePage; i++){
                    $scope.successTickets.push(data.datas[i]);
                    //console.log(data.datas[i].amount);  
                    //$scope.totalAmount += parseFloat(data.datas[i].amount);
                    //$scope.preBouns += parseFloat(data.datas[i].preBouns) || 0;
                    //$scope.aftBouns += parseFloat(data.datas[i].aftBouns) || 0;
                }
                //console.log($scope.totalAmount);
                var pageNumbers = [];
                var maxPageNumber = 0;
                if(($scope.curPage%this.pageCount) === 1 && $scope.curPage > this.prevPage){
                    this.cursor = $scope.curPage;
                    refreshPageNumber();
                }else if(($scope.curPage%this.pageCount) === 0 && $scope.curPage < this.prevPage){
                    this.cursor -= this.pageCount;
                    refreshPageNumber();
                }else if($scope.curPage === this.prevPage){
                    refreshPageNumber();
                }

                /*页码更新*/
                function refreshPageNumber(){
                    maxPageNumber = that.cursor+that.pageCount-1;
                    var remainRecordNumber = that.sum - ($scope.curPage - 1)*that.limit;
                    if(Math.ceil(remainRecordNumber/that.limit) < that.pageCount){
                        maxPageNumber = Math.ceil(that.sum/that.limit);
                    }
                    for (var i = that.cursor; i <= maxPageNumber; i++) {
                        pageNumbers.push(i);
                    }
                    $scope.pageNumbers = pageNumbers;
                }
            }
            
        };

        Pagination.prototype.toPage = function(page,direction,$scope){
            if(this.sum <= this.limit){
                return;
            }
            if($scope.limit){
                var countPage = $scope.count / $scope.limit;  
                if (page < 1 || page >= countPage + 1) {
                    return;
                }
            }
            this.prevPage = $scope.curPage;
            $('.pageNumber').removeClass('currentPage');
            if(direction === 1){ 
                this.index++;
                $scope.base += this.limit;
                if((page%this.pageCount) === 1){
                    this.index = 0;
                }
            }else if(direction === 0){
                this.index--;
                $scope.base -= this.limit;
                if((page%this.pageCount) === 0){
                    this.index = this.pageCount-1;
                }
            }else{
                this.index = page-1;
                $scope.base = this.limit * this.index + 1;
            }
            $('.pageNumber').eq(this.index).addClass('currentPage');
            this.ticketsData.bodyNode.curPage = page;
            this.ticketsData.bodyNode.limit = this.limit;
        //     ticketsData.bodyNode.cond = {};
        // ticketsData.bodyNode.cond.gameCode = {$regex:''};
        // ticketsData.bodyNode.cond.startTime = 0;
            socket.emit('data', this.ticketsData);
        };

        return Pagination;
        }]);
