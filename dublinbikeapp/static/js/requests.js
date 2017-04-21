function get_data(callback, resource, resource_id) {
    // call back function gets json for resource and resource id
    // runs the callback with the json result.

    var xhr = new XMLHttpRequest();
    var response;
    if (typeof resource_id == 'undefined'){
        var request = '/' + resource + '/';
    } else {
        var request = '/' + resource + '/' + resource_id; 
    }
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            response = JSON.parse(xhr.responseText);
            callback(response);
        
        }
        
    };

    xhr.open("GET", request, true);
    xhr.send();
}

function weather_forecast(callback) {
    // run the callback with the latest weather data.
    var xhr = new XMLHttpRequest();

    var daily = "http://api.openweathermap.org/data/2.5/forecast/daily?id=2964574&units=metric&APPID=1f0867a1f0c8ffc3bd29767c8aed1cb2";
    var weatherData;


    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            weatherData = JSON.parse(xhr.responseText);
            callback(weatherData);

        }
    };

    xhr.open("GET", daily, true);
    xhr.send();
}