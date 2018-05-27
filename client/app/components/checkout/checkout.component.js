const checkoutController = function($scope, databaseService, $location) {
    const params = $location.search();
    $scope.currentCategory = params.category || 'Checkout';

};

angular.module('myApp')
    .component('myCheckout', {
        controller: checkoutController,
        templateUrl: 'app/components/checkout/checkout.html'
    })
    .config(function($stateProvider) {
        $stateProvider
            .state('checkout', {
                url: '/checkout',
                component: 'myCheckout'
            });
    });
