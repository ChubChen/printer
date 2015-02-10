'use strict';
/* Directives */

var printerDirectives = angular.module('printerDirectives', []);



//等待执行

printerDirectives.directive('onFinish', function ($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    $(".chzn-select").chosen();
                });
            }
        }
    };
});

