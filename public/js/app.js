'use strict';

/* App Module */

var printerApp = angular.module('printerApp', [
    'ngRoute',
    'printerControllers',
    'printerFilters',
    'printerServices',
    'printerDirectives'
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
            otherwise({
                redirectTo: '/system'
            });
    }]);