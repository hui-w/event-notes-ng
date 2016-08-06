app.directive('recurrenceRadio', [function() {
    return {
        restrict: 'A',
        scope: {
            recurrenceIndex: '='
        },
        templateUrl: './src/directives/recurrence-radio/recurrence-radio.html',
        link: function(scope, element, attrs) {
            scope.recurrenceTypes = Config.RecurrenceTypes;
            scope.setRecurrence = function(index) {
                scope.recurrenceIndex = index;
            }
        }
    }
}])