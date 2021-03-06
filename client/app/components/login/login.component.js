const loginController = function($scope, databaseService, $location, $cookies) {
    $scope.logindata = {
        username:"",
        password:""
    }

    $scope.loginSubmit = function(){
        if($scope.logindata.username == 'admin' && $scope.logindata.password == 'admin'){
            $cookies.put("loginStatus",true);
            $location.path('/admin/dashboard');
        }else{
            alert("Username and password is invalid");
        }
    }
};

angular.module('myApp')
    .component('myAdminLogin', {
        controller: loginController,
        templateUrl: 'app/components/login/login.html'
    })
    .config(function($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/admin/login',
                component: 'myAdminLogin'
            });
    });
