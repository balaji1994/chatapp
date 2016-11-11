(function() {
'use strict';
      app.controller('UsersController', UsersController); 
  function UsersController($notification,$mdDialog,$interval,$scope,$localStorage,$location,$window,$anchorScroll,$http,$rootScope,$route) {
$("#message").focus();
// $notification('Welcome', {
//     body: 'You are welcome.'
//   });
$scope.config = {
    autoHideScrollbar: false,
    theme: 'dark',
    advanced:{
        updateOnContentResize: true
    },
        scrollInertia: 0,
        axis: 'y'
    };

    $localStorage.msg_count=0;
    $scope.rec_name=$localStorage.rec_name;
    var s_id=parseInt($localStorage.id);
    var r_id=parseInt($localStorage.r_id);
    $scope.uname=$localStorage.uname;
    $scope.propic=$localStorage.profpic;
    $scope.profilepic=$localStorage.profilepic; 
    getstatus();
    function getstatus(){
              $http({
                method:'POST',
                url:'/users/getStatus',
                data:{'s_id':s_id}
    }).success(function(data){
        if(data.state==1)
        {
            $scope.userstatus='online';
            $scope.switch_status="online";
        }
        else
        {
          $scope.userstatus='offline';
          $scope.switch_status="offline";
        }
    });
  }
    // console.log($localStorage.r_id);
    if($scope.r_id!=null)
            {
               view_message(parseInt($scope.currentUserId),parseInt($scope.r_id));
                  
            }
            else
            {
                view_message(s_id,r_id);

            }
    listusers(s_id);
     $scope.Timer = $interval(function () {
            if($scope.r_id!=null)
            {
              $http({
                method:'POST',
                url:'/users/ViewMessage',
                data:{'s_id':parseInt($scope.currentUserId),'r_id':parseInt($scope.r_id)}
              }).success(function(data){
                $scope.chat_messages=data.messages;
                $scope.currentUserId=$localStorage.id;

              });
            }
            else
            {
                $http({
                method:'POST',
                url:'/users/ViewMessage',
                data:{'s_id':s_id,'r_id':r_id}
              }).success(function(data){
                $scope.chat_messages=data.messages;
                $scope.currentUserId=$localStorage.id;
              });
            }   
                }, 3000);
     $scope.Timer1 = $interval(function () {
            listusers(s_id);
                }, 5000);


     $scope.Timer2 =$interval(function (){
           msg_notification(s_id);
     },5000);
    //to view all the messages against the receiver
    function view_message(sender_id,receiver_id){

            $http({
            method:'POST',
            url:'/users/ViewMessage',
            data:{'s_id':sender_id,'r_id':receiver_id}
          }).success(function(data){
            $scope.chat_messages=data.messages;
            $scope.currentUserId=$localStorage.id;
          });
         $("#chatbox").scrollTop($('#chatbox')[0].scrollHeight);
    }
    var originatorEv;
    $scope.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    var name=$localStorage.uname;
    if(name==null)
    {
      alert('Login Failure');
      $location.path('/');
    }


    //Enter to send message
    $scope.isenter=function(){
      if($scope.cbenter==true)
      {
        // alert("hello");
        $scope.send_msg();
      }
    };
    //to send the message
    $scope.send_msg=function(){
      
    	if($scope.message!="" && $scope.message!=null)
    	{
       //$scope.append_msg(name,$scope.message);
        $("#chatbox").scrollTop($('#chatbox')[0].scrollHeight);
      if($scope.r_id!=null)
      {
         $scope.saveMessage(s_id,parseInt($scope.r_id),$scope.message);
         $scope.message="";
      }
      else
      {
        $scope.saveMessage(s_id,parseInt($localStorage.r_id),$scope.message);
        $scope.message="";
      }
      //$scope.ai($scope.message);
    }

    };
// var timer = $timeout( function refresh(){
//     $http.get("users/").success(callback)
//     timer = $timeout(refresh, 100000);
//   }, 100000);
    //Robo response funtion
    // $scope.ai=function(message){
    //   message.toLowerCase();
    //   if(message.match(/date/g))
    //   {
    //      $rootScope.response=Date();
    //      $rootScope.resp=true;
    //      $scope.append_msg('ROBO',$rootScope.response);
    //      $scope.saveMessage(r_id,s_id,$rootScope.response);
    //     // return $rootScope.response;
    //   }
    //   else if(message.match(/developer/g))
    //   {
    //     $rootScope.response="My developer is Balaji.O.M";
    //     $rootScope.resp=true;
    //     $scope.append_msg('ROBO',$rootScope.response);
    //     $scope.saveMessage(r_id,s_id,$rootScope.response);
    //   }
    //   else
    //   {
        
    //     $http({
    //       method:'POST',
    //       url:'/users/ResponseMessage',
    //       data:{'question':message}
    //     }).success(function(data){
    //       console.log(data);
    //       if(data.status=="200")
    //       {
    //          $rootScope.response=data.message;
    //          $rootScope.resp=true;
    //           $scope.append_msg('ROBO',$rootScope.response);
    //           $scope.saveMessage(r_id,s_id,$rootScope.response);
    //       }
    //       else
    //       {
    //           $rootScope.response="Try some other question";
    //           $rootScope.resp=true;
    //           $scope.append_msg('ROBO',$rootScope.response);
    //           $scope.saveMessage(r_id,s_id,$rootScope.response);
    //       }

    //     });
        
    //   }
    // };
    //getselected chatlist
    $scope.getchatlist=function(user){
      $scope.r_id=user.id;
      $localStorage.r_id=user.id;
      $localStorage.rec_name=user.name;
      $localStorage.profpic=user.profilepic;
      //console.log($scope.r_id)
      if(user.id!=null)
      {
        $http({
          method:'POST',
          url:'/users/ViewMessage',
          data:{'s_id':s_id,'r_id':parseInt(user.id)}
        }).success(function(data){
          if(data.status=='200')
          {
           $scope.chat_messages=data.messages;
            $scope.currentUserId=$localStorage.id;
            $scope.rec_name=user.name;
            $scope.propic=user.profilepic;
            $scope.usrstate=user.status==1?"online":"offline";
          }
          else
          {
               $scope.chat_messages="";
               $scope.currentUserId=$localStorage.id;
               $scope.rec_name=user.name;
               $scope.propic=user.profilepic;
               $scope.usrstate=user.status;
          }
        });
        makeread(s_id,user.id);
        $("#chatbox").scrollTop($('#chatbox')[0].scrollHeight);
      }
    }
    function makeread(id,other){
      $http({
        method:'POST',
        url:'/users/MakeRead',
        data:{'id':id,'other':other}
      }).success(function(data){
          if(data.status=="200")
          {

          }
      });
    }
    $scope.statuschange=function(){
      var state=$scope.switch_status;
      // console.log($scope.switch_status);
      $http({
          method:'POST',
          url:'/users/statusChange',
          data:{'s_id':s_id,'state':state}
      }).success(function(data){
            console.log(data.state);
            if(data.state==1)
            {
              $scope.userstatus="online";
            }
            else
            {
              $scope.userstatus="offline";
            }
      });
    }
//update_profile
$scope.updateprofile=function(id)
{
  $http({
          method:'POST',
          url:'/users/updateProfile',
          data:{'id':id}
      }).success(function(data)
      {
          if(data.status==true)
          {

          }
        });
}

    // //to Append the response in the chatbox
    $scope.append_msg=function(name,message){
      angular.element(document.querySelector( '#temp' ) ).append('<div class="msg_from pull-right" id="append"><div class="toname"><b>'+name+'</b></div>'+message+'</div>');

      $("#chatbox").scrollTop($('#chatbox')[0].scrollHeight);
    }



    //To save the message in the db
    $scope.saveMessage=function(sender_id,receiver_id,message)
    {
      $http({
                    method:'POST',
                    url:'/users/SaveMessage',
                    data:{'message':message,'s_id':sender_id,'r_id':receiver_id}
                }).success(function(data)
                {
                    if(data.status==true)
                    {

                    }
                  });
    }
    function listusers(s_id){
         $http({
                    method:'POST',
                    url:'/users/ListUsers',
                    data:{'s_id':s_id}
                }).success(function(data)
                {
                    if(data.status=="200")
                    {
                      $scope.userslist=data.users;
                    }
                  });
    }
$scope.clearall=function(){
  $http({
                    method:'POST',
                    url:'/users/ClearallMessage',
                    data:{'s_id':s_id,'r_id':r_id}
                }).success(function(data)
                {
                    if(data.status=="200")
                    {
                      $route.reload();
                    }
                  });
}
function unread_count(s_id)
{
  $http({
          method:'POST',
          url:'/users/UnreadCount',
          data:{'s_id':s_id}
                }).success(function(data)
                {
                    if(data.status=="200")
                    {
                        $scope.unreadlist=data.users.unread_messages;
                    }
                  });
}
function setstatus(state)
{
  $http({
          method:'POST',
          url:'/users/statusChange',
          data:{'s_id':s_id,'state':state}
      }).success(function(data){
            
});
}
$scope.viewprofile = function(ev,usr_id) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $http({
           method:'POST',
          url:'/users/getuserprofile',
          data:{'id':usr_id}
    }).success(function(data){
        if(data.status=="200")
        {
          $scope.userinfo=data.user;
        }
    });
     $mdDialog.show({
      controller: UsersController,
      contentElement: '#viewprofile',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    });
  };
  function msg_notification(id)
  {
    $http({
           method:'POST',
          url:'/users/Incomingunreadcount',
          data:{'id':id}
    }).success(function(data){
        if(data.status=="200")
        {
          //data.messages
          if(data.message_count==0)
          {
            $localStorage.msg_count=0;
          }
          else if($localStorage.msg_count<data.message_count)
          {
              for(var i in data.messages){
           //      $notification(data.messages[i].sender_name, {
           //       body: data.messages[i].message,
           //       dir: 'auto',
           //       icon: 'boy.png'
           // });
                var notify = {
                    type: 'success',
                    title: data.messages[i].sender_name,
                    content: data.messages[i].message
                };
                $scope.$emit('notify', notify);
              }
              $localStorage.msg_count=data.message_count;
        } 
        }
    });
  }
    //Log out
    $scope.logout=function(){
       $window.localStorage.clear();
       var offline="offline";
       setstatus(offline);
      $location.path('/');
    };
  }
    //   var timer = 0;

    // function reduceTimer() {
    //     timer = timer - 1;
    //     isTyping(true);
    // }

    // function isTyping(val) {
    //     if (val == 'true') {
    //         document.getElementById('typing_on').innerHTML = "User is typing...";
    //     } else {

    //         if (timer <= 0) {
    //             document.getElementById('typing_on').innerHTML = "No one is typing -blank space.";
    //         } else {
    //             setTimeout("reduceTimer();", 500);
    //         }
    //     }
    // }
})();
