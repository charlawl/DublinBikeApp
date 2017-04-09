var infoWindow;
function drawChart(chart_data) {
    var data = google.visualization.arrayToDataTable(chart_data);
    //   var data = new google.visualization.arrayToDataTable(chart_data);
    var options = {
        chart: {
            title: 'Bikes vs. Time',
            subtitle: 'Hourly dispaly of available bikes and bike stands'
        },
        height: 400,
        legend: {
            position: 'top',
            maxLines: 3
        },
        bar: {
            groupWidth: '75%'
        },
        isStacked: true,
    };
    var chart = new google.visualization.ColumnChart(document.getElementById('data_chart'));
    chart.draw(data, options);
}

function click_marker(st_number) {
    get_data(drawChart, "stations", st_number);
}

function initMap() {
    var map, heatmap;
    var dublin = {
        lat: 53.3575945,
        lng: -6.2613842
    };
    var mapOptions = {
        center: dublin,
        zoom: 15,
        mapTypeId: 'roadmap'
    };
    map = new google.maps.Map(document.getElementById('map__box__locations'), mapOptions);

    // Get data from bikes api======
    var result;
    $.ajax({
        url: 'https://api.jcdecaux.com/vls/v1/stations?apiKey=a982c88ae2bd27c612550bff6eedaa3e8e25d8bc&contract=Dublin',
        dataType: "json",
        success: function(data) {
            result = [];
            // create new spot for heatmap for stations with less than 5 bikes available
            for (var i = 0; i < data.length; i++) {
                if (data[i].available_bikes < 5) {
                    result.push(new google.maps.LatLng(data[i].position.lat, data[i].position.lng))
                }
            }
            // draw the heatmap
            heatmap = new google.maps.visualization.HeatmapLayer({
                data: result,
                map: map,
                radius: 15
            });
        }
    });
    // ============================
    infoWindow = new google.maps.InfoWindow();
    google.maps.event.addListener(map, 'click', function() {
        infoWindow.close();
    });

    function show_stations(station_data) {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < station_data.length; i++) {
            var latlng = new google.maps.LatLng(station_data[i].position_lat, station_data[i].position_long);
            var name = station_data[i].name;
            var address = station_data[i].address;
            var st_number = station_data[i].number;
            createMarker(latlng, name, address, st_number);
            bounds.extend(latlng);
        }
        map.fitBounds(bounds);
    }

    get_data(show_stations, "stations");

    function createMarker(latlng, name, address, st_number) {
        var marker = new google.maps.Marker({
            map: map,
            position: latlng,
            title: name,
            icon: "http://labs.google.com/ridefinder/images/mm_20_blue.png"
        });
        google.maps.event.addListener(marker, 'click', function() {
            var info_box_content = '<div class="info_box">' +
                '<div class="info_box_title" onclick="return click_marker(' + st_number + ');">' +
                '<a>' + name + '</a></div>';
            infoWindow.setContent(info_box_content);
            infoWindow.open(map, marker);
        });
    }
    google.charts.load('current', {
        'packages': ['corechart']
    });
}

function weather_display(data) {
    console.log(data);
}

weather_forecast(weather_display);