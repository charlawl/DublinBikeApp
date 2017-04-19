var infoWindow;
const chart_colors = ['#59b75c', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'];
const backgroundColor = '#fff';
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
        animation:{
        duration: 1000,
        easing: 'out',
      },
        colors: chart_colors,
        hAxis: {
            ticks: [0,3,6,9,12,15,18,21,23]
        },
        bar: {
            groupWidth: '75%'
        },
        isStacked: true,
        backgroundColor: backgroundColor
    };
    var chart = new google.visualization.ColumnChart(document.getElementById('series_chart_div'));
    chart.draw(data, options);
}

function click_marker(st_number) {
    get_data(drawChart, "stations", st_number);
}
var map, heatmap;

function initMap() {

    var dublin = {
        lat: 53.3575945,
        lng: -6.2613842
    };

    var mapOptions = {
        center: dublin,
        zoom: 10,
        mapTypeId: 'roadmap',
        styles: [{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"off"},{"color":"#efebe2"}]},{"featureType":"administrative","elementType":"labels.text","stylers":[{"visibility":"on"},{"color":"#cea2a2"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#5d83a0"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#efebe2"}]},{"featureType":"landscape","elementType":"labels.text.fill","stylers":[{"color":"#5d83a0"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#5d83a0"}]},{"featureType":"poi.attraction","elementType":"all","stylers":[{"color":"#efebe2"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"color":"#efebe2"}]},{"featureType":"poi.government","elementType":"all","stylers":[{"color":"#dfdcd5"}]},{"featureType":"poi.medical","elementType":"all","stylers":[{"color":"#dfdcd5"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"color":"#b1d66c"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#72bc8e"}]},{"featureType":"poi.place_of_worship","elementType":"all","stylers":[{"color":"#efebe2"}]},{"featureType":"poi.school","elementType":"all","stylers":[{"color":"#efebe2"}]},{"featureType":"poi.sports_complex","elementType":"all","stylers":[{"color":"#efebe2"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#5d83a0"},{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"visibility":"on"}]},{"featureType":"road.arterial","elementType":"labels.text.stroke","stylers":[{"visibility":"on"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"#fbfbfb"}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dafd6"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#8d96b3"}]}]
    };

    map = new google.maps.Map(document.getElementById('map__box__locations'), mapOptions);

    //Transit layer(doesn't work for dublin - only shows luas line)
    // var transitLayer = new google.maps.TransitLayer();
    // transitLayer.setMap(map);

    //Bike layer
    var bikeLayer = new google.maps.BicyclingLayer();
        bikeLayer.setMap(map);

    //Transit layer (?)
    // var trafficLayer = new google.maps.TrafficLayer();
    //     trafficLayer.setMap(map);

    // Get data from bikes api======
    var result;
    $.ajax({
        url: 'https://api.jcdecaux.com/vls/v1/stations?apiKey=a982c88ae2bd27c612550bff6eedaa3e8e25d8bc&contract=Dublin',
        dataType: "json",
        success: function(data) {
            var result = [];
            var weigth_point;
            // create new spot for heatmap for stations with less than 5 bikes available
            for (var i = 0; i < data.length; i++) {
                if (data[i].bike_stands >= 40)
                    weigth_point = 0.1
                else {
                    weight_point = 1
                }
                result.push({
                    location: new google.maps.LatLng(data[i].position.lat, data[i].position.lng),
                    weight: weigth_point
                });
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
    google.maps.event.addListener(map, 'click', function () {
        infoWindow.close();
    });

    function show_stations(station_data) {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < station_data.length; i++) {
            var latlng = new google.maps.LatLng(station_data[i].position_lat, station_data[i].position_long);
            createMarker(latlng,
                station_data[i].name,
                station_data[i].address,
                station_data[i].number,
                station_data[i].last_update,
                station_data[i].available_bikes,
                station_data[i].available_bike_stands);
            bounds.extend(latlng);
        }
        map.fitBounds(bounds);
        map.setZoom(13);
    }

    get_data(show_stations, "stations");

    function createMarker(latlng, name, address, st_number, last_update, available_bikes, available_bike_stands) {
        var marker = new google.maps.Marker({
            map: map,
            position: latlng,
            title: name,
            icon: "http://labs.google.com/ridefinder/images/mm_20_blue.png"
        });
        google.maps.event.addListener(marker, 'click', function () {
            var info_box_content = '<div class="info_box">' +
                '<div class="info_box_title" onclick="return click_marker(' + st_number + ');">' +
                '<a><center>' + name + '</center></a></div><hr>' +
                '<p> Last update: ' + last_update + '</p>' +
                '<div id="donut_single"></div>';

            infoWindow.setContent(info_box_content);
            infoWindow.open(map, marker);

            var data = google.visualization.arrayToDataTable([
            ['Bikes', 'Bikes', 'Stands'],
            ['Bikes vs Stands', available_bikes, available_bike_stands]
                ]);

            var options = {
            chartArea: {width: '50%', height:'40%'},
            isStacked: true,
            hAxis: {
              minValue: 0,
                },

                };
            var chart = new google.visualization.BarChart(document.getElementById('donut_single'));
            chart.draw(data, options);

            // var data = google.visualization.arrayToDataTable([
            //     ['Options', 'Number'],
            //     ['Available Bikes', available_bikes],
            //     ['Available Stands', available_bike_stands]
            // ]);
            //
            // var options = {
            //     slices: {
            //         0: {color: 'Gold'},
            //         1: {color: 'Crimson'}
            //     },
            //     pieHole: 0.5,
            //     pieSliceText: 'value',
            //     pieSliceTextStyle: {
            //         color: 'black'
            //     }
            // };
            //
            // var chart = new google.visualization.PieChart(document.getElementById('donut_single'));
            // chart.draw(data, options);

        });
    }

    google.charts.load('current', {
        packages: ['corechart', 'bar']});

    // google.charts.load('current', {
    //     'packages': ['corechart']
    // });
}

function weather_display(data) {
    console.log(data);
}

function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : map);
}
weather_forecast(weather_display);