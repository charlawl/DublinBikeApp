var infoWindow;
function initMap() {
    var dublin = {
        lat: 53.3575945,
        lng: -6.2613842
    };
    var mapOptions = {
        center: dublin,
        zoom: 15,
        mapTypeId: 'roadmap'
    };
    var map = new google.maps.Map(document.getElementById('map__box__locations'), mapOptions);
    infoWindow = new google.maps.InfoWindow();
    google.maps.event.addListener(map, 'click', function () {
        infoWindow.close();
    });
    function show_stations(station_data) {
        var bounds = new google.maps.LatLngBounds();
        console.log(station_data);
        for (var i = 0; i < station_data.length; i++) {
            var latlng = new google.maps.LatLng(station_data[i].position_lat, station_data[i].position_long);
            var name = station_data[i].name;
            var address = station_data[i].address;
            var st_number = station_data[i].station_number;
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
            var info_box_content =  '<div class="info_box">' +
                                    '<div class="info_box_title">' + "Name : " + name + '</div>' +
                                    '<div class="station_number">' + "Station Number : " + st_number + '</div></div>';
            infoWindow.setContent(info_box_content);
            infoWindow.open(map, marker);
        });
    }
}