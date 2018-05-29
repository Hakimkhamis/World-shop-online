const checkoutController = function($scope, databaseService, $location) {
    const params = $location.search();
    $scope.guid = databaseService.guidHandler('load');
    $scope.cart = [];
    $scope.currentCategory = params.category || 'Checkout';
    $scope.checkoutjson = {
        firstname:"",
        lastname:"",
        email:"",
        contact:"",
        address1:"",
        address2:"",
        city:"",
        state:"",
        country:"",
        zip:"",
        items:{},
        orderId:new Date().getTime(),
        price:$scope.total,
        cartId:""
    }
    $scope.submitCheckout = function(){
        if($scope.total != 0 || $scope.total != "0"){
            $scope.checkoutjson.price = $scope.total;
            $scope.checkoutjson.items = $scope.cart;
            databaseService.postToDatabase(`/api/addorder`,  $scope.checkoutjson)
            .then(() => {
                console.log("done")
                $scope.checkoutjson = {
                    firstname:"",
                    lastname:"",
                    email:"",
                    contact:"",
                    address1:"",
                    address2:"",
                    city:"",
                    state:"",
                    country:"",
                    zip:"",
                    items:{},
                    orderId:new Date().getTime(),
                    price:$scope.total,
                    cartId:""
                }
                getCartContents();
            })
            .catch(() => {
                
            });
        }
    }
    $scope.total = 0;
    $scope.calculatePrice = function(){
        if($scope.cart.items != undefined){
            angular.forEach($scope.cart.items, function(item){
                var subtotal = item.price * item.quantity;
                $scope.total = $scope.total + subtotal;
            })
        }
        console.log($scope.total);
    }

    function getCartContents() {
        databaseService.getFromDatabase(`/api/cart/${$scope.guid}`)
            .then((data) => {
                $scope.cart = data;
                $scope.calculatePrice();
            });
    }
    getCartContents();
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
