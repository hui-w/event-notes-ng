function timestamp2String(time) {
    var datetime = new Date();
    datetime.setTime(time);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1;
    var date = datetime.getDate();
    var hour = datetime.getHours();
    var minute = datetime.getMinutes();
    var second = datetime.getSeconds();
    //var mseconds = datetime.getMilliseconds();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second /* + "." + mseconds*/ ;
};

function $() {
    var elements = new Array();
    for (var i = 0; i < arguments.length; i++) {
        var element = arguments[i];
        if (typeof element == 'string')
            element = document.getElementById(element);
        if (arguments.length == 1)
            return element;
        elements.push(element);
    }
    return elements;
}

Element.prototype.hasClassName = function(a) {
    return new RegExp("(?:^|\\s+)" + a + "(?:\\s+|$)").test(this.className);
}

Element.prototype.addClassName = function(a) {
    if (!this.hasClassName(a)) {
        this.className = [this.className, a].join(" ");
    }
}

Element.prototype.removeClassName = function(b) {
    if (this.hasClassName(b)) {
        var a = this.className;
        this.className = a.replace(new RegExp("(?:^|\\s+)" + b + "(?:\\s+|$)", "g"), " ");
    }
}

/* prepare a monthly hierarchy from an event array */
function eventListToHierarchy(eventArray) {
    //create the hierarchy structure on the client
    var monthlyArray = [];
    var currentYear = null;
    var currentMonth = null;
    var currentDate = null;
    for (var i = 0; i < eventArray.length; i++) {
        var event = eventArray[i];

        //new month
        if (currentYear != event.year || currentMonth != event.month) {
            monthlyArray.push({ "year": event.year, "month": event.month, "dates": [] });
        }

        //new date
        if (currentYear != event.year || currentMonth != event.month || currentDate != event.date) {
            monthlyArray[monthlyArray.length - 1].dates.push({ "date": event.date, "events": [] });
        }

        //event
        var dateArrayLength = monthlyArray[monthlyArray.length - 1].dates.length;
        monthlyArray[monthlyArray.length - 1].dates[dateArrayLength - 1].events.push({
            "id": event.id,
            "text": event.text,
            "number": event.number,
            "flag": event.flag,
            "recurrence": event.recurrence,
            "tag": event.tag,
            "timestamp": event.timestamp
        });

        //save current date
        currentYear = event.year;
        currentMonth = event.month;
        currentDate = event.date;
    }

    return monthlyArray;
};
