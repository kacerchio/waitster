$(document).ready(
    onLoadHandler
);

function onLoadHandler(){

    var merch = JSON.parse(sessionStorage.getItem("merchants"));

    var numResults = merch.length;
    document.getElementById("num-results").innerText = numResults + " results found";

    for (var i = 0; i < merch.length; i++) {

        var content = document.getElementById("search-results-content");
        var template = document.getElementById("restaurant-card-template").content.cloneNode(true);

        var name =  merch[i]["summary"]["name"];
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

        var rating =  merch[i]["summary"]["star_ratings"];
        template.querySelector("#rating").innerText = "Rating: " + rating;

        content.appendChild(template);
    }
}