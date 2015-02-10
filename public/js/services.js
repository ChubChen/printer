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
        var userName = $rootScope.userName;
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
                        };
                    });
                })
            }
        };
    }]);
  
 
