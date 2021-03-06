/* jshint -W097 */
/* jshint devel:true */
'use strict';
   
/* Controllers */
   
var printerControllers = angular.module('printerControllers', []);

/*
 *  系统监控
 **/
printerControllers.controller('systemListCtrl', ['$scope', 'socket', 'params',
    function ($scope, socket, params) {
        /*初始化命令**/
        $scope.num=-999;
        var data = {};
        var bodyNode = {};
        data.bodyNode = bodyNode;
        //初始化终端机列表状态
        var terminalListData = angular.copy(data);
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
            console.log($scope.terminals);
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

        socket.on('changeAmount', function(obj){
    	    var _terminal ;
    	    if(typeof obj == "string" ){
    	    	_terminal = JSON.parse(obj);
    	    }else{
    		_terminal = obj;
     	    }
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
            console.log(successQueen);
            $scope.successQueen = successQueen;
        });

        $scope.addTerminal = function () {
            $scope.num=9999;
            $scope.terminal = {};
            $scope.game = params.game;
            $scope.statusList = params.statusList;
            $scope.door = false;
        };
        $scope.editTerminal = function (terminal) {
            $scope.num=9999;
            $scope.game = params.game;
            $scope.statusList = params.statusList;
            $scope.hadGame = terminal.gameCode;
            $scope.terminal = angular.copy(terminal);
            $scope.door = true;
        };

        $scope.editConfig = function(terminal){
            $scope.terminal  = angular.copy(terminal);
            $scope.configdoor = true;
        };

        $scope.refeshAmount = function(terminal){
            var data = {};
            var bodyNode= {};
            data.cmd = "refeshAmount";
            bodyNode.id= terminal.id;
            data.bodyNode = bodyNode;
            socket.emit('data', data);
        };

        socket.on('terminalCount', function (body) {
            if($scope.terminals === undefined){
                return;
            }
            for (var i = 0; i < $scope.terminals.length; i++) {
                if (body.terminalId == $scope.terminals[i].id) {
                    $scope.terminals[i].waitCount = body.waitCount;
                    $scope.terminals[i].succCount = body.succCount;
                }
            }
        });

        $scope.$on('ngRepeatFinished',function(ngRepeatFinishedEvent){
            console.log('$scope.terminals is =======================================');
            console.log($scope.terminals);
            if($scope.terminals){
                socket.on('statusChange', function (terminal) {
                    var data = {};
                    if(typeof terminal === "string"){
                        data = JSON.parse(terminal);   
                    }else if(typeof terminal === "object"){
                        data = terminal;
                    }
                    var _terminal = {};
                    if(terminal.value){
                        _terminal = data.value;
                    }else{
                        _terminal = data;
                    }
                    for (var i = 0; i < $scope.terminals.length; i++) {
                        if (_terminal.id == $scope.terminals[i].id && _terminal.status != $scope.terminals[i].status) {
                            _terminal.waitCount = $scope.terminals[i].waitCount;
                            _terminal.succCount = $scope.terminals[i].succCount;
                            $scope.terminals[i] = _terminal;
                            console.log($scope.terminals[i]);
                        }
                    }
                });
            }
        });


    }]);
/*
 *  票务规则管理
 **/
printerControllers.controller('ticketRuleCtrl', ['$scope', 'socket', 'params',
    function ($scope, socket, params) {
        /*初始化命令**/
        $scope.num=-999;
        var data = {};
        var bodyNode = {};
        data.bodyNode = bodyNode;
        //初始化客户列表
        var ticketRuleData = angular.copy(data);
        //ticketRuleData.cmd = 'ticketRuleList';
        //socket.emit('data', ticketRuleData);
        $scope.editSendTicketRule = function () {
            $scope.num=9999;
            $scope.game = params.game;
            $scope.moneyRule = params.moneyRule;
            $scope.tRules = params.tRules;
        };
    }]);
/*
 *  用户管理
 **/
