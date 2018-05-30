const productController = function($scope, databaseService, $location,$cookies, $http) {
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
    $scope.productdata = {
        "title" : "", 
        "slogan" : "", 
        "description" : "", 
        "stars" : 0, 
        "category" : "", 
        "img_url" : "/app/assets/images/products/", 
        "price" : 0
    }
    $scope.numPages = 1;
    $scope.addProduct = function(){
        $scope.productdata = {
            "title" : "", 
            "slogan" : "", 
            "description" : "", 
            "stars" : 0, 
            "category" : "", 
            "img_url" : "/app/assets/images/products/", 
            "price" : 0
        }
        $("#addmyModal").modal();
    }
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
    $scope.uploadFile = function(){
        var file = $scope.myFile;
        var fileFormData = new FormData();
        fileFormData.append('uploads', file);

        
        $http.post('/api/upload', fileFormData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(function(response) {
            console.log(response.data[0].filename)
            $scope.productdata.img_url = $scope.productdata.img_url+response.data[0].filename;
            databaseService.postToDatabase(`/api/addproduct`,  $scope.productdata)
            .then(() => {
                $scope.productdata = {
                    "title" : "", 
                    "slogan" : "", 
                    "description" : "", 
                    "stars" : 0, 
                    "category" : "", 
                    "img_url" : "/app/assets/images/products/", 
                    "price" : 0
                }
                $("#addmyModal").modal('hide');
                loadCategories();
                loadItems();
                loadNumItems();
            })
            .catch(() => {
                
            });
        })
        
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
    }).directive('fileModel', ['$parse', function ($parse) {
        return {
           restrict: 'A',
           link: function(scope, element, attrs) {
              var model = $parse(attrs.fileModel);
              var modelSetter = model.assign;
              
              element.bind('change', function(){
                 scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                 });
              });
           }
        };
     }]);
