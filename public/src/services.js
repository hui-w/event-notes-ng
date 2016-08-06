app.factory('eventService', ['$http', '$filter', function($http, $filter) {
    var cachedPayload = new HashTable();
    return {
        getCachedYear: function(year) {
            return cachedPayload.getValue(year);
        },

        updateCachedYear: function(year, value) {
            if (cachedPayload.containsKey(year)) {
                cachedPayload[year] = value;
            } else {
                cachedPayload.add(year, value);
            }
        },

        getCachedEvent: function(id) {
            //var idFilter = $filter("filterById");
            var payloads = cachedPayload.getValues();
            for (var i = 0; i < payloads.length; i++) {
                var eventArray = payloads[i].events;
                for (var j = 0; j < eventArray.length; j++) {
                    if (eventArray[j].id == id) {
                        return eventArray[j];
                    }
                }
            }
            return null;
        },

        getEvents: function(year) {
            var path = Config.ApiUrl + '/events';
            if (year != null) {
                path += '/years/' + year;
            }
            return $http.get(path);
        },

        getTags: function() {
            var path = Config.ApiUrl + '/events/tags';
            return $http.get(path);
        },

        getEvent: function(id) {
            var path = Config.ApiUrl + '/events/' + id;
            return $http.get(path);
        },

        saveEvent: function(id, payload) {
            var path = Config.ApiUrl + '/events';

            //clear the cached events for getting new list
            cachedPayload = new HashTable();

            //add or edit
            if (id == null) {
                return $http.post(path, payload);
            } else {
                path += "/" + id;
                return $http.put(path, payload);
            }
        },

        deleteEvent: function(id) {
            var path = Config.ApiUrl + '/events/' + id;

            //clear the cached events for getting new list
            cachedPayload = new HashTable();

            return $http.delete(path);
        }
    }
}]);

/*
app.factory('listService', ['$http', function($http) {
    return $http.get(Config.ApiUrl + '&action=list')
        .success(function(data) {
            return data;
        })
        .error(function(err) {
            return err;
        });
}]);

*/
