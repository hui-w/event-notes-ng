var app = angular.module("eventsApp", ['ngRoute', 'ngResource', 'ui.bootstrap']);

app.config(["$routeProvider", "$httpProvider", function($routeProvider, $httpProvider) {
    $routeProvider
        .when('/', {
            controller: 'listController',
            templateUrl: './src/list/list.html'
        })
        .when('/list', {
            controller: 'listController',
            templateUrl: './src/list/list.html'
        })
        .when('/list/:year', {
            controller: 'listController',
            templateUrl: './src/list/list.html'
        })
        .when('/monthly', {
            controller: 'monthlyController',
            templateUrl: './src/monthly/monthly.html'
        })
        .when('/monthly/:year', {
            controller: 'monthlyController',
            templateUrl: './src/monthly/monthly.html'
        })
        .when('/monthly/:year/:month', {
            controller: 'monthlyController',
            templateUrl: './src/monthly/monthly.html'
        })
        .when('/monthly/:year/:month/:date', {
            controller: 'monthlyController',
            templateUrl: './src/monthly/monthly.html'
        })
        .when('/add', {
            controller: 'formController',
            templateUrl: './src/form/form.html'
        })
        .when('/edit/:id', {
            controller: 'formController',
            templateUrl: './src/form/form.html'
        })
        .when('/mortgage', {
            controller: 'mortgageController',
            templateUrl: './src/mortgage/mortgage.html'
        })
        .otherwise({
            redirectTo: '/'
        });

    $httpProvider.interceptors.push('scrim');
}]);

app.controller('baseCtrl', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {
    $rootScope.selectedItem = null; //{ year: 0, month: 0, date: 0, event: null };
    $rootScope.refreshHandler = null;
    $rootScope.backPath = null;
    $rootScope.goBack = function() {
        if ($rootScope.backPath != null) {
            $location.path($rootScope.backPath);
        } else {
            $location.path("/");
        }
    }
    $rootScope.requestCount = 0;
}]);

//loading
app.factory('scrim', ["$rootScope", function($rootScope) {
    var interceptor = {
        request: function(config) {
            $rootScope.requestCount++;
            //console.log("request," + $rootScope.requestCount);
            $rootScope.loading = true;
            return config;
        },
        response: function(response) {
            $rootScope.requestCount--;
            //console.log("response," + $rootScope.requestCount);
            if ($rootScope.requestCount <= 0) {
                $rootScope.loading = false;
            }
            return response;
        }
    };
    return interceptor;
}]);