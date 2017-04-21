// declare constants and global variables
var infoWindow;
st_number = 0;
const chart_colors = ['#59b75c', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'];
const backgroundColor = '#fff';
var icon;
function drawChart(chart_data) {
    // this function draws the Google visualization chart.
    // takes an input chart_data which is provided buy a jquery request.
    var data = google.visualization.arrayToDataTable(chart_data);
    var options = {
        // set the options for the chart.
        // options are specific to the daily bike usage chart.
        chart: {
            title: 'Bikes vs. Time',
            subtitle: 'Hourly dispaly of available bikes and bike stands'
        },
        height: 400,
        legend: {
            position: 'top',
            maxLines: 3
        },
        animation: {
            duration: 1000,
            easing: 'out',
        },
        colors: chart_colors,
        hAxis: {
            ticks: [0, 3, 6, 9, 12, 15, 18, 21, 23]
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

function drawWeekChart(chart_data){
    // essentially same as drawChart just modified to work with weekly data.
    var data = google.visualization.arrayToDataTable(chart_data);
    var options = {
        chart: {
            title: 'Bikes vs. Time',
            subtitle: 'Weekly display of available bikes'
        },
        height: 400,
        legend: {
            position: 'top',
            maxLines: 3
        },
        animation: {
            duration: 1000,
            easing: 'out'
        },
        colors: chart_colors,
        bar: {
            groupWidth: '75%'
        },
        isStacked: true,
        backgroundColor: backgroundColor
    };
    var chart = new google.visualization.ColumnChart(document.getElementById('series_weather_chart_div'));
    chart.draw(data, options);

}

function click_list(number, latlng) {
    // takes an input street number and a longitude and latitude.
    // self explanatory: set map zoom and map center and st_number when called.
    return function () {
        map.setZoom(16);
        map.setCenter(latlng);
        document.st_number = number;

        return click_marker(number);
    };
}

document.addEventListener('DOMContentLoaded', function () {
    // this is an event listener for the checkbox in the bottom left of the page.
    // when its is clicked run the checkbox function.
    document.querySelector('#rain_check_box').addEventListener('change', checkbox);
});


function click_marker(st_number) {
    // run when a marker on the Google map is clicked.

    // show the div in which the checkbox is placed. By default (when page is loaded) this is hidden.
    document.getElementById('rain_check_div').style.display = 'block';
    // this is call to get_data to draw the graph. Get_data is a call back function. So the drawChart input will be run when get_data is run.
    // more info about how 
    get_data(drawChart, "stations_weekday", st_number);
    get_data(drawWeekChart, "stations_weekly", st_number);
}

document.addEventListener('DOMContentLoaded', function () {
      document.querySelector('#rain_check_box').addEventListener('change', checkbox);
});

function checkbox(){
    // change the graph when checked. If checked draw with wet data else draw with todays data.
    if (document.getElementById('rain_check_box').checked)
      {
        get_data(drawChart, "getRainDay", document.st_number);
    }else{
        get_data(drawChart, "stations_weekday", document.st_number);
    }
}


var map, heatmap;

function initMap() {
    // function to create the map.

    var dublin = {
        lat: 53.3575945,
        lng: -6.2613842
    };

    var mapOptions = {
        center: dublin,
        zoom: 10,
        mapTypeId: 'roadmap'
    };

    // create the map object with the options above.
    map = new google.maps.Map(document.getElementById('map__box__locations'), mapOptions);

    //Bike Layer
    var bikeLayer = new google.maps.BicyclingLayer();
    bikeLayer.setMap(map);


    // Get data from bikes api======
    var result;
    $.ajax({
        url: 'https://api.jcdecaux.com/vls/v1/stations?apiKey=a982c88ae2bd27c612550bff6eedaa3e8e25d8bc&contract=Dublin',
        dataType: "json",
        success: function (data) {
            var result = [];
            var weight_point;

            // create new spot for heatmap for stations with less than 5 bikes available
            for (var i = 0; i < data.length; i++) {
                if (data[i].bike_stands >= 40)
                    weight_point = 0.2;
                else {
                    weight_point = 1;
                }
                result.push({
                    location: new google.maps.LatLng(data[i].position.lat, data[i].position.lng),
                    weight: weight_point
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
        // function to show station markers at correct position on the map.
        var bounds = new google.maps.LatLngBounds();

        // iterate over the data creating different colour icons depending on bike usage.
        for (var i = 0; i < station_data.length; i++) {
            var dropDownElement = document.createElement('a');
            var latlng = new google.maps.LatLng(station_data[i].position_lat, station_data[i].position_long);
            if (station_data[i].available_bikes >= 20) {
                icon = "http://labs.google.com/ridefinder/images/mm_20_green.png"
            }else if(station_data[i].available_bikes >= 10 && station_data[i].available_bikes < 20){
                icon = "http://labs.google.com/ridefinder/images/mm_20_yellow.png"
            }else{
               icon = "http://labs.google.com/ridefinder/images/mm_20_red.png"
            }
            createMarker(latlng,
                station_data[i].name,
                station_data[i].address,
                station_data[i].number,
                station_data[i].last_update,
                station_data[i].available_bikes,
                station_data[i].available_bike_stands);
            bounds.extend(latlng);

            dropDownElement.onclick = click_list(station_data[i].number, latlng);
            dropDownElement.innerHTML = station_data[i].address;
            dropDownElement.class = "station-list";
            document.getElementById("myDropdown").appendChild(dropDownElement);
        }
        map.fitBounds(bounds);
        map.setZoom(13);


    }

    get_data(show_stations, "stations");
    // show_stations is a callback functions for get_data
    // so this essentially runs show_stations(get_data(stations))

    function createMarker(latlng, name, address, st_number, last_update, available_bikes, available_bike_stands) {
        // all the javascript for creating the info box. The info box appears when a pin is clicked.
        var marker = new google.maps.Marker({
            map: map,
            position: latlng,
            title: name,
            icon: icon
        });
        google.maps.event.addListener(marker, 'click', function () {
            document.st_number = st_number;
            var info_box_content = '<div class="info_box">' +
                '<div class="info_box_title" onclick="return click_marker(' + st_number + ');">' +
                '<a href="#chart_boxes"><center>' + name + '</center></a></div><hr>' +
                '<p> Last update: ' + last_update + '</p>' +
                '<div id="donut_single"></div>';

            infoWindow.setContent(info_box_content);
            infoWindow.open(map, marker);

            var data = google.visualization.arrayToDataTable([
                ['Bikes', 'Bikes', 'Stands'],
                ['', available_bikes, available_bike_stands]
            ]);

            var options = {
                chartArea: {width: '50%', height: '60%'},
                colors: chart_colors,
                isStacked: true,
                hAxis: {
                    minValue: 0,
                },

            };
            var chart = new google.visualization.BarChart(document.getElementById('donut_single'));
            chart.draw(data, options);

        });
    }

    google.charts.load('current', {
        packages: ['corechart', 'bar', 'line']
    });

}

function weather_display(data) {
    console.log(data);
}

function toggleHeatmap() {
    // as described toggles heatmap on and off.
    heatmap.setMap(heatmap.getMap() ? null : map);
}

function stationDropdown(stations) {
    document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}

weather_forecast(weather_display);


window.onload = function () {
    document.body.onclick = function (e) {
        console.log(e.target.id);
        if (!(e.target.id == "dropdownBtn" || e.target.id == "myInput" || e.target.classList.contains("station-list") )) {
            console.log(e.target.id);
            if (document.getElementById("myDropdown").classList.contains("show")) {
                document.getElementById("myDropdown").classList.toggle("show");
            }
        }
    };

};