'use strict';
  // angular.module('chatApp', ['ngMaterial'])
      app.controller('usersController', usersController);
      

  function usersController($scope) {
    alert("hisdfdsafasf");
    var name="Balaji";
    $scope.data = 'Hello there .....';
    $scope.isenter=function(){
      if($scope.cbenter==true)
      {
        // alert("hello");
        $scope.send_msg();
      }
    };
    $scope.send_msg=function(){
    	if($scope.message!="" && $scope.message!="undefined")
    	{
    	var myEl = angular.element(document.querySelector( '#msg_frm' ) ).append('<div class="msg_from pull-right"><div class="toname"><b>'+name+'</b></div>'+$scope.message+'</div>');
    	$scope.message="";
    }

    };
  }