printerControllers.controller('userListCtrl', ['$scope', 'socket', '$rootScope',
    function ($scope, socket, $rootScope) {
        /*初始化命令**/
        var data = {};
        var bodyNode = {};
        data.bodyNode = bodyNode;
        //初始化客户列表
        var userListData = angular.copy(data);
        userListData.cmd = 'userList';
        socket.emit('data', userListData);
        /*其它命令**/
        //接收用户列表
        socket.on('userList', function (users) {
            $scope.users = users;
            //socket.emit('userAuthorityChanged', users)
        });
        $scope.addUser = function () {
            $scope.user = {};
            $scope.isRoot = false;
            $scope.notRoot = false;
        };
        $scope.editUser = function (user) {
            $scope.isRoot = false;
            $scope.notRoot = false;
            $scope.user = angular.copy(user);
            if(user.userName === $rootScope.userInfo.userName){
                $scope.isRoot = true;
                $scope.notRoot = true;
            }
        };
        $scope.auths = [
                        {code:0, name:'系统监控'},
                        {code:1, name:'错误票处理'},
                        {code:2, name:'票据打印'},
                        {code:3, name:'批量兑奖'},
                        {code:4, name:'对账查询'},
                        {code:5, name:'票务管理'}
                        ];
    }]);

/*
 *  Main页控制
 **/
printerControllers.controller('mainCtrl', ['$scope', 'socket', '$rootScope',
    function ($scope, socket, $rootScope) {
        $rootScope.homepageTitle = '出票管理系统';

        /*初始化命令**/
        var data = {};
        var bodyNode = {};
        data.bodyNode = bodyNode;
        //初始化取票状态
        var queryCatchTicketsStatusData = angular.copy(data);
        queryCatchTicketsStatusData.cmd = 'queryCatchTicketsStatus';
        socket.emit('data', queryCatchTicketsStatusData);

        $rootScope.gameCodes = {
                            'T05':'11选5',
                            'T01':'大乐透',
                            'T02':'七星彩',
                            'T03':'排列三',
                            'T04':'排列五',
                            'T51':'竞彩足球',
                            'T52':'竞彩篮球',
                            'F01':'双色球'
                        };

        /*其它命令**/
        $scope.catchTicketsStatus = function () {
            var catchTicketsStatusData = angular.copy(data);
            catchTicketsStatusData.cmd = 'catchTicketsStatus';
            socket.emit('data', catchTicketsStatusData);
        };
        $scope.views = [];
        var views = {
                     '系统监控': {url: 'system',hasSubItems: true,name:'系统监控'},
                     '错误票处理': {url: 'fail',hasSubItems: false,name:'错误票处理'},
                     '批量兑奖': {url: 'waitbonus',hasSubItems: false,name:'手动批量兑奖'},
                     '对账查询': {url: 'statistics',hasSubItems: true,name:'对账查询'},
                     '用户管理': {url: 'user',hasSubItems: true,name:'用户管理'},
                     '票务管理': {url: 'ticketrule',hasSubItems: true,name:'票务管理'}
                    };
        var userinfo = $rootScope.userInfo;
        var len = userinfo.authority.length;
        if(userinfo.authority[0] === 'root'){
            len = Object.keys(views).length;
            for(var i=0; i<len; i++){
                $scope.views.push(views[Object.keys(views)[i]]);
            }
        }else{
            for(var j=0; j<len; j++){
                $scope.views.push(views[userinfo.authority[j]]);
            }   
        }

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

        socket.on('update-fail-ticekt-list-global', function (failticket) {
            $scope.failTicketId = failticket.value.id;
            $('#myModal').modal('show');
            $('audio')[0].play();
            $rootScope.homepageTitle = '错误票来了！！！';
        });

        $scope.toFailTicketPage = function(){
            $('#myModal').modal('hide');
            $('#myModal').on('hidden.bs.modal', function(){
                window.location.href = '#/fail';
            });
        };

        $('#myModal').on('hide.bs.modal', function(){
            $('audio')[0].pause();
            $rootScope.homepageTitle = '出票管理系统';
            $rootScope.$apply();
        });


    }]);


/*
 *  Ticket页控制
 **/
