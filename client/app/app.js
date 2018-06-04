
const databaseService = function($http, $q) {
    return({
        getFromDatabase: getFromDatabase,
        postToDatabase: postToDatabase,
        guidHandler: guidHandler
    });

    
    function getFromDatabase(url) {
        const request = $http({
            method: 'get',
            url: url
        });

        return (request.then(_handleSuccess, _handleError));
    }

 
    function postToDatabase(url, data) {
        const request = $http({
            method: 'post',
            url: url,
            data: data
        })  ;

        return (request.then(_handleSuccess, _handleError));
    }


    function guidHandler(action) {
        switch (action) {
        case 'create':
            return _createGuid();
        case 'load':
            return localStorage.getItem('ecommerceDemo');
        case 'save':
            if (localStorage.getItem('ecommerceDemo') === null) {
                localStorage.setItem('ecommerceDemo', _createGuid() );
            }
        }
    }

   
    function _s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    function _createGuid() {
        return (_s4() + _s4() + '-' + _s4() + '-' + _s4() + '-' +
      _s4() + '-' + _s4() + _s4() + _s4()).toString();
    }

    function _handleError( response ) {
    
        if (!angular.isObject( response.data ) || !response.data.message ) {
            return( $q.reject( 'An unknown error occurred.' ) );
        }
      
        return( $q.reject( response.data.message ) );
    }

    function _handleSuccess( response ) {
        return( response.data );
    }
};

angular.module('myApp', ['ui.router', 'ngCookies'])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider
            .otherwise('/');

        $locationProvider.html5Mode(true);

    })
    .service('databaseService', databaseService);


 
