(function() {
    "use strict";
    app.directive('recurrenceLabel', [function() {
        var template = '<span ng-if="recurrence != 0"> | <span class=key>Recurrence:</span> <span class=value>{{recurrenceType}}</span></span>';
        return {
            restrict: 'AE',
            scope: {
                recurrence: '='
            },
            template: template,
            link: function(scope, element, attrs) {
                scope.recurrenceType = Config.RecurrenceTypes[scope.recurrence];
            }
        };
    }]);
})();