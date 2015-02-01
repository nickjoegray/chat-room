'use strict';

angular.module('chatApp', [])

.controller('ChatCtrl', function($scope, $http) {

   $scope.chatChannel = "chatApp";
   $scope.messageLimit = 50;
   $scope.defaultUsername = "Guest";

   $scope.currentConnectionStatus = 0;
   $scope.errorMessage;

   PUBNUB.subscribe({
      channel: $scope.chatChannel,
      restore: false,

      callback: function() { },

      disconnect: function() {   
         $scope.$apply(function(){
            $scope.currentConnectionStatus = 0;
         });
      },

      reconnect: function() {   
         $scope.$apply(function(){
            $scope.currentConnectionStatus = 1;
         });
      },

      connect: function() {
         $scope.$apply(function(){
            $scope.currentConnectionStatus = 2;
         });
      }
   });

});