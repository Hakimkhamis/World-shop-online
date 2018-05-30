const productController = function($scope, databaseService, $location,$cookies) {
    if($cookies.get("loginStatus") != undefined){
        
    }else{
        $location.path('/admin/login');
    }
    $scope.categories = [];
    $scope.items = [];
    $scope.currentPage = 0;
    $scope.currentCategory = 'All';
    $scope.itemsPerPage = 5;
    $scope.numItems = 0;
    $scope.numPages = 1;

    function loadCategories() {
        databaseService.getFromDatabase('/api/categories')
            .then((categories) => {
                $scope.categories = categories;
            });
    }

    function loadItems() {
        databaseService.getFromDatabase(`/api/getitems?category=${$scope.currentCategory}&&page=${$scope.currentPage}&&limit=${$scope.itemsPerPage}`)
            .then((items) => {
                $scope.items = items;
            });
    }

    function loadNumItems() {
        databaseService.getFromDatabase(`/api/getnumitems?currentCategory=${$scope.currentCategory}`)
            .then((numItems) => {
                $scope.numItems = numItems.count;
                $scope.numPages = Math.ceil(Number($scope.numItems / $scope.itemsPerPage));
            });
    }

    $scope.getPage = (n) => {
        $scope.currentPage = n - 1;
        loadItems();
    };

    $scope.range = function() {
        const arr = [];
        for (let i = 1; i <= $scope.numPages; i++) {
            arr.push(i);
        }
        return arr;
    };

    $scope.changeCategory = function(newCategory) {
        $scope.currentCategory = newCategory;
        loadItems();
        loadNumItems();
    };
    $scope.selectedProduct = {};
    $scope.viewProduct = function(item){
        $scope.selectedProduct = item;
        console.log(item);
        $("#myModal").modal()
    }

    loadCategories();
    loadItems();
    loadNumItems();
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
