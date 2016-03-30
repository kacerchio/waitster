$(document).ready(
    onLoadHandler
);

function onLoadHandler(){
    var merch = JSON.parse(sessionStorage.getItem("merchants"));
    for (var i = 0; i < merch.length; i++) {
        var content = document.getElementById("search-results-content");
        var template = document.getElementById("restaurant-card-template").content.cloneNode(true);
        template.querySelector("#restaurant-name").innerText = merch[i]["name"];
        console.log(merch[i]["name"]);
        content.appendChild(template);
    }
    sessionStorage.clear();
}