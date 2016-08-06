app.directive('flagRadio', [function() {
    return {
        restrict: 'A',
        scope: {
            flagIndex: '='
        },
        templateUrl: './src/directives/flag-radio/flag-radio.html',
        link: function(scope, element, attrs) {
            scope.colors = Config.FlagColors;
            scope.setFlag = function(index) {
                scope.flagIndex = index;
            };
            scope.getStyle = function(index, color) {
                //console.log("getStyle-"+index)
                return { "background-color": color }
            };
        }
    }
}])
