const orderController = function($scope, databaseService, $location, $cookies) {
    if($cookies.get("loginStatus") != undefined){
        loadOrders();
    }else{
        $location.path('/admin/login');
    }
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
                alert("Status changed successfully")
                loadOrders();
            });
    }
    $scope.total = 0;
    $scope.calculatePrice = function(){
        if($scope.selectedOrder.items.items != undefined){
            angular.forEach($scope.selectedOrder.items.items, function(item){
                var subtotal = item.price * item.quantity;
                $scope.total = $scope.total + subtotal;
            })
        }
        console.log($scope.total);
    }
    $scope.selectedOrder = {};
    $scope.viewOrder = function(item){
        $scope.selectedOrder = item;
        console.log(item);
        $scope.calculatePrice();
        $("#myModal").modal()
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
