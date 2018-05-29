const loginController = function($scope, databaseService, $location) {
 
};

angular.module('myApp')
    .component('myAdminLogin', {
        controller: loginController,
        templateUrl: 'app/components/login/login.html'
    })
    .config(function($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/admin/login',
                component: 'myAdminLogin'
            });
    });