printerControllers.controller('ticketListCtrl', ['$scope', 'socket', '$rootScope', 'Pagination',
    function ($scope, socket, $rootScope, Pagination) {
        $scope.num=-999;
        /*初始化命令**/
        var data = {};
        var bodyNode = {};
        data.bodyNode = bodyNode;
        $scope.gameCodes = $rootScope.gameCodes;

        //初始化成功票据
        var querySuccessTicketsData = angular.copy(data);
        var pag = new Pagination(querySuccessTicketsData);
        if ($scope.curPage) {
        } else {
            querySuccessTicketsData.bodyNode.curPage = pag.curPage;
            querySuccessTicketsData.bodyNode.limit = 0;
        }
        querySuccessTicketsData.cmd = 'querySuccessTickets';
        socket.emit('data', querySuccessTicketsData);
        socket.on('querySuccessTickets', function (backNode) {
            pag.queryCallback(backNode,$scope);
        });
        $scope.toPage = function(page,direction){
            pag.toPage(page,direction,$scope);
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
            if ($scope.terminalId) {
                querySuccessTicketsData.bodyNode.cond.terminalId = $scope.terminalId;
            }
            socket.emit('data', querySuccessTicketsData);
        };
        $scope.printTicket = function (ticket) {
            var printTicketData = angular.copy(data);
            printTicketData.cmd='printTicket';
            printTicketData.bodyNode.id = ticket.id;
            socket.emit('data', printTicketData);
        };

        //票据打印权限
        var auths = $rootScope.userInfo.authority;
        auths.forEach(function(auth, index){
            if(auth === '票据打印' || auth === 'root'){
                $scope.hasAuthority = true;
            }
        });

        //接受打印响应
        socket.on('printTicket', function (result) {
            var res='';
            if(result === 0){
                res='没有可用的终端机';
            }else{
                var querySuccessTicketsData = angular.copy(data);
                querySuccessTicketsData.bodyNode.curPage = $scope.curPage;
                querySuccessTicketsData.bodyNode.limit = pag.limit;
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

        $scope.$on('ngRepeatFinished',function(ngRepeatFinishedEvent){
            $('.pageNumber').removeClass('currentPage');
            $('.pageNumber').eq(pag.index).addClass('currentPage');

            $('#selectGame').multiselect({
                onChange: function(option, checked) {
                    var values = [];
                    $('#selectGame').children('option').each(function() {
                        if ($(this).val() !== option.val()) {
                            values.push($(this).val());
                        }
                    });
                    $('#selectGame').multiselect('deselect', values);
                    $('#selectGame').siblings('.btn-group').removeClass('open');
                    if($('#selectGame').multiselect('getSelected').val() !== null){
                        $scope.gameCode = $('#selectGame').multiselect('getSelected').val()[0];
                        $scope.$apply();
                    }else{
                        $scope.gameCode = '';
                        $scope.$apply();
                    }
                },
                maxHeight: 400,
                enableFiltering: false
            });
        });
    }]);




/*
 *  Bonus页控制
 **/
printerControllers.controller('bonusListCtrl', ['$scope', 'socket', 'Pagination', '$rootScope',
    function ($scope, socket, Pagination, $rootScope) {
        /*初始化命令**/
        var data = {};
        var bodyNode = {};
        data.bodyNode = bodyNode;
        $scope.gameCodes = $rootScope.gameCodes;

        //初始化成功票据
        var queryWaitBounsTicketsData = angular.copy(data);
        var pag = new Pagination(queryWaitBounsTicketsData);
        if ($scope.curPage) {
        } else {
            queryWaitBounsTicketsData.bodyNode.curPage = pag.curPage;
            queryWaitBounsTicketsData.bodyNode.limit = 0;
        }
        queryWaitBounsTicketsData.cmd = 'queryWaitBonusTickets';
        socket.emit('data', queryWaitBounsTicketsData);
        /*其它命令**/
        //接收成功票据列表
        socket.on('queryWaitBonusTickets', function (backNode) {
            pag.queryCallback(backNode,$scope);
        });
        $scope.toPage = function (page,direction) {
            pag.toPage(page,direction,$scope);
        };

        $scope.query = function () {
            queryWaitBounsTicketsData.bodyNode.curPage = 1;
            queryWaitBounsTicketsData.bodyNode.cond = {};
            if ($scope.id) {
                queryWaitBounsTicketsData.bodyNode.cond.ticketId = $scope.id;
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
            printBonusTicket.bodyNode.id = ticket.ticketId;
            socket.emit('data', printBonusTicket);
        };

        $scope.reBonus = function (ticket) {
            var reBonus = angular.copy(data);
            reBonus.cmd='reBonus';
            reBonus.bodyNode.id = ticket.ticketId;
            socket.emit('data', reBonus);
            $scope.query();
        };

        //接受打印响应
        socket.on('printBonusTicket', function (result) {
            var res='';
            if(result === 0){
                res='没有可用的终端机';
            }else{
                res='已经发送终端机进行出票';
            }
            alert(res);
        });

        $scope.$on('ngRepeatFinished',function(ngRepeatFinishedEvent){
            $('.pageNumber').removeClass('currentPage');
            $('.pageNumber').eq(pag.index).addClass('currentPage');

            $('#selectGame').multiselect({
                onChange: function(option, checked) {
                    var values = [];
                    $('#selectGame').children('option').each(function() {
                        if ($(this).val() !== option.val()) {
                            values.push($(this).val());
                        }
                    });
                    $('#selectGame').multiselect('deselect', values);
                    $('#selectGame').siblings('.btn-group').removeClass('open');
                    if($('#selectGame').multiselect('getSelected').val() !== null){
                        $scope.gameCode = $('#selectGame').multiselect('getSelected').val()[0];
                        //$scope.isselected = false;
                        $scope.$apply();
                    }else{
                        $scope.gameCode = '';
                        //$scope.isselected = true;
                        $scope.$apply();
                    }
                },
                maxHeight: 400,
                enableFiltering: false
            });
        });
    }]);

/*
* 未兑奖waitBonusCtrl页控制
**/
printerControllers.controller('waitBonusCtrl', ['$scope', 'socket', 'Pagination', '$rootScope',
    function ($scope, socket, Pagination, $rootScope) {
        /*初始化命令**/
        var data = {};
        var bodyNode = {};
        data.bodyNode = bodyNode;
        $scope.gameCodes = $rootScope.gameCodes;

        //初始化成功票据
        var queryNotBonusTicketsData = angular.copy(data);
        var pag = new Pagination(queryNotBonusTicketsData);
        if ($scope.curPage) {
        } else {
            queryNotBonusTicketsData.bodyNode.curPage = pag.curPage;
            queryNotBonusTicketsData.bodyNode.limit = 0;
        }
        queryNotBonusTicketsData.cmd = 'queryNotBonusTickets';
        socket.emit('data', queryNotBonusTicketsData);
        /*其它命令**/
        //接收成功票据列表
        socket.on('queryNotBonusTickets', function (backNode) {
            pag.queryCallback(backNode,$scope);
        });
        $scope.toPage = function (page,direction) {
            pag.toPage(page,direction,$scope);
        };

        $scope.query = function () {
            queryNotBonusTicketsData.bodyNode.curPage = 1;
            queryNotBonusTicketsData.bodyNode.cond = {};
            if ($scope.id) {
                queryNotBonusTicketsData.bodyNode.cond.id = $scope.id;
            }
            if ($scope.gameCode) {
                queryNotBonusTicketsData.bodyNode.cond.gameCode = $scope.gameCode;
            }
            if ($scope.termCode) {
                queryNotBonusTicketsData.bodyNode.cond.termCode = $scope.termCode;
            }
            socket.emit('data', queryNotBonusTicketsData);
        };

        $scope.$on('ngRepeatFinished',function(ngRepeatFinishedEvent){
            $('.pageNumber').removeClass('currentPage');
            $('.pageNumber').eq(pag.index).addClass('currentPage');

            $('#selectGame').multiselect({
                onChange: function(option, checked) {
                    var values = [];
                    $('#selectGame').children('option').each(function() {
                        if ($(this).val() !== option.val()) {
                            values.push($(this).val());
                        }
                    });
                    $('#selectGame').multiselect('deselect', values);
                    $('#selectGame').siblings('.btn-group').removeClass('open');
                    if($('#selectGame').multiselect('getSelected').val() !== null){
                        $scope.gameCode = $('#selectGame').multiselect('getSelected').val()[0];
                        //$scope.isselected = false;
                        $scope.$apply();
                    }else{
                        $scope.gameCode = '';
                        //$scope.isselected = true;
                        $scope.$apply();
                    }
                },
                maxHeight: 400,
                enableFiltering: false
            });
           
           //声明变量来控制表格的多选、全选、反选。初始化全选为false
        $scope.check = {'chkAll':false,'chkItem':[]};
        
        //初始化check.chkItem数组。只初始化一次。数组的元素个数与显示的数据有多少行一致。全部初始化为false。
        $scope.initChkItem=function(){
            
            //如果当前有数据，并且check.chkItem数组里面没值，则对check.chkItem进行初始化。下次进来则不再初始化（只初始化一次）
            if($scope.check.chkItem.length==0 && $scope._array.length>0){
                for(var i=0;i<$scope._array.length;i++){
                    //把每行数据的checkbox都初始化为false（未选中状态）
                    $scope.check.chkItem[i]=false;
                }
            }
            
        }

        
        /**
         * 点击单条数据的checkbox
         * @param vo 当前行的数据
         * @param chkflag 当前行点击之前的选中状态
         * @param index 当前行的索引号
         *
         */
        $scope.clickItem = function(vo,chkflag,index){
            $scope.initChkItem();
            //chkflag = chkflag == undefined ? false:chkflag;
            $scope.check.chkItem[index] = !chkflag;
            //当前选中就去做判断是否所有都选中，若是，则全选设为选中。
            //当前取消选中，则直接把全选设为不选中
            if(!$scope.check.chkItem[index]){
                $scope.check.chkAll = false;
            }else{
                var isAllChecked = true;
                for(var i=0;i<$scope.check.chkItem.length;i++){
                    if(!$scope.check.chkItem[i]){
                        isAllChecked = false;
                        break;
                    }
                }
                if(isAllChecked){
                    $scope.check.chkAll = true;
                }
            }
            

            //TODO 改变选中的数组
        }
        
        //全选和全反选
        $scope.clickAllObj=function(flag){
            $scope.initChkItem();
            for(var i=0;i<$scope.check.chkItem.length;i++){
                $scope.check.chkItem[i]=flag;
            }
            
            //TODO 改变选中的数组
        }
        });
    }]);

/*
 *  History页控制
 **/
printerControllers.controller('historyListCtrl', ['$scope', 'socket', 'Pagination',
    function ($scope, socket, Pagination) {
        $scope.num=-999;
        /*初始化命令**/
        var data = {};
        var bodyNode = {};
        data.bodyNode = bodyNode;
        //初始化成功票据
        var queryHistoryTicketsData = angular.copy(data);
        var pag = new Pagination(queryHistoryTicketsData);
        if ($scope.curPage) {
        } else {
            queryHistoryTicketsData.bodyNode.curPage = pag.curPage;
            queryHistoryTicketsData.bodyNode.limit = 0;
        }
        queryHistoryTicketsData.cmd = 'queryHistoryTickets';
        socket.emit('data', queryHistoryTicketsData);
        /*其它命令**/
        //接收成功票据列表
        socket.on('queryHistoryTickets', function (backNode) {
            pag.queryCallback(backNode,$scope);
        });
        $scope.toPage = function (page,direction) {
            pag.toPage(page,direction,$scope);
        };

        $scope.query = function () {
            queryHistoryTicketsData.bodyNode.curPage = 1;
            queryHistoryTicketsData.bodyNode.cond = {};
            if ($scope.id) {
                queryHistoryTicketsData.bodyNode.cond.ticketId = $scope.id;
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
            printHistoryTicketData.bodyNode.id = ticket.ticketId;
            socket.emit('data', printHistoryTicketData);
        };

        $scope.desTicket = function (ticket) {
            $scope.num=9999;
            $scope.ticket = angular.copy(ticket);
        };

        socket.on('printHistoryTicketData', function (result) {
            var res='';
            if(result === 0){
                res='没有可用的终端机';
            }else{
                res='已经发送终端机进行出票';
            }
            alert(res);
        });

        $scope.$on('ngRepeatFinished',function(ngRepeatFinishedEvent){
            $('.pageNumber').removeClass('currentPage');
            $('.pageNumber').eq(pag.index).addClass('currentPage');

            $('#selectGame').multiselect({
                onChange: function(option, checked) {
                    var values = [];
                    $('#selectGame').children('option').each(function() {
                        if ($(this).val() !== option.val()) {
                            values.push($(this).val());
                        }
                    });
                    $('#selectGame').multiselect('deselect', values);
                    $('#selectGame').siblings('.btn-group').removeClass('open');
                    if($('#selectGame').multiselect('getSelected').val() !== null){
                        $scope.gameCode = $('#selectGame').multiselect('getSelected').val()[0];
                        //$scope.isselected = false;
                        $scope.$apply();
                    }else{
                        $scope.gameCode = '';
                        //$scope.isselected = true;
                        $scope.$apply();
                    }
                },
                maxHeight: 400,
                enableFiltering: false
            });
        });
    }]);




/*
 *  Fail页控制
 **/
printerControllers.controller('failListCtrl', ['$scope', 'socket', '$rootScope', 'Pagination',
    function ($scope, socket, $rootScope, Pagination) {
        /*初始化命令**/
        /*初始化命令**/
        var data = {};
        var bodyNode = {};
        data.bodyNode = bodyNode;
        //初始化成功票据
        var queryFailTicketsData = angular.copy(data);
        if ($scope.curPage) {
        } else {
            queryFailTicketsData.bodyNode.curPage = 1;
            queryFailTicketsData.bodyNode.limit = 15;
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
            queryFailTicketsData.bodyNode.id = ticket.value.id;
            socket.emit('data', queryFailTicketsData);
            $scope.query();
        };
        /*var data = {};
        var bodyNode = {};
        data.bodyNode = bodyNode;
        $scope.gameCodes = $rootScope.gameCodes;

        var queryFailTicketsData = angular.copy(data);
        var pag = new Pagination(queryFailTicketsData);
        if ($scope.curPage) {
        } else {
            queryFailTicketsData.bodyNode.curPage = pag.curPage;
            queryFailTicketsData.bodyNode.limit = 0;
        }
        queryFailTicketsData.cmd = 'queryFailTickets';
        socket.emit('data', queryFailTicketsData);


        socket.on('queryFailTickets', function (backNode) {
            pag.queryCallback(backNode,$scope);
        });

        $scope.toPage = function(page,direction){
            pag.toPage(page,direction,$scope);
        };

        socket.on('update-fail-ticekt-list', function (failticket) {
            $scope.successTickets.unshift(failticket);
            socket.emit('data', queryFailTicketsData);
        });

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
            queryFailTicketsData.bodyNode.id = ticket.value.id;
            socket.emit('data', queryFailTicketsData);
            $scope.query();
        };

        $scope.$on('ngRepeatFinished',function(ngRepeatFinishedEvent){
            $('.pageNumber').removeClass('currentPage');
            $('.pageNumber').eq(pag.index).addClass('currentPage');

            $('#selectGame').multiselect({
                onChange: function(option, checked) {
                    var values = [];
                    $('#selectGame').children('option').each(function() {
                        if ($(this).val() !== option.val()) {
                            values.push($(this).val());
                        }
                    });
                    $('#selectGame').multiselect('deselect', values);
                    $('#selectGame').siblings('.btn-group').removeClass('open');
                    if($('#selectGame').multiselect('getSelected').val() !== null){
                        $scope.gameCode = $('#selectGame').multiselect('getSelected').val()[0];
                        $scope.$apply();
                    }else{
                        $scope.gameCode = '';
                        $scope.$apply();
                    }
                },
                maxHeight: 400,
                enableFiltering: false
            });
        });*/
    }]);

/*
 *  statistics页控制
 **/
printerControllers.controller('statisticsCtrl', ['$scope', 'socket', '$rootScope', 'Pagination', '$http',
    function ($scope, socket, $rootScope, Pagination, $http) {

        /*日期选择插件的CSS*/
        $rootScope.stylesheets = [
            '//cdn.jsdelivr.net/bootstrap.daterangepicker/2/daterangepicker.css'
        ];

        $('input[name="daterange"]').daterangepicker({
            "timePicker": true,
            "timePickerSeconds": true,
            "locale": {
                format: 'YYYY-MM-DD hh:mm:ss'
            },
            "startDate": '2013-01-01 00:00:00',
            "endDate": '2013-12-31 00:00:00'
        }, function(start, end, label) {
            console.log('New date range selected: ' + start.format('YYYY-MM-DD hh:mm:ss') + ' to ' + end.format('YYYY-MM-DD hh:mm:ss') + ' (predefined range: ' + label + ')');
            $scope.startTime = start.format('YYYY-MM-DD hh:mm:ss');
            $scope.endTime = end.format('YYYY-MM-DD hh:mm:ss');
        });

        /*初始化命令**/
        var data = {};
        var bodyNode = {};
        data.bodyNode = bodyNode;
        $scope.gameCodes = $rootScope.gameCodes;
        $scope.statuses = {
            '1200': '已出票',
            '1100': '已兑奖'
        }

       //初始化成功票据
        var ticketsData = angular.copy(data);
        var pag = new Pagination(ticketsData);
        if ($scope.curPage) {
        } else {
            ticketsData.bodyNode.curPage = pag.curPage;
            ticketsData.bodyNode.limit = 0;
        }
        ticketsData.cmd = 'queryTicketsAmount';
        ticketsData.bodyNode.cond = {};
        ticketsData.bodyNode.cond.gameCode = {$regex:''};
        ticketsData.bodyNode.cond.termCode = {$regex:''};
        ticketsData.bodyNode.cond.terminalId = {$regex:''};
        ticketsData.bodyNode.cond.startTime = 0;
        ticketsData.bodyNode.cond.status = '1200';
        socket.emit('data', ticketsData);
        socket.on('queryTicketsAmount', function (backNode) {
            pag.queryCallback(backNode,$scope);
        });
        $scope.toPage = function(page,direction){
            pag.toPage(page,direction,$scope);
        };

        $scope.query = function () {
            ticketsData.bodyNode.curPage = 1;
            ticketsData.bodyNode.cond = {};
            if ($scope.gameCode) {
                ticketsData.bodyNode.cond.gameCode = $scope.gameCode;
            }else{
                ticketsData.bodyNode.cond.gameCode = {$regex:''};
            }
            if ($scope.ticketStatus) {
                ticketsData.bodyNode.cond.status = $scope.ticketStatus;
            }else{
                ticketsData.bodyNode.cond.status = '1200';
            }
            if ($scope.termCode) {
                ticketsData.bodyNode.cond.termCode = $scope.termCode;
            }else{
                ticketsData.bodyNode.cond.termCode = {$regex:''};
            }
            if ($scope.terminalId) {
                ticketsData.bodyNode.cond.terminalId = $scope.terminalId;
            }else{
                ticketsData.bodyNode.cond.terminalId = {$regex:''};
            }
            if ($scope.startTime) {
                ticketsData.bodyNode.cond.startTime = $scope.startTime;
            }
            if ($scope.endTime) {
                ticketsData.bodyNode.cond.endTime = $scope.endTime;
            }
            console.log(ticketsData);
            socket.emit('data', ticketsData);
        };

        $scope.$on('ngRepeatFinished',function(ngRepeatFinishedEvent){
            $('.pageNumber').removeClass('currentPage');
            $('.pageNumber').eq(pag.index).addClass('currentPage');

            $('#selectGame').multiselect({
                onChange: function(option, checked) {
                    var values = [];
                    $('#selectGame').children('option').each(function() {
                        if ($(this).val() !== option.val()) {
                            values.push($(this).val());
                        }
                    });
                    $('#selectGame').multiselect('deselect', values);
                    $('#selectGame').siblings('.btn-group').removeClass('open');
                    if($('#selectGame').multiselect('getSelected').val() !== null){
                        $scope.gameCode = $('#selectGame').multiselect('getSelected').val()[0];
                        $scope.$apply();
                    }else{
                        $scope.gameCode = '';
                        $scope.$apply();
                    }
                },
                maxHeight: 400,
                enableFiltering: false
            });

            $('#selectStatus').multiselect({
                onChange: function(option, checked) {
                    var values = [];
                    $('#selectStatus').children('option').each(function() {
                        if ($(this).val() !== option.val()) {
                            values.push($(this).val());
                        }
                    });
                    $('#selectStatus').multiselect('deselect', values);
                    $('#selectStatus').siblings('.btn-group').removeClass('open');
                    if($('#selectStatus').multiselect('getSelected').val() !== null){
                        $scope.ticketStatus = $('#selectStatus').multiselect('getSelected').val()[0];
                        $scope.$apply();
                    }else{
                        $scope.ticketStatus = '';
                        $scope.$apply();
                    }
                },
                maxHeight: 400,
                enableFiltering: false
            });
        });
  
        $scope.check = function () {
            var bodyData = {};
            var sendData = {};
            sendData = {
                gameCode: $scope.gameCode || '',
                status: $scope.ticketStatus || '',
                termCode: $scope.termCode || '',
                startTime: $scope.startTime || '',
                endTime: $scope.endTime || '',
                //pageIndex: $scope.curPage,
                //recordsNumInPage: pag.limit,
                logicNum: '106'
            };
            bodyData.cmd = 'queryNodePlatDatas';
            bodyData.bodyNode = sendData;
            socket.emit('data', bodyData);
        };
        socket.on('queryNodePlatDatas', function (backNode) {
            console.log(backNode.result);
            $scope.backNode = backNode.result;
        });
    }]);