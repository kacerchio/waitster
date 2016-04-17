$(document).ready(
    onLoadHandler
);

var merch = JSON.parse(window.sessionStorage.getItem("merchants"));
console.log(merch);

var userAddress = window.sessionStorage.getItem("userAddress");
console.log(userAddress);

// This works on all devices/browsers, and uses IndexedDBShim as a final fallback
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

// Open (or create) the database
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
            "phone": merch[j]["summary"]["phone"],
            "logoURL": merch[j]["summary"]["merchant_logo"],
            "headerURL": merch[j]["summary"]["header_images"][0]["path"],
            "waitTime": merch[j]["ordering"]["availability"]["delivery_estimate"],
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
            console.error("Error Adding an item: ", e);
        };
    }
};

request.onerror = function() {
    console.log(request.error);
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
        template.querySelector("#price-rating").innerText += " | ";

        var isOpen = merch[i]["ordering"]["is_open"];
        if (isOpen == true) {
            template.querySelector("#is-open").innerText += "OPEN NOW";
            template.querySelector("#is-open").style.color = "#27ae60";
        }
        else {
            template.querySelector("#is-open").innerText = "CLOSED";
            template.querySelector("#is-open").style.color = "#c0392b";
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
