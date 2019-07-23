

$.when( $.ready ).then(function() {
	
	initialize();
	
	
	
});

function initialize() {
	//request for location
	getLocation();
}

//function that gets the location and returns it
function getLocation() {
  if(navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition, locationError);
  } else {
    console.log("Geo Location not supported by browser");
  }
}
//function that retrieves the position
function showPosition(position) {
  var location = {
	altitude: position.coords.altitude,
    longitude: position.coords.longitude,
    latitude: position.coords.latitude,
	speed: position.coords.speed,
	timestamp: position.timestamp
  }
  console.log(position);
  console.log(location);
  $('#data-details').html( JSON.stringify(location, null, '<br>') );
  $('#gps_icon').text( 'gps_fixed' );
  
  updateScreen(location);
}

function updateScreen(location) {
	const vitesse = Math.round(location.speed * 3600 / 1000);
	console.log(vitesse);
	$('#vitesse').text( vitesse );
}


function locationError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            return "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            return "Location information is unavailable."
            break;
        case error.TIMEOUT:
            return "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            return "An unknown error occurred."
            break;
    }
	$('#gps_icon').text( 'gps_off' );
}
