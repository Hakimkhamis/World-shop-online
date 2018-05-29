const orderController = function($scope, databaseService, $location) {
    $scope.orders = [];
    $scope.status = "open";
    function loadOrders() {
        $scope.orders = [];
        databaseService.getFromDatabase('/api/getorder')
            .then((orders) => {
                $scope.orders = orders;
                console.log($scope.orders);
            });
    }
    $scope.updateStatus = function(orderId){
        databaseService.getFromDatabase('/api/order/'+orderId)
            .then((orders) => {
                loadOrders();
            });
    }
    loadOrders();
};

angular.module('myApp')
    .component('myAdminOrder', {
        controller: orderController,
        templateUrl: 'app/components/order/order.html'
    })
    .config(function($stateProvider) {
        $stateProvider
            .state('order', {
                url: '/admin/order',
                component: 'myAdminOrder'
            });
    });
