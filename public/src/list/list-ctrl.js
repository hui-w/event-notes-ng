app.controller('listController', ['$scope', '$rootScope', 'eventService', '$routeParams', function($scope, $rootScope, eventService, $routeParams) {
    $rootScope.refreshHandler = function() {
        $scope.bindList();
    };
    $rootScope.backPath = "/list";

    var today = new Date();
    $scope.selectedYear = today.getFullYear();
    if ($routeParams.year) {
        $scope.selectedYear = $routeParams.year;
        $rootScope.backPath += "/" + $routeParams.year;
    }

    $scope.hierarchyData = [];
    $scope.yearList = [];

    $scope.getWeekday = function(year, month, date) {
        var todayDate = new Date(year, month - 1, date);
        if (todayDate.getDay() == 5) return ("FRI");
        if (todayDate.getDay() == 6) return ("SAT");
        if (todayDate.getDay() == 0) return ("SUN");
        if (todayDate.getDay() == 1) return ("MON");
        if (todayDate.getDay() == 2) return ("TUE");
        if (todayDate.getDay() == 3) return ("WED");
        if (todayDate.getDay() == 4) return ("THU");
    };

    $scope.changeYear = function(year) {
        location.href = "#/list/" + year;
    };

    $scope.bindList = function() {
        //bind the list
        var payload = eventService.getCachedYear($scope.selectedYear);
        if (payload == null) {
            console.log("List loaded from server");
            //load from server
            eventService.getEvents($scope.selectedYear)
                .success(function(response) {
                    $scope.hierarchyData = eventListToHierarchy(response.payload.events);
                    $scope.yearList = response.payload.years;

                    //save to the cache
                    eventService.updateCachedYear($scope.selectedYear, response.payload);
                })
                .error(function(error) {
                    //error
                    window.alert("eventService Error");
                    console.log(error);
                });
        } else {
            console.log("List loaded from cache");
            //load from cache
            $scope.hierarchyData = eventListToHierarchy(payload.events);
            $scope.yearList = payload.years;
        }
    };

    $scope.bindList();

    /*
    //<script src="./src/dummy.js"></script>
        $scope.importDummy = function() {
            for (var i = 0; i < dummy.events.length; i++) {
                var year = dummy.events[i][0];
                var month = dummy.events[i][1];
                var date = dummy.events[i][2];
                var flag = dummy.events[i][3];
                var text = dummy.events[i][4];
                if (dummy.events[i][5].length > 0) {
                    text += " ---- " + dummy.events[i][5];
                }

                var payload = {
                    id: "",
                    year: year,
                    month: month,
                    date: date,
                    text: text,
                    number: 0,
                    flag: flag,
                    tag: "Imported",
                    recurrence: 0
                };

                eventService.saveEvent(null, payload)
                    .success(function(response) {
                        console.log(response);
                    })
                    .error(function(error) {
                        console.log(error);
                    });
            }
            console.log("All Imported");
        };

        $scope.clear = function() {
            eventService.getEvents(null)
                .success(function(response) {
                    for (var i = 0; i < response.payload.events.length; i++) {
                        var event = response.payload.events[i];


                        eventService.deleteEvent(event.id)
                            .success(function(response) {
                                console.log(response + " deleted");
                            })
                            .error(function(error) {
                                console.log(error);
                            });
                    }
                })
                .error(function(error) {
                    console.log(error);
                });
            console.log("Clear");
        };
        */

    /*
    eventService.getList().then(function(res) {
        $scope.data = res.data.payload;
    }, function(res) {
        console.log(res);
    });
    */
}]);
