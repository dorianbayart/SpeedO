speedHistory = [];
speedAverage = 0;
speedAccuracy = 3;


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
	const options = {
		enableHighAccuracy: true,
		timeout: 3000,
		maximumAge: 500,
		accuracy: 10
	};
    navigator.geolocation.watchPosition(showPosition, locationError, options);
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
  
  if(location.speed) {
	speedHistory.push(location.speed);
  }
  
  $('#data-details').html( JSON.stringify(location, null, '<br>') );
  $('#gps_icon').text( 'gps_fixed' );
  
  updateScreen(location);
}

function calculateSpeed(accuracy) {
	let speed = 0;
	if(speedHistory.length >= accuracy) {
		speed = speedHistory.slice(speedHistory.length - accuracy).reduce((speed, spd) => speed + spd) / accuracy;
		return Math.round(speed * 3600 / 1000);
	}
	else {
		return last(speedHistory) ? Math.round(last(speedHistory) * 3600 / 1000) : 0;
	}
}
function updateScreen(location) {
	
	const vitesse = calculateSpeed(speedAccuracy);
	$('#vitesse').text( vitesse );
	console.log(speedHistory);
	
	$('#latitude').text( mathRound5(location.latitude) );
	$('#longitude').text( mathRound5(location.longitude) );
	$('#altitude').text( Math.round(location.altitude) + ' m' );
	
	const dateStamp = new Date(location.timestamp);
	const hours = dateStamp.getHours() < 10 ? '0'+dateStamp.getHours() : dateStamp.getHours();
	const minutes = dateStamp.getMinutes() < 10 ? '0'+dateStamp.getMinutes() : dateStamp.getMinutes();
	const seconds = dateStamp.getSeconds() < 10 ? '0'+dateStamp.getSeconds() : dateStamp.getSeconds();
	const hourStamp = hours + ':' + minutes + ':' + seconds;
	$('#hourstamp').text( hourStamp );
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

function mathRound5(x) { // round with 5 decimals
	return Math.round(100000. * x) / 100000.;
}

function last(array) {
    return array[array.length - 1];
}
