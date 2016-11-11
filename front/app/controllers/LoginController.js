app.controller('LoginController', function($localStorage,$location,$scope,$http,Flash,$rootScope) {
    $scope.user={};
    function setstatus(id,state)
{
  $http({
          method:'POST',
          url:'/users/statusChange',
          data:{'s_id':id,'state':state}
      }).success(function(data){
            
});
}
        // function to submit the form after all validation has occurred            
        $scope.submitForm = function() {
            var data_user=$scope.user;
            console.log($scope.user+'--');
            // check to make sure the form is completely valid
            if ($scope.userForm.$valid) {
                $http({
                    method:'POST',
                    url:'/users/uservalidate',
                    data:data_user
                }).success(function(data)
                {
                    if(data.status==true)
                    {
                    $localStorage.uname=data.data;
                    $localStorage.id=data.id;
                    $localStorage.profilepic=data.profilepic;
                    var online="online";
                    setstatus(data.id,online);
                    Flash.create('success', 'Login Successful', 'custom-class');
                     $location.path('/chatpage');
                    
                    }
                    else
                    {
                        // alert('enter correct username/password');
                          Flash.create('danger', 'Incorrect Username/password', 'custom-class');
                        return false;
                    }
                });
            }

        };

    });