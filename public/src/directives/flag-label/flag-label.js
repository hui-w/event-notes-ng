(function() {
    "use strict";
    app.directive('flagLabel', [function() {
        var template = '<div class="flag-label" ng-style="getStyle(flagIndex)"></div>';
        return {
            restrict: 'AE',
            scope: {
                flagIndex: '='
            },
            template: template,
            link: function(scope, element, attrs) {
                scope.getStyle = function(flagIndex) {
                    return { "background-color": Config.FlagColors[flagIndex] }
                };
            }
        };
    }]);
})();
