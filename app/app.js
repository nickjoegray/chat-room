'use strict';

angular.module('chatApp', [])

.controller('ChatCtrl', function($scope, $http) {

   $scope.chatChannel = "chatApp";
   $scope.messageLimit = 50;
   $scope.defaultUsername = "Guest";

   $scope.currentConnectionStatus = 0;
   $scope.errorMessage;
   $scope.loggedIn = false;

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

   $scope.attemptLogin = function() {
      $scope.errorMessage = "";

      if (!$scope.message.username) {
         $scope.errorMessage = "you must enter a username.";
         return;
      }

      if (!$scope.currentConnectionStatus) {
         $scope.errorMessage = "you're not connect to our chat room yet.";
         return;
      }

      $scope.loggedIn = true;
   };

   $scope.postMessage = function() {
      PUBNUB.publish({
         channel : $scope.chatChannel,
         message : $scope.message
      });

      $scope.message.text = "";
   };

});