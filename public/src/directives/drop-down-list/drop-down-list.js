(function() {
    "use strict";
    app.directive('dropDownList', [function() {
        return {
            restrict: 'AE',
            scope: {
                options: '=',
                selectedIndex: '='
            },
            templateUrl: './src/directives/drop-down-list/drop-down-list.html',
        };
    }]);
})();