'use strict';
 app.config(function($mdThemingProvider) {

        //change default color for primary
        var indigo = $mdThemingProvider.extendPalette('indigo', {
            '500': '569fd4'
        });
        $mdThemingProvider.definePalette('indigo', indigo);

        //change default color for warn
        var indigo = $mdThemingProvider.extendPalette('red', {
            '500': 'ff5800'
        });
        $mdThemingProvider.definePalette('red', indigo);

        $mdThemingProvider.theme('default').primaryPalette('indigo').warnPalette('red');  

        //here you change placeholder/foreground color.
        $mdThemingProvider.theme('default').foregroundPalette[3] = "rgba(0,0,0,0.67)";

});
      app.controller('RegistrationController', RegistrationController); 
  function RegistrationController($scope,Upload,Flash,$localStorage,$location,$window,$anchorScroll,$http,$rootScope,$route) {

      $scope.reg={};
  		$scope.validateEmail=function()
  		{
        var email=$scope.reg.email;
        if(email!=null)
        {
  			$http({
  				method:'POST',
  				url:'/users/validateEmail',
  				data:{'email':email}
  			}).success(function(data){
  				if(data.status=="200"){
  					$scope.invalid_email=false;
  				}
  				else
  				{
  					$scope.invalid_email=true;
  				}
  			});
      }
  		}
  		var name=$scope.reg.name;
      var password=$scope.reg.password;
      var profilepic=$scope.files01;
      var email=$scope.reg.email;
      var last_name=$scope.reg.lname;
  		$scope.saveProfile=function()
  		{

        if ($scope.register.$valid) {
  			Upload.upload({
  				method:'POST',
  				url:'/users/saveProfile',
  				data:{'userprof':$scope.reg,file:$scope.file}
  			}).success(function(data){
  				if(data.status=="200"){
  					Flash.create('success', 'Registered Successfully.. Now login to continue', 'msg_class');
            $location.path('/login');
  				}
  				else
  				{
  					Flash.create('warning', 'Internal issues', 'msg_class');
  				}
  			});
        // $scope.$watch('files.length',function(newVal,oldVal){
        //     console.log($scope.files);
        // });
      }
  		}
      $scope.uploadedImage=function(file,errFiles){

        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
      }
      // $scope.upload=function(file){
      //   Upload.upload({
      //     url: 'upload/url',
      //       data: {file: file, 'username': $scope.username}
      //   })
      // };
   }
