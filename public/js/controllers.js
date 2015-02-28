'use strict';

/* Controllers */

var printerControllers = angular.module('printerControllers', []);

/*
 *  系统监控
 **/
printerControllers.controller('systemListCtrl', ['$scope', 'socket',
    function ($scope, socket) {
        /*初始化命令**/
        var data = {};
        var bodyNode = {};
        data.bodyNode = bodyNode;
        //初始化终端机列表状态
        var terminalListData = angular.copy(data)
        terminalListData.cmd = 'terminalList';
        //terminalListData
        socket.emit('data', terminalListData);
        //初始化等待队列
        var waitQueenData = angular.copy(data);
        waitQueenData.cmd = 'waitQueen';
        socket.emit('data', waitQueenData);


        /*其它命令**/
        //接收终端机列表
        socket.on('terminalList', function (terminals) {
            $scope.terminals = terminals;
        });


        socket.on('addTerminal', function (terminal) {
            $scope.terminals[$scope.terminals.length] = terminal;
        });

        socket.on('editTerminal', function (_terminal) {
            for (var i = 0; i < $scope.terminals.length; i++) {
                if (_terminal.id == $scope.terminals[i].id) {
                    $scope.terminals[i] = _terminal;
                }
            }
        });

        socket.on('statusChange', function (terminal) {
            var _terminal = JSON.parse(terminal);
            console.log(_terminal);
            for (var i = 0; i < $scope.terminals.length; i++) {
                if (_terminal.id == $scope.terminals[i].id && _terminal.status != $scope.terminals[i].status) {
                    _terminal.waitCount = $scope.terminals[i].waitCount;
                    _terminal.succCount = $scope.terminals[i].succCount;
                    $scope.terminals[i] = _terminal;
                }
            }
        });
        socket.on('waitQueen', function (waitQueen) {
            $scope.waitQueen = waitQueen;
        });
        $scope.addTerminal = function () {
            $scope.terminal = {};
            $scope.game = game;
            $scope.statusList = statusList;
            $scope.door = false;
        };
        $scope.editTerminal = function (terminal) {
            $scope.game = game;
            $scope.statusList = statusList;
            $scope.hadGame = terminal.gameCode;
            $scope.terminal = angular.copy(terminal);
            $scope.door = true;
        };
        socket.on('terminalCount', function (body) {
            for (var i = 0; i < $scope.terminals.length; i++) {
                if (body.terminalId == $scope.terminals[i].id) {
                    $scope.terminals[i].waitCount = body.waitCount;
                    $scope.terminals[i].succCount = body.succCount;
                }
            }
        });
    }]);

/*
 *  用户管理
 **/
printerControllers.controller('userListCtrl', ['$scope', 'socket',
    function ($scope, socket) {
        /*初始化命令**/
        var data = {};
        var bodyNode = {};
        data.bodyNode = bodyNode;
        //初始化客户列表
        var userListData = angular.copy(data)
        userListData.cmd = 'userList';
        socket.emit('data', userListData);
        /*其它命令**/
        //接收用户列表
        socket.on('userList', function (users) {
            $scope.users = users;
        });
        $scope.addUser = function () {
            $scope.user = {};
        };
        $scope.editUser = function (user) {
            $scope.user = angular.copy(user);
        };
    }]);

/*
 *  Main页控制
 **/
printerControllers.controller('mainCtrl', ['$scope', 'socket',
    function ($scope, socket) {
        /*初始化命令**/
        var data = {};
        var bodyNode = {};
        data.bodyNode = bodyNode;
        //初始化取票状态
        var queryCatchTicketsStatusData = angular.copy(data)
        queryCatchTicketsStatusData.cmd = 'queryCatchTicketsStatus';
        socket.emit('data', queryCatchTicketsStatusData);
        /*其它命令**/
        $scope.catchTicketsStatus = function () {
            var catchTicketsStatusData = angular.copy(data)
            catchTicketsStatusData.cmd = 'catchTicketsStatus';
            socket.emit('data', catchTicketsStatusData);
        };
        //接收公共取票状态
        socket.on('catchTicketsStatus', function (data) {
            if (data) {
                $scope.status = '停止取票';
                $scope.style = 'btn-danger';
            } else {
                $scope.status = '开启取票';
                $scope.style = 'btn-primary';
            }
        });
        //接收自查询取票状态
        socket.on('queryCatchTicketsStatus', function (data) {
            if (data) {
                $scope.status = '停止取票';
                $scope.style = 'btn-danger';
            } else {
                $scope.status = '开启取票';
                $scope.style = 'btn-primary';
            }
        });
    }]);


/*
 *  Ticket页控制
 **/
printerControllers.controller('ticketListCtrl', ['$scope', 'socket','$window',
    function ($scope, socket,$window) {
        /*初始化命令**/
        var data = {};
        var bodyNode = {};
        data.bodyNode = bodyNode;
        //初始化成功票据
        var querySuccessTicketsData = angular.copy(data);
        if ($scope.curPage) {
        } else {
            querySuccessTicketsData.bodyNode.curPage = 1;
            querySuccessTicketsData.bodyNode.limit = 8;
        }
        querySuccessTicketsData.cmd = 'querySuccessTickets';
        socket.emit('data', querySuccessTicketsData);
        /*其它命令**/
        //接收成功票据列表
        socket.on('querySuccessTickets', function (backNode) {
            $scope.curPage = backNode.curPage;
            $scope.count = backNode.count;
            $scope.limit = backNode.limit;
            $scope.successTickets = backNode.datas;
            var pageCount = backNode.count / backNode.limit + 1;
            var pageNumbers = new Array();
            for (var i = 1; i <= pageCount; i++) {
                pageNumbers.push(i);
            }
            $scope.pageNumbers = pageNumbers;
        });
        $scope.toPage = function (page) {
            var countPage = $scope.count / $scope.limit;
            if (page < 1 || page > countPage + 1) {
                return;
            }
            querySuccessTicketsData.bodyNode.curPage = page;
            socket.emit('data', querySuccessTicketsData);
        };
        $scope.query = function () {
            querySuccessTicketsData.bodyNode.curPage = 1;
            querySuccessTicketsData.bodyNode.cond = {};
            if ($scope.id) {
                querySuccessTicketsData.bodyNode.cond.id = $scope.id;
            }
            if ($scope.gameCode) {
                querySuccessTicketsData.bodyNode.cond.gameCode = $scope.gameCode;
            }
            if ($scope.termCode) {
                querySuccessTicketsData.bodyNode.cond.termCode = $scope.termCode;
            }
            socket.emit('data', querySuccessTicketsData);
        };
        $scope.printTicket = function (ticket) {
            var printTicketData = angular.copy(data);
            printTicketData.cmd='printTicket';
            printTicketData.bodyNode.id = ticket.id;
            socket.emit('data', printTicketData);
        };
        //接受打印响应
        socket.on('printTicket', function (result) {
            $window.alert(result);
        });
    }]);
