var ctx = document.getElementById("bar-chart").getContext("2d");

var data = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
        {
            label: 'Weekly Average Wait Times',
            fillColor: '#95a5a6',
            highlightFill: '#7f8c8d',
            data: [20, 22, 12, 14, 32, 45, 35]
        }
    ]
};

var barChart = new Chart(ctx).Bar(data);

//var googleKey = "&key=AIzaSyCnbPRMgv_MDYaPqiq2mVYIpWUy-m_k3Jc";
//var googleAPI = "https://maps.googleapis.com/maps/api/staticmap?center=" + address + "&zoom=15&scale=false&size=600x300&maptype=roadmap" + googleKey + "&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xf12403%7Clabel:%7C" + address;

