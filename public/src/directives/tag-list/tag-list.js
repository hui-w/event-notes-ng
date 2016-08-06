(function() {
    "use strict";
    app.directive('tagList', ['eventService', function(eventService) {
        return {
            restrict: 'AE',
            scope: {
                tagSelected: '&tagSelected'
            },
            templateUrl: './src/directives/tag-list/tag-list.html',
            link: function(scope, element, attrs) {
                var tagSelected = function(tag) {
                    if (scope.tagSelected) {
                        scope.tagSelected({ tag: tag });
                    }
                };
                eventService.getTags()
                    .success(function(response) {
                        scope.tags = response.payload.tags;
                    })
                    .error(function(error) {
                        //error
                        window.alert("eventService Error");
                        console.log(error);
                    });
                scope.selectTag = function(tag) {
                    tagSelected(tag);
                }
            }
        };
    }]);
})();
