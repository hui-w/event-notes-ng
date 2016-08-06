app.controller('monthlyController', ['$scope', '$rootScope', 'eventService', '$routeParams', '$location', function($scope, $rootScope, eventService, $routeParams, $location) {
    $rootScope.refreshHandler = function() {
        $scope.bindData();
    };
    $rootScope.backPath = "/monthly";

    var today = new Date();
    var currentYear = today.getFullYear();
    var currentMonth = today.getMonth() + 1;
    $scope.selectedYear = currentYear;
    $scope.selectedMonth = currentMonth;
    $scope.selectedDate = 0;

    //get parameter values
    if ($routeParams.year) {
        $scope.selectedYear = $routeParams.year;
    }
    if ($routeParams.month) {
        $scope.selectedMonth = $routeParams.month;
    }
    $rootScope.backPath += "/" + $scope.selectedYear + "/" + $scope.selectedMonth;
    if ($routeParams.date) {
        $scope.selectedDate = $routeParams.date;
        $rootScope.backPath += "/" + $scope.selectedDate;
    }

    //validate the month
    if ($scope.selectedMonth > 12) {
        $scope.selectedMonth = 12;
    }
    if ($scope.selectedMonth < 1) {
        $scope.selectedMonth = 1;
    }

    //validate the date
    if ($scope.selectedDate > 31 || $scope.selectedDate < 1) {
        $scope.selectedDate = 0;
    }

    //data for binding
    $scope.eventList = [];
    $scope.yearList = [];
    $scope.monthList = [];

    //for the year and month list
    $scope.expandedYear = -1;

    $scope.isThisMonth = function() {
        return currentYear == $scope.selectedYear && currentMonth == $scope.selectedMonth;
    };

    $scope.goToMonth = function(year, month) {
        if (year <= 0) {
            year = currentYear;
        }
        if (month <= 0) {
            month = currentMonth;
        }
        $location.path("/monthly/" + year + "/" + month);
    };

    $scope.expandYear = function(year) {
        $scope.expandedYear = $scope.expandedYear == year ? -1 : year;
    };

    $scope.changeMonth = function(monthCount) {
        var year = $scope.selectedYear;
        var month = $scope.selectedMonth;
        if (monthCount > 0) {
            //next month
            if (month == 12) {
                month = 1;
                year++;
            } else {
                month++;
            }
        } else {
            //previous month
            if (month == 1) {
                month = 12;
                year--;
            } else {
                month--;
            }
        }
        $location.path("/monthly/" + year + "/" + month);
    };

    //filter out the events of this month
    $scope.filterEvents = function(allEvents) {
        var events = [];
        for (var i = 0; i < allEvents.length; i++) {
            var event = allEvents[i];
            if (event.year == $scope.selectedYear && event.month == $scope.selectedMonth) {
                events.push(event);
            }
        }
        return events;
    };

    $scope.bindData = function() {
        //bind the list
        var payload = eventService.getCachedYear($scope.selectedYear);
        if (payload == null) {
            //load from server
            eventService.getEvents($scope.selectedYear)
                .success(function(response) {
                    //$scope.hierarchyData = eventListToHierarchy(response.payload.events);
                    $scope.eventList = $scope.filterEvents(response.payload.events);
                    $scope.yearList = response.payload.years;
                    $scope.monthList = response.payload.months;

                    //save to the cache
                    eventService.updateCachedYear($scope.selectedYear, response.payload);
                })
                .error(function(error) {
                    //error
                    window.alert("eventService Error");
                    console.log(error);
                });
        } else {
            //load from cache
            //$scope.hierarchyData = eventListToHierarchy(payload.events);
            $scope.eventList = $scope.filterEvents(payload.events);
            $scope.yearList = payload.years;
            $scope.monthList = payload.months;
        }
    };

    $scope.bindData();
}]);
