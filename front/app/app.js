(function() {
    'use strict';
     app.

            controller("headerFunction", ['$scope', '$localStorage', '$http', '$location', function ($scope, $localStorage, $http, $location)
    {

        $scope.template = {

        "headerview": "../front/views/layout/header.html",
        }

        $scope.$on('checkheader', function (event) {
        $scope.init();
        });
    }]);



   app
            .config(config)

    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider
                .when('/', {
                controller:'LoginController',
            templateUrl:'../front/views/login.html',
 controllerAs: 'vm'  
        })
                .when('/chatpage', {
                controller:'UsersController',
            templateUrl:'../front/views/main.html'  
        })
                .when('/register', {
                controller:'RegistrationController',
            templateUrl:'../front/views/register.html'  
        })
       .otherwise({redirectTo: '/'});

}
app.

            controller("footerFunction", ['$scope', '$localStorage', '$http', '$location', function ($scope, $localStorage, $http, $location)
    {

        $scope.template = {

        "footerview": "../front/views/layout/footer.html",
        }

        $scope.$on('checkheader', function (event) {
        $scope.init();
        });
    }]);
})();
