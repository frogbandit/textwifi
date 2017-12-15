var map;
var markersArray = [];
var dataString;

// to create marker
function createMarker(latLng, wifi_list) {
	console.log(latLng);
	var contentString =
		'<div id="content">' +
		'<div id="siteNotice">' +
		'</div>' +
		'<h3>' +
		'Wifi Hotspots:' +
		'</h3>' +
		'<div id="bodyContent">';

	for (var i = 0; i < wifi_list.length; i++) {
		var wifi = wifi_list[i];
		var wifi_name = wifi['name'];
		var wifi_strength = wifi['signalStrength'];

		contentString +=
			'<p><b>Name: </b>' +
			wifi_name +
			'</p>' +
			'<p><b>Strength: </b>' +
			wifi_strength +
			'</p>' + '<hr>';
	}

	contentString +=
		'</div>' +
		'</div>';

	var infowindow = new google.maps.InfoWindow({
		content: contentString,
	});

	var marker = new google.maps.Marker({
		position: { lat: latLng['lat'], lng: latLng['lng'] },
		map: map,
	});

	marker.addListener('click', function () {
		infowindow.open(map, marker);
	});

	markersArray.push(marker);
}

// gets wifi data from location
function text_data(dataString) {
	console.log(dataString);
	var headers = {
		'Content-Type': 'application/json',
	};

	var url = 'https://opyo6yseaa.execute-api.us-east-1.amazonaws.com/chan1/text'

	$.ajax({
		url: url,
		type: 'POST',
		beforeSend: function (xhr) {
			xhr.setRequestHeader('Content-Type', 'application/json');
		},
		headers: headers,
		contentType: 'application/json',
		data: dataString,
		success: function (response) {
			console.log(response);
		},
		error: function (response) {
			console.log(response);
		},
	});
}

// gets wifi data from location
function get_data(map) {

	clearOverlays();
	$("#list").html('<div>' + 'Fetching your location wifi...' + '</div>');
	var startTime = new Date();
	$.getJSON('/generateWifi', function (data) {

		console.log(data);
		var wifi_list = data[0]['wifiAccessPoints'];
		var location = data[1]['location'];
		$("#list").html('<div><table class="table"><thead><tr><th>Wifi Name</th><th>Strength</th></tr></thead><tbody>');

		dataString = `[`;
		var headers = {
			'Content-Type': 'application/json',
		};

		for (var i = 0; i < wifi_list.length; i++) {
			var wifi = wifi_list[i];
			var wifi_name = wifi['name'];
			var wifi_strength = wifi['signalStrength'];
			$("#list").append('<tr><td>' + wifi_name + '</td><td>' + wifi_strength + '</td></tr>')

			if (i + 1 == wifi_list.length) {
				dataString += `{ "name": "` + wifi_name + `", "strength": ` + wifi_strength + `, "location": { "lat": ` + location['lat'].toFixed(3) + `, "lon": ` + location['lng'].toFixed(3) + `} }`;
			} else {
				dataString += `{ "name": "` + wifi_name + `", "strength": ` + wifi_strength + `, "location": { "lat": ` + location['lat'].toFixed(3) + `, "lon": ` + location['lng'].toFixed(3) + `} },`;
			}
		}
		
		dataString += `]`;
		console.log(dataString);

		$("#list").append('</tbody></table></div>')

		$("#list").append('<button type="button" id="search-button" onClick="return text_data(dataString);" class="btn btn-default nav-input">Text It To Me!</button>')

		createMarker(location, wifi_list);

		// var url = 'https://search-twittymap-7v4tlmzwpwmtyomcc7je3wiqa4.us-east-1.es.amazonaws.com/tweets/tweet/_search?pretty=true&size=100';
		var url = 'https://opyo6yseaa.execute-api.us-east-1.amazonaws.com/chan1/wifi'
		$.ajax({
			url: url,
			type: 'POST',
			beforeSend: function (xhr) {
				xhr.setRequestHeader('Content-Type', 'application/json');
			},
			headers: headers,
			contentType: 'application/json',
			data: dataString,
			success: function (response) {
				console.log(response);
			},
			error: function (response) {
				console.log(response);
			},
		});

	});
}

// clears markers
function clearOverlays() {
	for (var i = 0; i < markersArray.length; i++) {
		markersArray[i].setMap(null);
	}
	markersArray.length = 0;
}


// initializes map -- called first
function initMap() {
	var newYork = new google.maps.LatLng(40.7127, -74.0079);
	map = new google.maps.Map(document.getElementById('map'), {
		center: newYork, // New York
		zoom: 12,
	});

	// get wifi hotspots around current location
	// get_data(map);

	// if user clicks on a point, find wifi hotspots around that location
	google.maps.event.addListener(map, 'click', function (e) {

		var radius = $('#radius').val();
		if (radius == '') {
			radius = 100;
		}

		var headers = {
			'Content-Type': 'application/json',
		};

		var lat = e.latLng.lat().toFixed(2);;
		var lng = e.latLng.lng().toFixed(2);;
		console.log(lat);
		console.log(lng);

		dataString = `
        {
					"location": {
						"lat": ` + lat + `, ` + 
						`"lon": ` + lng + `
					}, 
        }`;

		// var url = 'https://search-twittymap-7v4tlmzwpwmtyomcc7je3wiqa4.us-east-1.es.amazonaws.com/tweets/tweet/_search?pretty=true&size=100';
		var url = '';



		// $.ajax({
		// 	url: url,
		// 	type: 'GET',
		// 	beforeSend: function (xhr) {
		// 		xhr.setRequestHeader('Content-Type', 'application/json');
		// 	},
		// 	headers: headers,
		// 	contentType: 'application/json',
		// 	data: dataString,
		// 	success: function (response) {
		// 		clearOverlays();
		// 		console.log(response);
		// 	},
		// 	error: function (response) {
		// 		console.log(response);
		// 	},
		// });
	});
}
