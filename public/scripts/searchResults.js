$(document).ready(
    onLoadHandler
);

var merch = JSON.parse(window.sessionStorage.getItem("merchants"));
//console.log(merch);

// This works on all devices/browsers, and uses IndexedDBShim as a final fallback
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

// Open (or create) the database
var request = indexedDB.open("RestaurantDB", 1);

// Create the schema
request.onupgradeneeded = function(e) {
    var db = e.target.result;
    var store = db.createObjectStore("restaurants", {keyPath: "id"});
    store.createIndex("name", "name", {unique : false});
    store.createIndex("location", "location", {unique : true});
    store.createIndex("phoneNumber", "phoneNumber", {unique : true});
    store.createIndex("logoURL", "logoURL", {unique : true});
    store.createIndex("waitTime", "waitTime", {unique: true});
    store.createIndex("rating", "rating", {unique : false});
    store.createIndex("priceRating", "priceRating", {unique : false});
    store.createIndex("isOpen", "isOpen", {unique : false});
    store.createIndex("hours", "hours", {unique : false, multiEntry: true});
};

request.onsuccess = function(e) {

    for (var j = 0; j < merch.length; j++) {
        var street = merch[j]["location"]["street"];
        var state = merch[j]["location"]["state"];
        var city = merch[j]["location"]["city"];
        var zip = merch[j]["location"]["zip"];
        var location = street + "\n" + city + ", " + state + " " + zip;

        //console.log(merch[j]);
        var rest = {
            "id": merch[j]["id"],
            "name": merch[j]["summary"]["name"],
            "location": location,
            "phoneNumber": merch[j]["summary"]["phone"],
            "logoURL": merch[j]["summary"]["merchant_logo"],
            "waitTime": merch[j]["ordering"]["availability"]["delivery_estimate"],
            "rating": merch[j]["summary"]["star_ratings"],
            "priceRating": merch[j]["summary"]["price_rating"],
            "isOpen": merch[j]["ordering"]["is_open"],
            "hours": merch[j]["hours"]
        };

        var db = e.target.result;
        var tx = db.transaction(["restaurants"], "readwrite");
        var store = tx.objectStore("restaurants");
        var count = store.count();

        store.put(rest);

    }

    tx.oncomplete = function() {
        console.log(count.result);
        db.close();
    }

};

function onLoadHandler(){

    var numResults = merch.length;
    document.getElementById("num-results").innerText = numResults + " results found";

    for (var i = 0; i < merch.length; i++) {

        var content = document.getElementById("search-results-content");
        var template = document.getElementById("restaurant-card-template").content.cloneNode(true);

        var name = merch[i]["summary"]["name"];
        template.querySelector("#restaurant-name").innerText = name;

        var rating = merch[i]["summary"]["star_ratings"];
        template.querySelector("#rating-stars").value = rating;

        var priceRating = merch[i]["summary"]["price_rating"];
        while (priceRating != 0) {
            template.querySelector("#price-rating").innerText += "$";
            priceRating -= 1;
        }

        var street = merch[i]["location"]["street"];
        var state = merch[i]["location"]["state"];
        var city = merch[i]["location"]["city"];
        var zip = merch[i]["location"]["zip"];
        var location = street + "\n" + city + ", " + state + " " + zip;
        template.querySelector("#location").innerText = location;

        var phoneNumber = merch[i]["summary"]["phone"];
        template.querySelector("#phone-number").innerText = "Tel: " + phoneNumber;

        var merchLogoPath = merch[i]["summary"]["merchant_logo"];
        template.querySelector("#merch-logo").src = merchLogoPath;

        var deliveryEstimate = merch[i]["ordering"]["availability"]["delivery_estimate"];
        template.querySelector("#wait-time").innerText = deliveryEstimate + " mins";

        content.appendChild(template);
    }
}
