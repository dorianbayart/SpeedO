historic = [];
speedAverage = 0;
speedMax = 0;
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
		timeout: 1000,
		maximumAge: 1000
	};
    //navigator.geolocation.watchPosition(showPosition, locationError, options);
	
	setInterval(() => {
		navigator.geolocation.getCurrentPosition(showPosition, locationError, options);
	}, 500);
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
  
  //if(location.speed) {
	historic.push(location);
  //}
  
  speedMax = location.speed > speedMax ? location.speed : speedMax;
  
  $('#data-details').html( JSON.stringify(location, null, '<br>') );
  $('#gps_icon').text( 'gps_fixed' );
  
  updateScreen(location);
}

function calculateSpeed(accuracy) {
	let speed = 0;
	if(historic.length >= accuracy) {
		speed = historic.slice(historic.length - accuracy).reduce((speed, h) => speed + h.speed) / accuracy;
		return speed > 0 ? Math.round(speed * 3600. / 1000) : 0;
	}
	else {
		return last(historic) ? Math.round(last(historic).speed * 3600. / 1000) : 0;
	}
	// return last(historic) ? Math.round(last(historic).speed * 3600. / 1000) : 0;
}
function calculateMax(speedMax) {
	return Math.round( speedMax * 3600. / 1000);
}
function updateScreen(location) {
	
	const vitesse = calculateSpeed(speedAccuracy);
	$('#vitesse').text( vitesse );
	// console.log(historic);
	
	const vitesseMax = calculateMax(speedMax);
	$('#maximal').text( vitesseMax );
	
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
