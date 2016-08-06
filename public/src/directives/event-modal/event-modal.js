app.directive('eventModal', ['eventService', '$rootScope', '$location', function(eventService, $rootScope, $location) {
    return {
        restrict: 'E',
        scope: {
            item: '=',
            //onDeleted: '&onDeleted'
        },
        templateUrl: './src/directives/event-modal/event-modal.html',
        link: function(scope, element, attrs) {
            //var onDeleted = function(id) {
            //    if (scope.onDeleted) {
            //        scope.onDeleted({
            //            id: id
            //        });
            //    }
            //};
            scope.editEvent = function(id) {
                $rootScope.selectedItem = null;
                $location.path("/edit/" + id);
            };
            scope.deleteEvent = function(id, $event) {
                //if (window.confirm("Sure to delete?")) {
                $rootScope.selectedItem = null; //hide the modal
                eventService.deleteEvent(id)
                    .success(function(response) {
                        if ($rootScope.refreshHandler != null) {
                            $rootScope.refreshHandler();
                        }
                        //onDeleted({ id: id });
                    })
                    .error(function(error) {
                        //error
                        window.alert("eventService Error");
                        console.log(error);
                    });
                //}
                //$event.stopPropagation();
            };
            scope.close = function() {
                $rootScope.selectedItem = null;
            }
        }
    };
}]);
