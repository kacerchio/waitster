$(document).ready(
    loadLocation
);

var merchInfo;
var merchList = [];
var j = 0;
var jj = 0;

function search() {

    window.sessionStorage.clear();
    var deliveryAPI = "https://api.delivery.com/merchant/search/delivery?client_id=YTExMWZlN2E1MTE4YjI1MGM4MzFlYzkzMTM5YzBkN2Uy&merchant_type=R";
    var query = $("#search-input").val();
    var addressQuery = deliveryAPI + "&address=" + query;

    if (validateAddress(query)) {
        $.getJSON(addressQuery, function (json) {
            var i;
            if (json.merchants.length == 0) {
                window.location.href = "../templates/errorMessage.html";
            }
            else {
                for (i = 0; i < json.merchants.length; i++) {
                    jj++;
                    merchInfo = json.merchants[i];
                    getHours(merchInfo.id, merchInfo, merchList);
                }
                $("#loading").modal("show");
            }
        })
         .error(function() {
             window.location.href = "../templates/errorMessage.html";
         });
    }
}

function getHours(id, merchInfo, merchList) {
    var hours = "https://api.delivery.com/merchant/" + id + "/hours?client_id=YTExMWZlN2E1MTE4YjI1MGM4MzFlYzkzMTM5YzBkN2Uy";
    $.getJSON(hours, function (json) {
        merchInfo.hours = json["current_schedule"]["business"];
        merchList.push(merchInfo);
        window.sessionStorage.setItem("merchants", JSON.stringify(merchList));
    })
    .done(function() {
        j++;
        if (j == jj) {
            window.location.href = "../templates/searchResults.html";
        }
        else {
            var width = $("#progress-bar").width();
            $("#progress-bar").css('width', ((j/jj) * 100) + "%");
        }
    })
}

function isNumeric(str){
    return !isNaN(str);
}

function validateAddress(address) {
    var regexp = /^[a-zA-Z0-9\s,'-]*$/;
    return regexp.test(address);
}

$("#search-input").keyup(function(event){
    if(event.keyCode == 13){
        $("#search-btn").click();
    }
});

var googleAPI = "https://maps.googleapis.com/maps/api/geocode/json?latlng=";
var googleKey = "&key=AIzaSyCnbPRMgv_MDYaPqiq2mVYIpWUy-m_k3Jc";
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