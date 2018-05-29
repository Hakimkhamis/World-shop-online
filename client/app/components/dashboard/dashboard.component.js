const dashboardController = function($scope, databaseService, $location) {
    $scope.orders = [];
    $scope.pendingorder = 0;
    $scope.totalearning = 0;
    function loadOrders() {
        $scope.orders = [];
        databaseService.getFromDatabase('/api/getorder')
            .then((orders) => {
                $scope.orders = orders;
                angular.forEach($scope.orders, function(item){
                    $scope.totalearning = $scope.totalearning + item.price;
                    if(item.status == 'open'){
                        $scope.pendingorder = $scope.pendingorder + 1;
                    }
                })
            });
    }

    loadOrders();
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
