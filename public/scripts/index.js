$(document).ready(function(){

    var deliveryAPI = "https://api.delivery.com/merchant/search/delivery?client_id=YTExMWZlN2E1MTE4YjI1MGM4MzFlYzkzMTM5YzBkN2Uy";
    var googleAPI = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBdBMLBqrTp0Yp2zH3z5HhZATlBKTAuejM&callback=initMap"

    $("#search-btn").click(function(){
        var address = $("#search-input").val();
        var queryURL = deliveryAPI + " &address=" + address;
        $.getJSON(queryURL, function(json) {
            alert("Got JSON Data");
            var i;
            for (i=0; i < json.merchants.length; i++) {
                if (json.merchants[i]["summary"]["type_label"].localeCompare("Restaurant") == 0) {
                    console.log(json.merchants[i]["summary"]);
                }

                console.log("Last Delivery Time: " + json.merchants[i]["ordering"]["availability"]["last_delivery_time"]);
            }
        });
    });

    function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 6
        });
        var infoWindow = new google.maps.InfoWindow({map: map});

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                infoWindow.setPosition(pos);
                infoWindow.setContent('Location found.');
                map.setCenter(pos);
            }, function() {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    }
});