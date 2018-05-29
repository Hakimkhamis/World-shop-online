const productController = function($scope, databaseService, $location) {
   
};

angular.module('myApp')
    .component('myAdminProduct', {
        controller: productController,
        templateUrl: 'app/components/product/product.html'
    })
    .config(function($stateProvider) {
        $stateProvider
            .state('product', {
                url: '/admin/product',
                component: 'myAdminProduct'
            });
    });
