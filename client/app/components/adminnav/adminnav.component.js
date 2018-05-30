const adminnavController = function($scope, databaseService, $location,$cookies) {
    $scope.logout = function(){
        $cookies.remove("loginStatus");
        $location.path('/admin/login');
    }
}
angular.module('myApp')
    .component('myAdminNavigation', {
        controller: adminnavController,
        templateUrl: 'app/components/adminnav/adminnav.html'
    });
