const dashboardController = function($scope, databaseService, $location) {
   
};

angular.module('myApp')
    .component('myAdminDashboard', {
        controller: dashboardController,
        templateUrl: 'app/components/dashboard/dashboard.html'
    })
    .config(function($stateProvider) {
        $stateProvider
            .state('dashboard', {
                url: '/admin/dashboard',
                component: 'myAdminDashboard'
            });
    });
