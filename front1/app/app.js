// (function() {
  'use strict';
// alert('sdaf')
   app
            .config(config)
            // .run(run);
    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider
                .when('/', {
                controller:'usersController',
            templateUrl:'../views/main.html'  
        })
                .when('/register', {
                controller:'usersController',
            templateUrl:'../views/main.html'  
        })

}
// })();
