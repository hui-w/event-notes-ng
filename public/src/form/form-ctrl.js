app.controller('formController', ['$scope', '$rootScope', 'eventService', '$routeParams', function($scope, $rootScope, eventService, $routeParams) {
    $scope.event = null;
    $scope.operationTitle = null;
    $scope.dpDate = new Date();

    $scope.dpOptions = {
        formats: ['yyyy-MM-dd', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'],
        options: {
            formatYear: 'yy',
            startingDay: 1
        },
        opened: false,
        disabled: function(date, mode) {
            return false;
            //return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        },
        open: function($event) {
            $scope.dpOptions.opened = true;
        }
    };

    $scope.historyBack = function() {
        $rootScope.goBack();
    }

    $scope.saveEvent = function(isValid) {
        if (!isValid) {
            return false;
        }

        //send to server
        var payload = {
            id: $scope.event.id,
            year: $scope.event.year,
            month: $scope.event.month,
            date: $scope.event.date,
            text: $scope.event.text,
            number: $scope.event.number,
            flag: $scope.event.flag,
            tag: $scope.event.tag,
            recurrence: $scope.event.recurrence
        };
        eventService.saveEvent($routeParams.id, payload)
            .success(function(response) {
                //redirect to home
                $rootScope.goBack();
            })
            .error(function(error) {
                //error
                window.alert("eventService Error");
                console.log(error);
            });
    };

    $scope.tagSelected = function(tag) {
        $scope.event.tag = tag;
    };

    $scope.setToday = function() {
        var today = new Date();
        $scope.event.year = today.getFullYear();
        $scope.event.month = today.getMonth() + 1;
        $scope.event.date = today.getDate();
    };

    $scope.resetForm = function() {
        if ($routeParams.id) {
            //edit form
            var event = eventService.getCachedEvent($routeParams.id);
            if (event == null) {
                //load from server
                eventService.getEvent($routeParams.id)
                    .success(function(response) {
                        $scope.dpDate.setFullYear(response.year, response.month - 1, response.date);
                        $scope.event = response;
                    })
                    .error(function(error) {
                        //error
                        window.alert("eventService Error");
                        console.log(error);
                    });
                console.log("Form data loaded from server");
            } else {
                //load from cache
                $scope.dpDate.setFullYear(event.year, event.month - 1, event.date);
                $scope.event = angular.copy(event);
                console.log("Form data loaded from cache");
            }
            
            $scope.operationTitle = "Update";
        } else {
            //add form
            var today = new Date();
            $scope.event = {
                id: "",
                year: today.getFullYear(),
                month: today.getMonth() + 1,
                date: today.getDate(),
                text: "",
                number: 0,
                flag: 0,
                tag: "default",
                recurrence: 0
                    //timestamp: today.valueOf()
            }

            $scope.dpDate = new Date();
            $scope.operationTitle = "Add";
        }
    };

    $scope.resetForm();

    $scope.$watch('dpDate', function(newVal, oldVal) {
        if (newVal && $scope.event) {
            $scope.event.year = $scope.dpDate.getFullYear();
            $scope.event.month = $scope.dpDate.getMonth() + 1;
            $scope.event.date = $scope.dpDate.getDate();
        }
    });
}]);
