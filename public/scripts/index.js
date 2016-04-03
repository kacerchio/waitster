$(document).ready(
    loadLocation
);

var deliveryAPI = "https://api.delivery.com/merchant/search/delivery?client_id=YTExMWZlN2E1MTE4YjI1MGM4MzFlYzkzMTM5YzBkN2Uy";
var googleAPI = "https://maps.googleapis.com/maps/api/geocode/json?latlng=";
var googleKey = "&key=AIzaSyCnbPRMgv_MDYaPqiq2mVYIpWUy-m_k3Jc";

function search() {

    var query = $("#search-input").val();

    if (validateAddress(query)) {

        var addressQuery = deliveryAPI + " &address=" + query;

        $.getJSON(addressQuery, function (json) {
            var i, merchInfo;
            var merchList = [];
            for (i = 0; i < json.merchants.length; i++) {
                if (json.merchants[i]["summary"]["type_label"].localeCompare("Restaurant") == 0) {
                    //console.log(json.merchants[i]["summary"]);
                    //console.log("Last Delivery Time: " + json.merchants[i]["ordering"]["availability"]["last_delivery_time"]);
                    merchInfo = json.merchants[i];
                    //console.log(merchInfo);
                    merchList.push(merchInfo);
                }
            }
            window.location.href = "../templates/searchResults.html";
            sessionStorage.setItem("merchants", JSON.stringify(merchList));
        })
         .error(function() {
             window.location.href = "../templates/errorMessage.html";
         });
    }
}

$("#search-input").keyup(function(event){
    if(event.keyCode == 13){
        $("#search-btn").click();
    }
});

function validateRestName(name) {
    var regexp = /^[a-z\d\-_\s]+$/i;
    return regexp.test(name);
}

function isNumeric(str){
    return !isNaN(str);
}

function validateAddress(address) {
    var regexp = /^[a-zA-Z0-9\s,'-]*$/;
    return regexp.test(address);
}

var lat, lng, address;

function loadLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            var latlngQuery = googleAPI + lat + "," + lng + googleKey;
            $.getJSON(latlngQuery, function(json) {
                address = json.results[0]["formatted_address"];
                if (isNumeric(address.charAt(0)) == false) {
                    $('#valid-address-alert').show();
                }
                $("#search-input").val(address);
            });
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
