'use strict';

var socket = io('http://localhost:3000');

angular.module('chatApp', [])

.controller('ChatCtrl', function($scope, $http) {

   $scope.chatChannel = "chatApp";
   $scope.messageLimit = 50;
   $scope.defaultUsername = "Guest";

   $scope.currentConnectionStatus = 0;
   $scope.errorMessage;
   $scope.loggedIn = false;

   $scope.chatLogs = function() {
      PUBNUB.history( {
         channel: $scope.chatChannel,
         limit: $scope.messageLimit
      }, function(messages) {
         $scope.$apply(function(){
            $scope.chatMessages = messages;          
         }); 
      });
   };

   $scope.postMessage = function() {
      if (!$scope.loggedIn) {
        $scope.errorMessage = "you must login first.";
        return;
      }

      if (!$scope.message.text) {
        $scope.errorMessage = "you must enter a message.";
        return;
      }

      PUBNUB.publish({
         channel : $scope.chatChannel,
         message : $scope.message
      });

      $scope.message.text = "";
   };

   PUBNUB.subscribe({
      channel: $scope.chatChannel,
      restore: false,

      callback: function(message) { 
      //update messages with the new message
         $scope.$apply(function(){
            $scope.chatMessages.unshift(message);          
         }); 
      },

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
            // Load messages that are logged already
            $scope.chatLogs();
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

   $scope.attemptLogout = function() {
      $scope.loggedIn = false;
      $scope.message.username = "";
   };

});