(function() {
    "use strict";
    app.directive('dailyEvents', ['$rootScope', function($rootScope) {
        return {
            restrict: 'AE',
            scope: {
                year: '=',
                month: '=',
                date: '=',
                events: '='
            },
            templateUrl: './src/directives/daily-events/daily-events.html',
            link: function(scope, element, attrs) {
                scope.viewEvent = function(year, month, date, event) {
                    $rootScope.selectedItem = { year: year, month: month, date: date, event: event };
                }
            }
        };
    }]);
})();
