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

        socket.on('ErrorStatus',function(obj){
            alert('终端机发来严重错误消息。停止所有终端机不再出票。请联系技术人员查看');
            var _Obj = JSON.parse(obj);
            var array = _Obj.terminal;
            var status = _Obj.status;
            alert(array[0]);
            for (var i = 0; i < $scope.terminals.length; i++) {
                for(var j = 0; j < array.length; j++){
                    if($scope.terminals[i].id == array[j]){
                        $scope.terminals[i].status = status;
                    }
                }
            }
        });

        socket.on('statusChange', function (terminal) {
            var _terminal = JSON.parse(terminal);
            for (var i = 0; i < $scope.terminals.length; i++) {
                if (_terminal.id == $scope.terminals[i].id && _terminal.status != $scope.terminals[i].status) {
                    _terminal.waitCount = $scope.terminals[i].waitCount;
                    _terminal.succCount = $scope.terminals[i].succCount;
                    $scope.terminals[i] = _terminal;
                }
            }
        });

        socket.on('changeAmount', function(obj){
            var _terminal = JSON.parse(obj);
            for (var i = 0; i < $scope.terminals.length; i++) {
                if (_terminal.id == $scope.terminals[i].id ) {
                    $scope.terminals[i].amount = _terminal.amount;
                }
            }
        });

        socket.on('waitQueen', function (waitQueen) {
            $scope.waitQueen = waitQueen;
        });

        socket.on('successQueen', function (successQueen) {
            $scope.successQueen = successQueen;
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
            if($scope.terminals==undefined){
                return;
            }
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
printerControllers.controller('ticketListCtrl', ['$scope', 'socket',
    function ($scope, socket) {
        $scope.num=-999;
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
            var res='';
            if(result==0){
                res='没有可用的终端机';
            }else{
                var querySuccessTicketsData = angular.copy(data);
                querySuccessTicketsData.bodyNode.curPage = $scope.curPage;
                querySuccessTicketsData.bodyNode.limit = 8;
                querySuccessTicketsData.cmd = 'querySuccessTickets';
                socket.emit('data', querySuccessTicketsData);
                res='已经发送终端机进行出票';
            }
            alert(res);
        });

        $scope.desTicket = function (ticket) {
            $scope.num=9999;
            $scope.ticket = angular.copy(ticket);
        };

    }]);




/*
 *  Bonus页控制
 **/
