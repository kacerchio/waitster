'use strict';

angular.module('waitsterApp')
.directive('todo', function(){
  return {
    templateUrl: 'templates/todo.html',
    replace: true,
    controller: 'todoCtrl'
  }
});