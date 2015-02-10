'use strict';

/* Filters */

var printerFilters = angular.module('printerFilters', []);

printerFilters.filter('checkmark', ['$scope',
  function() {
     return function(input) {
        return input ? '\u2713' : '\u2718';
     };
}]);

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

