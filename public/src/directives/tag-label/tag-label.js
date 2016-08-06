(function() {
    "use strict";
    app.directive('tagLabel', [function() {
        var template = '<span ng-if="tag.length > 0"> | <span class=key>Tag:</span> <span class=value>{{tag}}</span></span>';
        return {
            restrict: 'AE',
            scope: {
                tag: '='
            },
            template: template
        };
    }]);
})();