printerControllers.controller('bonusListCtrl', ['$scope', 'socket',
    function ($scope, socket) {
        /*初始化命令**/
        var data = {};
        var bodyNode = {};
        data.bodyNode = bodyNode;
        //初始化成功票据
        var queryWaitBounsTicketsData = angular.copy(data);
        if ($scope.curPage) {
        } else {
            queryWaitBounsTicketsData.bodyNode.curPage = 1;
            queryWaitBounsTicketsData.bodyNode.limit = 8;
        }
        queryWaitBounsTicketsData.cmd = 'queryWaitBonusTickets';
        socket.emit('data', queryWaitBounsTicketsData);
        /*其它命令**/
        //接收成功票据列表
        socket.on('queryWaitBonusTickets', function (backNode) {
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
            queryWaitBounsTicketsData.bodyNode.curPage = page;
            socket.emit('data', queryWaitBounsTicketsData);
        };
        $scope.query = function () {
            queryWaitBounsTicketsData.bodyNode.curPage = 1;
            queryWaitBounsTicketsData.bodyNode.cond = {};
            if ($scope.id) {
                queryWaitBounsTicketsData.bodyNode.cond.id = $scope.id;
            }
            if ($scope.gameCode) {
                queryWaitBounsTicketsData.bodyNode.cond.gameCode = $scope.gameCode;
            }
            if ($scope.termCode) {
                queryWaitBounsTicketsData.bodyNode.cond.termCode = $scope.termCode;
            }
            socket.emit('data', queryWaitBounsTicketsData);
        };

        $scope.printBonusTicket = function (ticket) {
            var printBonusTicket = angular.copy(data);
            printBonusTicket.cmd='printBonusTicket';
            printBonusTicket.bodyNode.id = ticket.id;
            socket.emit('data', printBonusTicket);
        };

        $scope.reBonus = function (ticket) {
            var reBonus = angular.copy(data);
            reBonus.cmd='reBonus';
            reBonus.bodyNode.id = ticket.id;
            socket.emit('data', reBonus);
            $scope.query();
        };

        //接受打印响应
        socket.on('printBonusTicket', function (result) {
            var res='';
            if(result==0){
                res='没有可用的终端机';
            }else{
                res='已经发送终端机进行出票';
            }
            alert(res);
        });

    }]);



/*
 *  History页控制
 **/
printerControllers.controller('historyListCtrl', ['$scope', 'socket',
    function ($scope, socket) {
        /*初始化命令**/
        var data = {};
        var bodyNode = {};
        data.bodyNode = bodyNode;
        //初始化成功票据
        var queryHistoryTicketsData = angular.copy(data);
        if ($scope.curPage) {
        } else {
            queryHistoryTicketsData.bodyNode.curPage = 1;
            queryHistoryTicketsData.bodyNode.limit = 8;
        }
        queryHistoryTicketsData.cmd = 'queryHistoryTickets';
        socket.emit('data', queryHistoryTicketsData);
        /*其它命令**/
        //接收成功票据列表
        socket.on('queryHistoryTickets', function (backNode) {
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
            queryHistoryTicketsData.bodyNode.curPage = page;
            socket.emit('data', queryHistoryTicketsData);
        };
        $scope.query = function () {
            queryHistoryTicketsData.bodyNode.curPage = 1;
            queryHistoryTicketsData.bodyNode.cond = {};
            if ($scope.id) {
                queryHistoryTicketsData.bodyNode.cond.id = $scope.id;
            }
            if ($scope.gameCode) {
                queryHistoryTicketsData.bodyNode.cond.gameCode = $scope.gameCode;
            }
            if ($scope.termCode) {
                queryHistoryTicketsData.bodyNode.cond.termCode = $scope.termCode;
            }
            socket.emit('data', queryHistoryTicketsData);
        };
        $scope.printHistoryTicket = function (ticket) {
            var printHistoryTicketData = angular.copy(data);
            printHistoryTicketData.cmd='printHistoryTicketData';
            printHistoryTicketData.bodyNode.id = ticket.id;
            socket.emit('data', printHistoryTicketData);
        };

        $scope.desTicket = function (ticket) {
            $scope.ticket = angular.copy(ticket);
        };

        socket.on('printHistoryTicketData', function (result) {
            var res='';
            if(result==0){
                res='没有可用的终端机';
            }else{
                res='已经发送终端机进行出票';
            }
            alert(res);
        });

    }]);




/*
 *  Fail页控制
 **/
printerControllers.controller('failListCtrl', ['$scope', 'socket',
    function ($scope, socket) {
        /*初始化命令**/
        var data = {};
        var bodyNode = {};
        data.bodyNode = bodyNode;
        //初始化成功票据
        var queryFailTicketsData = angular.copy(data);
        if ($scope.curPage) {
        } else {
            queryFailTicketsData.bodyNode.curPage = 1;
            queryFailTicketsData.bodyNode.limit = 8;
        }
        queryFailTicketsData.cmd = 'queryFailTickets';
        socket.emit('data', queryFailTicketsData);
        /*其它命令**/
        //接收成功票据列表
        socket.on('queryFailTickets', function (backNode) {
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
            queryFailTicketsData.bodyNode.curPage = page;
            socket.emit('data', queryFailTicketsData);
        };
        $scope.query = function () {
            queryFailTicketsData.bodyNode.curPage = 1;
            queryFailTicketsData.bodyNode.cond = {};
            if ($scope.id) {
                queryFailTicketsData.bodyNode.cond.id = $scope.id;
            }
            if ($scope.gameCode) {
                queryFailTicketsData.bodyNode.cond.gameCode = $scope.gameCode;
            }
            if ($scope.termCode) {
                queryFailTicketsData.bodyNode.cond.termCode = $scope.termCode;
            }
            socket.emit('data', queryFailTicketsData);
        };
        $scope.rePrint = function (ticket) {
            var queryFailTicketsData = angular.copy(data);
            queryFailTicketsData.cmd='rePrint';
            queryFailTicketsData.bodyNode.id = ticket.id;
            socket.emit('data', queryFailTicketsData);
            $scope.query();
        };


    }]);
