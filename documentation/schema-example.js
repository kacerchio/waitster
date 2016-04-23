/*
 * This is a commented schema of our application's database. We are using
 * IndexedDB, which is a database that lives browser-side and is unique to your
 * webapp's domain. More documentation about IndexedDB can be found at:
 * https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 */

// This works on all devices/browsers, and uses IndexedDBShim as a final fallback
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

// Store each restaurant's information into the database upon successfully creating it
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