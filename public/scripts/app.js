angular.module('indexApp', [])
    .directive('header', function(){
        return {
            restrict: 'E',
            templateUrl: '../templates/headerDirective.html'
        };
    });
