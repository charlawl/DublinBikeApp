function get_data(callback, resource, resource_id) {

    var xhr = new XMLHttpRequest();
    var response;
    if (typeof resource_id == 'undefined'){
        var request = '/' + resource + '/';
    } else {
        var request = '/' + resource + '/' + resource_id; 
    }
    
    xhr.onreadystatechange = function () {
        console.log("Hi");
        if (xhr.readyState == 4 && xhr.status == 200) {
            response = JSON.parse(xhr.responseText);
            callback(response);
        
        }
        
    };

    xhr.open("GET", request, true);
    xhr.send();
}


