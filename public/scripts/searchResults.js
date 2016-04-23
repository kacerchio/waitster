var merch = JSON.parse(window.sessionStorage.getItem("merchants"));
//console.log(merch);

var userAddress = window.sessionStorage.getItem("userAddress");
//console.log(userAddress);

var waitTime;

var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

// Open the database (on first call, it will create the database)
var request = indexedDB.open("RestaurantDB", 3);

// Create the schema
request.onupgradeneeded = function(e) {
    var db = e.target.result;
    var store = db.createObjectStore("rests", {keyPath: "id"});
    store.createIndex("by_name", "name");
    store.createIndex("by_location", "location");
    store.createIndex("by_phone", "phone");
    store.createIndex("by_logoURL", "logoURL");
    store.createIndex("by_headerURL", "headerURL");
    store.createIndex("by_waitTime", "waitTime");
    store.createIndex("by_rating", "rating");
    store.createIndex("by_priceRating", "priceRating");
    store.createIndex("by_isOpen", "isOpen");
    store.createIndex("by_hours", "hours", {multientry: true});
    store.createIndex("by_cuisines", "cuisines", {multientry: true});
    store.createIndex("by_weekly_waitTime", "weeklyWaitTime", {multientry: true});
};

request.onsuccess = function(e) {

    var numResults = merch.length;
    document.getElementById("num-results").innerText = numResults + " results found";

    for (var j = 0; j < merch.length; j++) {

        var street = merch[j]["location"]["street"];
        var state = merch[j]["location"]["state"];
        var city = merch[j]["location"]["city"];
        var zip = merch[j]["location"]["zip"];
        var location = street + "\n" + city + ", " + state + " " + zip;

        var deliveryTime = merch[j]["ordering"]["availability"]["delivery_estimate"];
        waitTime = calcWaitTime(location, deliveryTime);

        var rest = {
            "id": merch[j]["id"],
            "name": merch[j]["summary"]["name"],
            "location": location,
            "phone": merch[j]["summary"]["phone"],
            "logoURL": merch[j]["summary"]["merchant_logo"],
            "headerURL": merch[j]["summary"]["header_images"][0]["path"],
            "waitTime": waitTime,
            "rating": merch[j]["summary"]["star_ratings"],
            "priceRating": merch[j]["summary"]["price_rating"],
            "isOpen": merch[j]["ordering"]["is_open"],
            "hours": merch[j]["hours"],
            "cuisine": merch[j]["summary"]["cuisines"]
        };

        var db = e.target.result;
        var tx = db.transaction(["rests"], "readwrite");

        tx.oncomplete = function(e) {
            console.log("Transaction completed: database modification finished.")
        };

        tx.onerror = function(e) {
            console.log("Transaction not opened due to error: Duplicate items not allowed.");
        };

        var store = tx.objectStore("rests");
        var put = store.put(rest);

        put.onsuccess = function(e) {
            console.log("Success adding item!");
        };

        put.onerror = function(e) {
            console.error("Error adding item: ", e);
        };

        var content = document.getElementById("search-results-content");
        var template = document.getElementById("restaurant-card-template").content.cloneNode(true);

        var name = rest.name;
        template.querySelector("#restaurant-name").innerText = name;
        template.querySelector("#restLink").href = "restaurant.html" + "?id=" + rest.id;


        var rating = rest.rating;
        template.querySelector("#star-rating").innerText = "Star Rating: " + rating;

        var priceRating = rest.priceRating;
        while (priceRating != 0) {
            template.querySelector("#price-rating").innerText += "$";
            priceRating -= 1;
        }
        template.querySelector("#price-rating").innerText += " | ";

        var isOpen = rest.isOpen;
        if (isOpen == true) {
            template.querySelector("#is-open").innerText += "OPEN NOW";
            template.querySelector("#is-open").style.color = "#27ae60";
        }
        else {
            template.querySelector("#is-open").innerText = "CLOSED";
            template.querySelector("#is-open").style.color = "#c0392b";
        }

        var addr = rest.location;
        addr = toTitleCase(addr);
        template.querySelector("#location").innerText = addr;

        var phoneNumber = rest.phone;
        template.querySelector("#phone-number").innerText = "Tel: " + phoneNumber;

        var logoURL = rest.logoURL;
        template.querySelector("#merch-logo").src = logoURL;

        var waitTime = rest.waitTime;
        template.querySelector("#wait-time").innerText = waitTime + " mins";

        content.appendChild(template);
    }

};

request.onerror = function() {
    console.log(request.error);
};

var driveTime;

function calcWaitTime(location, deliveryTime) {
    //console.log(time);
    var googleAPIlink1 = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=';
    var googleAPIlink2 = '&destinations=';
    var googleAPIkey = '&key=AIzaSyCnbPRMgv_MDYaPqiq2mVYIpWUy-m_k3Jc';
    var distanceQuery = googleAPIlink1 + userAddress + googleAPIlwink2 + location + googleAPIkey;
    $.ajax({
        async: false,
        url: distanceQuery,
        success: function(json) {
            driveTime = json.rows[0]["elements"][0]["duration"]["value"];
            driveTime = Math.floor(driveTime / 60);
        }
    });
    if (deliveryTime - driveTime - 15 > 0) {
        return deliveryTime - driveTime - 15;
    } else {
        return 0;
    }
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

