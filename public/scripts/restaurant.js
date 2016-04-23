var restID = getParameterByName('id');

var request = indexedDB.open("RestaurantDB", 3);

request.onsuccess = function(e) {

    var db = e.target.result;
    var tx = db.transaction(["rests"], "readwrite");

    tx.oncomplete = function(e) {
        console.log("Transaction completed: database modification finished.")
    };

    tx.onerror = function(e) {
        console.log("Transaction not opened due to error: Duplicate items not allowed.");
    };

    var store = tx.objectStore("rests");
    var get = store.get(restID);

    get.onsuccess = function(e) {

        console.log("Success getting item!");

        document.getElementById("jumbo").style.backgroundImage = "url(" + get.result.headerURL + ")";

        document.getElementById("logo").src = get.result.logoURL;
        document.getElementById("restaurant-name").innerText = get.result.name;
        document.getElementById("star-rating").innerText = "Star Rating: " + get.result.rating;

        var priceRating = get.result.priceRating;
        while (priceRating != 0) {
            document.getElementById("price-rating").innerText += "$";
            priceRating -= 1;
        }
        document.getElementById("price-rating").innerText += " |";
        document.getElementById("price-rating").innerHTML += "&nbsp;";

        var cuisine = get.result.cuisine;
        var i;
        for (i = 0; i < cuisine.length; i++) {
            document.getElementById("cuisines").innerText += cuisine[i];
            if (i != (cuisine.length - 1)) {
                document.getElementById("cuisines").innerText += " ,";
                document.getElementById("cuisines").innerHTML += "&nbsp;";
            }
        }

        document.getElementById("wait-time").innerText = get.result.waitTime + " mins";

        var location = get.result.location;
        var combineLocation = location.replace(/(\r\n|\n|\r)/gm,", ");
        document.getElementById("location").innerText = combineLocation;

        document.getElementById("map").src = "http://maps.googleapis.com/maps/api/staticmap?center=" + location + "&zoom=14&scale=false&size=600x200&maptype=roadmap&key=AIzaSyCnbPRMgv_MDYaPqiq2mVYIpWUy-m_k3Jc&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xf12403%7Clabel:%7C" + location;
        document.getElementById("phone-number").innerText = "Tel: " + get.result.phone;

        console.log(get.result.hours);
        if (get.result.hours.monday.times_open.length == 0) {
            document.getElementById("mon-hrs").innerText = "CLOSED";
        } else {
            var monStart = toStdTime(get.result.hours.monday.times_open[0]["start"]);
            var monEnd = toStdTime(get.result.hours.monday.times_open[0]["end"]);
            document.getElementById("mon-hrs").innerText = monStart + " - " + monEnd;
        }

        if (get.result.hours.tuesday.times_open.length == 0) {
            document.getElementById("tues-hrs").innerText = "CLOSED";
        } else {
            var tuesStart = toStdTime(get.result.hours.tuesday.times_open[0]["start"]);
            var tuesEnd = toStdTime(get.result.hours.tuesday.times_open[0]["end"]);
            document.getElementById("tues-hrs").innerText = tuesStart + " - " + tuesEnd;
        }

        if (get.result.hours.wednesday.times_open.length == 0) {
            document.getElementById("wed-hrs").innerText = "CLOSED";
        } else {
            var wedStart = toStdTime(get.result.hours.wednesday.times_open[0]["start"]);
            var wedEnd = toStdTime(get.result.hours.wednesday.times_open[0]["end"]);
            document.getElementById("wed-hrs").innerText = wedStart + " - " + wedEnd;
        }

        if (get.result.hours.thursday.times_open.length == 0) {
            document.getElementById("thurs-hrs").innerText = "CLOSED";
        } else {
            var thursStart = toStdTime(get.result.hours.thursday.times_open[0]["start"]);
            var thursEnd = toStdTime(get.result.hours.thursday.times_open[0]["end"]);
            document.getElementById("thurs-hrs").innerText = thursStart + " - " + thursEnd;
        }

        if (get.result.hours.friday.times_open.length == 0) {
            document.getElementById("fri-hrs").innerText = "CLOSED";
        } else {
            var friStart = toStdTime(get.result.hours.friday.times_open[0]["start"]);
            var friEnd = toStdTime(get.result.hours.friday.times_open[0]["end"]);
            document.getElementById("fri-hrs").innerText = friStart + " - " + friEnd;
        }

        if (get.result.hours.saturday.times_open.length == 0) {
            document.getElementById("sat-hrs").innerText = "CLOSED";
        } else {
            var satStart = toStdTime(get.result.hours.saturday.times_open[0]["start"]);
            var satEnd = toStdTime(get.result.hours.saturday.times_open[0]["end"]);
            document.getElementById("sat-hrs").innerText = satStart + " - " + satEnd;
        }

        if (get.result.hours.sunday.times_open.length == 0) {
            document.getElementById("sun-hrs").innerText = "CLOSED";
        } else {
            var sunStart = toStdTime(get.result.hours.sunday.times_open[0]["start"]);
            var sunEnd = toStdTime(get.result.hours.sunday.times_open[0]["end"]);
            document.getElementById("sun-hrs").innerText = sunStart + " - " + sunEnd;
        }
    };

    get.onerror = function(e) {
        console.error("Error getting item: ", e);
    };
};

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function toStdTime(time) {
    var parts = time.split(':'),
        hour = parts[0],
        mins = parts[1];

    if (hour == 0) {
        var stdTime = 12 + ":" + mins;
        return stdTime + "am";
    }
    else if (hour > 12) {
        var stdTime = (hour - 12) + ':' + mins;
        return stdTime + "pm";
    }
    else {
        var stdTime = time;
        return stdTime + "am";
    }
}

var ctx = document.getElementById("bar-chart").getContext("2d");

var data = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
        {
            label: 'Weekly Average Wait Times',
            fillColor: '#95a5a6',
            highlightFill: '#7f8c8d',
            data: [20, 22, 12, 14, 32, 45, 35]
        }
    ]
};

var barChart = new Chart(ctx).Bar(data);

//var googleKey = "&key=AIzaSyCnbPRMgv_MDYaPqiq2mVYIpWUy-m_k3Jc";
//var googleAPI = "https://maps.googleapis.com/maps/api/staticmap?center=" + address + "&zoom=15&scale=false&size=600x300&maptype=roadmap" + googleKey + "&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xf12403%7Clabel:%7C" + address;

