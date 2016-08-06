app.filter('datetime', function() {
    return function(value) {
        /*
        JavaScript uses milliseconds as a timestamp, whereas PHP uses seconds. 
        As a result, you get very different dates, as it is off by a factor 1000.
        */
        return timestamp2String(value * 1000);
    }
});

app.filter('month', function() {
    return function(value) {
        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[value - 1];
    }
});

app.filter('shortmonth', function() {
    return function(value) {
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        return monthNames[value - 1];
    }
});

app.filter('flagColor', function() {
    return function(value) {
        return Config.FlagColors[value];
    }
});

/* Filter item from a list by matching item id */
app.filter('filterById', [function(){
    return function(list, id){
        var ret = null;
        for(var i = 0; i < list.length; i++){
            var theOne = list[i];
            if(theOne.id == id){
                ret = theOne;
                break;
            }
        }
        return ret;
    };
}]);