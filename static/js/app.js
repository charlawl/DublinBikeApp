var infoWindow;

// ==============PULL STATION FILE===========================================
var station_data = [{
    "number": 42,
    "name": "SMITHFIELD NORTH",
    "address": "Smithfield North",
    "latitude": 53.349562,
    "longitude": -6.278198
}, {
    "number": 30,
    "name": "PARNELL SQUARE NORTH",
    "address": "Parnell Square North",
    "latitude": 53.353462,
    "longitude": -6.265305
}, {
    "number": 32,
    "name": "PEARSE STREET",
    "address": "Pearse Street",
    "latitude": 53.344304,
    "longitude": -6.250427
}, {
    "number": 48,
    "name": "EXCISE WALK",
    "address": "Excise Walk",
    "latitude": 53.347777,
    "longitude": -6.244239
}, {
    "number": 13,
    "name": "FITZWILLIAM SQUARE WEST",
    "address": "Fitzwilliam Square West",
    "latitude": 53.336074,
    "longitude": -6.252825
}, {
    "number": 81,
    "name": "ST. JAMES HOSPITAL (CENTRAL)",
    "address": "St. James Hospital (Central)",
    "latitude": 53.339983,
    "longitude": -6.295594
}, {
    "number": 68,
    "name": "HANOVER QUAY",
    "address": "Hanover Quay",
    "latitude": 53.344115,
    "longitude": -6.237153
}, {
    "number": 74,
    "name": "OLIVER BOND STREET",
    "address": "Oliver Bond Street",
    "latitude": 53.343893,
    "longitude": -6.280531
}, {
    "number": 87,
    "name": "COLLINS BARRACKS MUSEUM",
    "address": "Collins Barracks Museum",
    "latitude": 53.347477,
    "longitude": -6.28525
}, {
    "number": 84,
    "name": "BROOKFIELD ROAD",
    "address": "Brookfield Road",
    "latitude": 53.339005,
    "longitude": -6.300217
}, {
    "number": 54,
    "name": "CLONMEL STREET",
    "address": "Clonmel Street",
    "latitude": 53.336021,
    "longitude": -6.26298
}, {
    "number": 20,
    "name": "JAMES STREET EAST",
    "address": "James Street East",
    "latitude": 53.336485,
    "longitude": -6.248174
}, {
    "number": 56,
    "name": "MOUNT STREET LOWER",
    "address": "Mount Street Lower",
    "latitude": 53.33796,
    "longitude": -6.24153
}, {
    "number": 6,
    "name": "CHRISTCHURCH PLACE",
    "address": "Christchurch Place",
    "latitude": 53.343368,
    "longitude": -6.27012
}, {
    "number": 18,
    "name": "GRANTHAM STREET",
    "address": "Grantham Street",
    "latitude": 53.334123,
    "longitude": -6.265436
}, {
    "number": 52,
    "name": "YORK STREET EAST",
    "address": "York Street East",
    "latitude": 53.338755,
    "longitude": -6.262003
}, {
    "number": 43,
    "name": "PORTOBELLO ROAD",
    "address": "Portobello Road",
    "latitude": 53.330091,
    "longitude": -6.268044
}, {
    "number": 31,
    "name": "PARNELL STREET",
    "address": "Parnell Street",
    "latitude": 53.350929,
    "longitude": -6.265125
}, {
    "number": 98,
    "name": "FREDERICK STREET SOUTH",
    "address": "Frederick Street South",
    "latitude": 53.341515,
    "longitude": -6.256853
}, {
    "number": 14,
    "name": "FOWNES STREET UPPER",
    "address": "Fownes Street Upper",
    "latitude": 53.344603,
    "longitude": -6.263371
}, {
    "number": 1,
    "name": "CHATHAM STREET",
    "address": "Chatham Street",
    "latitude": 53.340962,
    "longitude": -6.262287
}, {
    "number": 23,
    "name": "CUSTOM HOUSE",
    "address": "Custom House",
    "latitude": 53.348279,
    "longitude": -6.254662
}, {
    "number": 90,
    "name": "BENSON STREET",
    "address": "Benson Street",
    "latitude": 53.344153,
    "longitude": -6.233451
}, {
    "number": 63,
    "name": "FENIAN STREET",
    "address": "Fenian Street",
    "latitude": 53.341428,
    "longitude": -6.24672
}, {
    "number": 91,
    "name": "SOUTH DOCK ROAD",
    "address": "South Dock Road",
    "latitude": 53.341833,
    "longitude": -6.231291
}, {
    "number": 67,
    "name": "THE POINT",
    "address": "The Point",
    "latitude": 53.346867,
    "longitude": -6.230852
}, {
    "number": 62,
    "name": "LIME STREET",
    "address": "Lime Street",
    "latitude": 53.346026,
    "longitude": -6.243576
}, {
    "number": 97,
    "name": "KILMAINHAM GAOL",
    "address": "Kilmainham Gaol",
    "latitude": 53.342113,
    "longitude": -6.310015
}, {
    "number": 49,
    "name": "GUILD STREET",
    "address": "Guild Street",
    "latitude": 53.347932,
    "longitude": -6.240928
}, {
    "number": 19,
    "name": "HERBERT PLACE",
    "address": "Herbert Place",
    "latitude": 53.334432,
    "longitude": -6.245575
}, {
    "number": 102,
    "name": "WESTERN WAY",
    "address": "Western Way",
    "latitude": 53.354929,
    "longitude": -6.269425
}, {
    "number": 53,
    "name": "NEWMAN HOUSE",
    "address": "Newman House",
    "latitude": 53.337132,
    "longitude": -6.26059
}, {
    "number": 101,
    "name": "KING STREET NORTH",
    "address": "King Street North",
    "latitude": 53.350291,
    "longitude": -6.273507
}, {
    "number": 47,
    "name": "HERBERT STREET",
    "address": "Herbert Street",
    "latitude": 53.335742,
    "longitude": -6.24551
}, {
    "number": 11,
    "name": "EARLSFORT TERRACE",
    "address": "Earlsfort Terrace",
    "latitude": 53.334019,
    "longitude": -6.258371
}, {
    "number": 17,
    "name": "GOLDEN LANE",
    "address": "Golden Lane",
    "latitude": 53.340803,
    "longitude": -6.267732
}, {
    "number": 45,
    "name": "DEVERELL PLACE",
    "address": "Deverell Place",
    "latitude": 53.351464,
    "longitude": -6.255265
}, {
    "number": 72,
    "name": "JOHN STREET WEST",
    "address": "John Street West",
    "latitude": 53.343105,
    "longitude": -6.277167
}, {
    "number": 99,
    "name": "CITY QUAY",
    "address": "City Quay",
    "latitude": 53.346637,
    "longitude": -6.246154
}, {
    "number": 9,
    "name": "EXCHEQUER STREET",
    "address": "Exchequer Street",
    "latitude": 53.343034,
    "longitude": -6.263578
}, {
    "number": 55,
    "name": "HATCH STREET",
    "address": "Hatch Street",
    "latitude": 53.33403,
    "longitude": -6.260714
}, {
    "number": 5,
    "name": "CHARLEMONT PLACE",
    "address": "Charlemont Street",
    "latitude": 53.330662,
    "longitude": -6.260177
}, {
    "number": 61,
    "name": "HARDWICKE PLACE",
    "address": "Hardwicke Place",
    "latitude": 53.357043,
    "longitude": -6.263232
}, {
    "number": 77,
    "name": "WOLFE TONE STREET",
    "address": "Wolfe Tone Street",
    "latitude": 53.348875,
    "longitude": -6.267459
}, {
    "number": 73,
    "name": "FRANCIS STREET",
    "address": "Francis Street",
    "latitude": 53.342081,
    "longitude": -6.275233
}, {
    "number": 4,
    "name": "GREEK STREET",
    "address": "Greek Street",
    "latitude": 53.346874,
    "longitude": -6.272976
}, {
    "number": 7,
    "name": "HIGH STREET",
    "address": "High Street",
    "latitude": 53.343565,
    "longitude": -6.275071
}, {
    "number": 60,
    "name": "NORTH CIRCULAR ROAD",
    "address": "North Circular Road",
    "latitude": 53.359624,
    "longitude": -6.260348
}, {
    "number": 38,
    "name": "TALBOT STREET",
    "address": "Talbot Street",
    "latitude": 53.350974,
    "longitude": -6.25294
}, {
    "number": 58,
    "name": "SIR PATRICK DUN'S",
    "address": "Sir Patrick's Dun",
    "latitude": 53.339218,
    "longitude": -6.240642
}, {
    "number": 66,
    "name": "NEW CENTRAL BANK",
    "address": "New Central Bank",
    "latitude": 53.347122,
    "longitude": -6.234749
}, {
    "number": 16,
    "name": "GEORGES QUAY",
    "address": "Georges Quay",
    "latitude": 53.347508,
    "longitude": -6.252192
}, {
    "number": 82,
    "name": "MOUNT BROWN",
    "address": "Mount Brown",
    "latitude": 53.341645,
    "longitude": -6.29719
}, {
    "number": 95,
    "name": "ROYAL HOSPITAL",
    "address": "Royal Hospital",
    "latitude": 53.343897,
    "longitude": -6.29706
}, {
    "number": 93,
    "name": "HEUSTON STATION (CENTRAL)",
    "address": "Heuston Station (Central)",
    "latitude": 53.346603,
    "longitude": -6.296924
}, {
    "number": 22,
    "name": "TOWNSEND STREET",
    "address": "Townsend Street",
    "latitude": 53.345922,
    "longitude": -6.254614
}, {
    "number": 34,
    "name": "PORTOBELLO HARBOUR",
    "address": "Portobello Harbour",
    "latitude": 53.330362,
    "longitude": -6.265163
}, {
    "number": 8,
    "name": "CUSTOM HOUSE QUAY",
    "address": "Custom House Quay",
    "latitude": 53.347884,
    "longitude": -6.248048
}, {
    "number": 27,
    "name": "MOLESWORTH STREET",
    "address": "Molesworth Street",
    "latitude": 53.341288,
    "longitude": -6.258117
}, {
    "number": 96,
    "name": "KILMAINHAM LANE",
    "address": "Kilmainham Lane",
    "latitude": 53.341805,
    "longitude": -6.305085
}, {
    "number": 76,
    "name": "MARKET STREET SOUTH",
    "address": "Market Street South",
    "latitude": 53.342296,
    "longitude": -6.287661
}, {
    "number": 71,
    "name": "KEVIN STREET",
    "address": "Kevin Street",
    "latitude": 53.337757,
    "longitude": -6.267699
}, {
    "number": 79,
    "name": "ECCLES STREET EAST",
    "address": "Eccles Street East",
    "latitude": 53.358115,
    "longitude": -6.265601
}, {
    "number": 69,
    "name": "GRAND CANAL DOCK",
    "address": "Grand Canal Dock",
    "latitude": 53.342638,
    "longitude": -6.238695
}, {
    "number": 25,
    "name": "MERRION SQUARE EAST",
    "address": "Merrion Square East",
    "latitude": 53.339434,
    "longitude": -6.246548
}, {
    "number": 51,
    "name": "YORK STREET WEST",
    "address": "York Street West",
    "latitude": 53.339334,
    "longitude": -6.264699
}, {
    "number": 37,
    "name": "ST. STEPHEN'S GREEN SOUTH",
    "address": "St. Stephen's Green South",
    "latitude": 53.337494,
    "longitude": -6.26199
}, {
    "number": 59,
    "name": "DENMARK STREET GREAT",
    "address": "Denmark Street Great",
    "latitude": 53.35561,
    "longitude": -6.261397
}, {
    "number": 94,
    "name": "HEUSTON STATION (CAR PARK)",
    "address": "Heuston Station (Car Park)",
    "latitude": 53.346985,
    "longitude": -6.297804
}, {
    "number": 36,
    "name": "ST. STEPHEN'S GREEN EAST",
    "address": "St. Stephen's Green East",
    "latitude": 53.337824,
    "longitude": -6.256035
}, {
    "number": 12,
    "name": "ECCLES STREET",
    "address": "Eccles Street",
    "latitude": 53.359246,
    "longitude": -6.269779
}, {
    "number": 78,
    "name": "MATER HOSPITAL",
    "address": "Mater Hospital",
    "latitude": 53.359967,
    "longitude": -6.264828
}, {
    "number": 2,
    "name": "BLESSINGTON STREET",
    "address": "Blessington Street",
    "latitude": 53.356769,
    "longitude": -6.26814
}, {
    "number": 26,
    "name": "MERRION SQUARE WEST",
    "address": "Merrion Square West",
    "latitude": 53.339764,
    "longitude": -6.251988
}, {
    "number": 65,
    "name": "CONVENTION CENTRE",
    "address": "Convention Centre",
    "latitude": 53.34744,
    "longitude": -6.238523
}, {
    "number": 15,
    "name": "HARDWICKE STREET",
    "address": "Hardwicke Street",
    "latitude": 53.355473,
    "longitude": -6.264423
}, {
    "number": 35,
    "name": "SMITHFIELD",
    "address": "Smithfield",
    "latitude": 53.347692,
    "longitude": -6.278214
}, {
    "number": 10,
    "name": "DAME STREET",
    "address": "Dame Street",
    "latitude": 53.344007,
    "longitude": -6.266802
}, {
    "number": 64,
    "name": "SANDWITH STREET",
    "address": "Sandwith Street",
    "latitude": 53.345203,
    "longitude": -6.247163
}, {
    "number": 33,
    "name": "PRINCES STREET / O'CONNELL STREET",
    "address": "Princes Street / O'Connell Street",
    "latitude": 53.349013,
    "longitude": -6.260311
}, {
    "number": 57,
    "name": "GRATTAN STREET",
    "address": "Grattan Street",
    "latitude": 53.339629,
    "longitude": -6.243778
}, {
    "number": 80,
    "name": "ST JAMES HOSPITAL (LUAS)",
    "address": "St James Hospital (Luas)",
    "latitude": 53.341359,
    "longitude": -6.292951
}, {
    "number": 3,
    "name": "BOLTON STREET",
    "address": "Bolton Street",
    "latitude": 53.351182,
    "longitude": -6.269859
}, {
    "number": 46,
    "name": "STRAND STREET GREAT",
    "address": "Strand Street Great",
    "latitude": 53.347082,
    "longitude": -6.264192
}, {
    "number": 70,
    "name": "BARROW STREET",
    "address": "Barrow Street",
    "latitude": 53.341655,
    "longitude": -6.236198
}, {
    "number": 28,
    "name": "MOUNTJOY SQUARE WEST",
    "address": "Mountjoy Square West",
    "latitude": 53.356299,
    "longitude": -6.258586
}, {
    "number": 39,
    "name": "WILTON TERRACE",
    "address": "Wilton Terrace",
    "latitude": 53.332383,
    "longitude": -6.252717
}, {
    "number": 21,
    "name": "LEINSTER STREET SOUTH",
    "address": "Leinster Street South",
    "latitude": 53.34218,
    "longitude": -6.254485
}, {
    "number": 75,
    "name": "JAMES STREET",
    "address": "James Street",
    "latitude": 53.343456,
    "longitude": -6.287409
}, {
    "number": 86,
    "name": "PARKGATE STREET",
    "address": "Parkgate Street",
    "latitude": 53.347972,
    "longitude": -6.291804
}, {
    "number": 100,
    "name": "HEUSTON BRIDGE (SOUTH)",
    "address": "Heuston Bridge (South)",
    "latitude": 53.347106,
    "longitude": -6.292041
}, {
    "number": 24,
    "name": "CATHAL BRUGHA STREET",
    "address": "Cathal Brugha Street",
    "latitude": 53.352149,
    "longitude": -6.260533
}, {
    "number": 85,
    "name": "ROTHE ABBEY",
    "address": "Rothe Abbey",
    "latitude": 53.338776,
    "longitude": -6.30395
}, {
    "number": 44,
    "name": "UPPER SHERRARD STREET",
    "address": "Upper Sherrard Street",
    "latitude": 53.358437,
    "longitude": -6.260641
}, {
    "number": 89,
    "name": "FITZWILLIAM SQUARE EAST",
    "address": "Fitzwilliam Square East",
    "latitude": 53.335211,
    "longitude": -6.2509
}, {
    "number": 41,
    "name": "HARCOURT TERRACE",
    "address": "Harcourt Terrace",
    "latitude": 53.332763,
    "longitude": -6.257942
}, {
    "number": 40,
    "name": "JERVIS STREET",
    "address": "Jervis Street",
    "latitude": 53.3483,
    "longitude": -6.266651
}, {
    "number": 29,
    "name": "ORMOND QUAY UPPER",
    "address": "Ormond Quay Upper",
    "latitude": 53.346057,
    "longitude": -6.268001
}, {
    "number": 83,
    "name": "EMMET ROAD",
    "address": "Emmet Road",
    "latitude": 53.340714,
    "longitude": -6.308191
}, {
    "number": 92,
    "name": "HEUSTON BRIDGE (NORTH)",
    "address": "Heuston Bridge (North)",
    "latitude": 53.347802,
    "longitude": -6.292432
}, {
    "number": 88,
    "name": "BLACKHALL PLACE",
    "address": "Blackhall Place",
    "latitude": 53.3488,
    "longitude": -6.281637
}];


function initMap() {
    var dublin = {
        lat: 53.3575945,
        lng: -6.2613842
    }
    var mapOptions = {
        center: dublin,
        zoom: 15,
        mapTypeId: 'roadmap'
    };
    var map = new google.maps.Map(document.getElementById('map__box__locations'), mapOptions);
    infoWindow = new google.maps.InfoWindow();
    google.maps.event.addListener(map, 'click', function() {
        infoWindow.close();
    });
    function show_stations() {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < station_data.length; i++) {
            var latlng = new google.maps.LatLng(station_data[i].latitude, station_data[i].longitude);
            var name = station_data[i].name;
            var address = station_data[i].address;
            var st_number = station_data[i].number;
            createMarker(latlng, name, address, st_number);
            bounds.extend(latlng);
        }
        map.fitBounds(bounds);
    }
    show_stations();
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