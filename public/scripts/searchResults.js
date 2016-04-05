var mongoose = require('mongoose');

$(document).ready(
    onLoadHandler
);

var Schema = mongoose.Schema;

var restaurantSchema = new Schema({

    name: String,
    id: Number,
    location: String,
    phoneNumber: String,
    logoURL: String,
    waitTime: Number,
    rating: Number,
    isOpen: Boolean,
    hours: {
        sunday: {start: String, end: String},
        monday: {start: String, end: String},
        tuesday: {start: String, end: String},
        wednesday: {start: String, end: String},
        thursday: {start: String, end: String},
        friday: {start: String, end: String},
        saturday: {start: String, end: String}
    }


});

function onLoadHandler(){

    var merch = JSON.parse(sessionStorage.getItem("merchants"));

    var numResults = merch.length;
    document.getElementById("num-results").innerText = numResults + " results found";

    var Restaurant = mongoose.model('Restaurant', restaurantSchema);

    for (var i = 0; i < merch.length; i++) {

        var content = document.getElementById("search-results-content");
        var template = document.getElementById("restaurant-card-template").content.cloneNode(true);

        var id = merch[i]['id'];

        var query = Restaurant.findOne({'id':id});

        query.exec(function (err, restaurant) {
                if (err) {
                    var name = merch[i]["summary"]["name"];
                    template.querySelector("#restaurant-name").innerText = name;

                    var street = merch[i]["location"]["street"];
                    var state = merch[i]["location"]["state"];
                    var city = merch[i]["location"]["city"];
                    var zip = merch[i]["location"]["zip"];
                    var location = street + "\n" + city + ", " + state + " " + zip;
                    template.querySelector("#location").innerText = location;

                    var phoneNumber = merch[i]["summary"]["phone"];
                    template.querySelector("#phone-number").innerText = phoneNumber;

                    var merchLogoPath = merch[i]["summary"]["merchant_logo"];
                    template.querySelector("#merch-logo").src = merchLogoPath;

                    var deliveryEstimate = merch[i]["ordering"]["availability"]["delivery_estimate"];
                    template.querySelector("#wait-time").innerText = deliveryEstimate + " mins";

                    var rating = merch[i]["summary"]["star_ratings"];
                    template.querySelector("#rating").innerText = "Rating: " + rating;

                    content.appendChild(template);

                    var r = new Restaurant;
                    r.name = name;
                    r.id = id;
                    r.location = location;
                    r.phoneNumber = phoneNumber;
                    r.logoURL = merchLogoPath;
                    r.waitTime = deliveryEstimate;
                    r.rating = rating;
                    //r.isOpen = isOpen;
                    // r.hours.sunday = {sunStart, sunEnd};
                    // r.hours.monday = {monStart, monEnd};
                    // r.hours.tuesday = {tuesStart, tuesEnd};
                    // r.hours.wednesday = {wedStart, wedEnd};
                    // r.hours.thursday = {thursStart, thursEnd};
                    // r.hours.friday = {friStart, friEnd};
                    // r.hours.saturday = {satStart, satEnd};

                    r.save(callback);
                    console.log(r);
                }

                else {
                    var deliveryEstimate = merch[i]["ordering"]["availability"]["delivery_estimate"];
                    template.querySelector("#wait-time").innerText = deliveryEstimate + " mins";
                    query.update({waitTime: deliveryEstimate});

                }
        });
    }



}