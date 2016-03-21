$(document).ready(function(){

    var deliveryAPI = "https://api.delivery.com/merchant/search/delivery?client_id=YTExMWZlN2E1MTE4YjI1MGM4MzFlYzkzMTM5YzBkN2Uy";

    $("#search-btn").click(function(){
        var address = $("#search-input").val();
        $.getJSON(deliveryAPI + " &address=" + address, function(json) {
            alert("Got JSON Data");
            console.log(json[Object.keys(json)[4]]);
            console.log(json);
        });
    });
});