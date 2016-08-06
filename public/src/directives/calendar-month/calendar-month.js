(function() {
    "use strict";
    app.directive('calendarMonth', ['$location', function($location) {
        return {
            restrict: 'AE',
            scope: {
                year: '=',
                month: '=',
                date: '=',
                events: '='
            },
            templateUrl: './src/directives/calendar-month/calendar-month.html',
            link: function(scope, element, attrs) {
                scope.data = {
                    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                    weeks: []
                };

                scope.gotoDate = function(date) {
                    if (date == scope.date) {
                        $location.path("/monthly/" + scope.year + "/" + scope.month);
                    } else {
                        $location.path("/monthly/" + scope.year + "/" + scope.month + "/" + date);
                    }
                };

                //get the days count of the month
                scope.getDaysCount = function(year, month) {
                    var totalDays = [31, -1, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    if (month != 2) {
                        return totalDays[month - 1];
                    } else {
                        if ((year % 100 != 0) && (year % 4 == 0) || (year % 400 == 0)) {
                            return 29;
                        } else {
                            return 28;
                        }
                    }
                };

                var render = function(year, month) {
                    var firstDate = new Date();
                    firstDate.setFullYear(year, month - 1, 1);
                    var currentDayOfWeek = firstDate.getDay();

                    //the first week
                    scope.data.weeks.push([]);

                    var days = [];

                    //padding start
                    for (var i = 0; i < currentDayOfWeek; i++) {
                        scope.data.weeks[scope.data.weeks.length - 1].push({
                            "number": 0,
                            "events": []
                        });
                    }

                    //current month
                    var dayCount = scope.getDaysCount(year, month);
                    for (var i = 0; i < dayCount; i++) {
                        scope.data.weeks[scope.data.weeks.length - 1].push({
                            "number": i + 1,
                            "events": []
                        });

                        //get next day of week
                        if (currentDayOfWeek == 6) {
                            currentDayOfWeek = 0;

                            //prepare for the next week
                            if (i + 1 < dayCount) {
                                scope.data.weeks.push([]);
                            }
                        } else {
                            currentDayOfWeek++;
                        }
                    }

                    //padding end
                    if (currentDayOfWeek != 0) {
                        for (var i = 0; i < 7 - currentDayOfWeek; i++) {
                            scope.data.weeks[scope.data.weeks.length - 1].push({
                                "number": 0,
                                "events": []
                            });
                        }
                    }
                };

                //render the calendar
                render(scope.year, scope.month);
                //scope.$watchGroup(['year', 'month'], function(newVal, oldVal) {
                //    if (newVal) {
                //        render(scope.year, scope.month);
                //    }
                //});

                //apply the events data when it's loaded
                scope.$watch('events', function(newVal, oldVal) {
                    if (newVal) {
                        //remove all
                        for (var i = 0; i < scope.data.weeks.length; i++) {
                            for (var j = 0; j < scope.data.weeks[i].length; j++) {
                                scope.data.weeks[i][j].events = [];
                            }
                        }

                        //get the day padding
                        var firstDate = new Date();
                        firstDate.setFullYear(scope.year, scope.month - 1, 1);
                        var dayPadding = firstDate.getDay();

                        //add the events to the scope data
                        for (var i = 0; i < newVal.length; i++) {
                            var event = newVal[i];
                            //if (event.year == scope.year && event.month == scope.month) {
                            var dateIndex = dayPadding + event.date - 1;
                            var weekIndex = Math.floor(dateIndex / 7);
                            var dayIndex = dateIndex % 7;
                            scope.data.weeks[weekIndex][dayIndex].events.push(event);
                            //}
                        }
                    }
                });
            },
            //end of link
        };
    }]);
})();
