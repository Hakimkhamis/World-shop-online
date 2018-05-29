const orderController = function($scope, databaseService, $location) {
   
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
