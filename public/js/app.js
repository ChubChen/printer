/* jshint -W097 */
'use strict';

/* App Module */

var printerApp = angular.module('printerApp', [
    'ngRoute',
    'printerControllers',
    'printerGlobalParam',
    'printerFilters',
    'printerServices',
    'printerDirectives',
]);

printerApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/system', {
                templateUrl: '../partials/system-list.html',
                controller: 'systemListCtrl'
            }).
            when('/user', {
                templateUrl: '../partials/user-list.html',
                controller: 'userListCtrl'
            }).
            when('/tickets', {
                templateUrl: '../partials/ticket-list.html',
                controller: 'ticketListCtrl'
            }).
            when('/bonus', {
                templateUrl: '../partials/bonus-list.html',
                controller: 'bonusListCtrl'
            }).
            when('/history', {
                templateUrl: '../partials/history-list.html',
                controller: 'historyListCtrl'
            }).
            when('/fail', {
                templateUrl: '../partials/fail-list.html',
                controller: 'failListCtrl'
            }).
            when('/statistics', {
                templateUrl: '../partials/statistics.html',
                controller: 'statisticsCtrl'
            }).
            when('/waitbonus', {
                templateUrl: '../partials/wait-bonus-list.html',
                controller: 'waitBonusCtrl'
            }).
            when('/ticketrule', {
                templateUrl: '../partials/pw-rule-list.html',
                controller: 'ticketRuleCtrl'
            }).
            otherwise({
                redirectTo: '/system'
            });
    }]);