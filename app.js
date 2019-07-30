historic = [];

trip = {
	startTime: 0,
	speedAverage: 0,
	speedMax: 0,
	duration: 0
};
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
		maximumAge: 0
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
	speed: position.coords.speed ? position.coords.speed : 0,
	timestamp: position.timestamp
  }
  
  updateTrip(location);
  $('#gps_icon').text( 'gps_fixed' );
}

function calculateSpeed(accuracy) {
	let speed = 0;
	/*if(historic.length >= accuracy) {
		speed = historic.slice(historic.length - accuracy).reduce((speed, h) => speed + h.speed) / accuracy;
		return speed > 0 ? Math.round(speed * 3600. / 1000) : 0;
	}
	else {
		return last(historic) ? Math.round(last(historic).speed * 3600. / 1000) : 0;
	}*/
	return Math.round(last(historic).speed * 3600. / 1000);
}
function calculateMax() {
	const lastLocation = last(historic);
	trip.speedMax = lastLocation.speed > trip.speedMax ? lastLocation.speed : trip.speedMax;
}
function calculateAverage() {
	const lastLocation = last(historic);
	const time = lastLocation.timestamp;
	const previousLocation = historic[historic.length - 2];
	const previousTime = previousLocation.timestamp;
	const diffTime = (time - previousTime) / 1000;
	const speed = lastLocation.speed;
	trip.speedAverage = (trip.duration * trip.speedAverage + diffTime * speed) / (trip.duration + diffTime);
}
function updateTrip(location) {
	historic.push(location);
	console.log(historic);
	
	if(historic.length === 1) {
		trip.startTime = location.timestamp;
	}
	
	calculateMax();
	
	if(historic.length > 1) {
		calculateAverage();
	}
	
	trip.duration = (location.timestamp - trip.startTime) / 1000;
	
	updateScreen(location);
}
function updateScreen(location) {
	
	$('#vitesse').text( Math.round( last(historic).speed * 3600. / 1000) );
	$('#duration').text( trip.duration );
	$('#average').text( Math.round( trip.speedAverage * 3600. / 1000) );
	$('#maximal').text( Math.round( trip.speedMax * 3600. / 1000) );
	
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
