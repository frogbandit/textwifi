var map;
var markersArray = [];
var dataString;
var prev_infowindow =false; 

// to create marker
function createMarker(latLng, wifi_list) {
	console.log(latLng);
	console.log(wifi_list);
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
		var wifi_strength = wifi['signalStrength'] || wifi['strength'];

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

	dataString = `[`;

	$("#list").html('<div><table class="table"><thead><tr><th>Wifi Name</th><th>Strength</th></tr></thead><tbody>');

	for (var i = 0; i < wifi_list.length; i++) {
		var wifi = wifi_list[i];
		var wifi_name = wifi['name'];
		var wifi_strength = wifi['signalStrength'] || wifi['strength'];
		$("#list").append('<tr><td>' + wifi_name + '</td><td>' + wifi_strength + '</td></tr>')

		if (i + 1 == wifi_list.length) {
			dataString += `{ "name": "` + wifi_name + `", "strength": ` + wifi_strength + `, "location": { "lat": ` + (latLng['lon'] || latLng['lng']).toFixed(2) + `, "lon": ` + (latLng['lon'] || latLng['lng']).toFixed(2) + `} }`;
		} else {
			dataString += `{ "name": "` + wifi_name + `", "strength": ` + wifi_strength + `, "location": { "lat": ` + (latLng['lon'] || latLng['lng']).toFixed(2) + `, "lon": ` + (latLng['lon'] || latLng['lng']).toFixed(2) + `} },`;
		}
	}

	$("#list").append('</tbody></table></div>')
	$("#list").append('<button type="button" id="search-button" onClick="return text_data(dataString);" class="btn btn-default nav-input">Text It To Me!</button>')

	dataString += `]`;
	console.log('hi');
	console.log(dataString);

	contentString += '<button type="button" id="search-button" onClick="return text_data(dataString);" class="btn btn-default nav-input">Text It To Me!</button>';

	var infowindow = new google.maps.InfoWindow({
		content: contentString,
	});

	var marker = new google.maps.Marker({
		position: { lat: latLng['lat'], lng: latLng['lon'] || latLng['lng'] },
		map: map,
	});

	marker.addListener('click', function () {
		if (prev_infowindow) {
			prev_infowindow.close();
		}

		prev_infowindow = infowindow;
		infowindow.open(map, marker);
		console.log(infowindow["content"]);

		// $("#list").html('<div><table class="table"><thead><tr><th>Wifi Name</th><th>Strength</th></tr></thead><tbody>');
		// $("#list").append('<tr><td>' + wifi_name + '</td><td>' + wifi_strength + '</td></tr>')
		// $("#list").append('</tbody></table></div>')
		
		// $("#list").append('<button type="button" id="search-button" onClick="return text_data(dataString);" class="btn btn-default nav-input">Text It To Me!</button>')
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

		dataString = `[`;
		var headers = {
			'Content-Type': 'application/json',
		};

		for (var i = 0; i < wifi_list.length; i++) {
			var wifi = wifi_list[i];
			var wifi_name = wifi['name'];
			var wifi_strength = wifi['signalStrength'];

			if (i + 1 == wifi_list.length) {
				dataString += `{ "name": "` + wifi_name + `", "strength": ` + wifi_strength + `, "location": { "lat": ` + location['lat'].toFixed(2) + `, "lon": ` + location['lng'].toFixed(2) + `} }`;
			} else {
				dataString += `{ "name": "` + wifi_name + `", "strength": ` + wifi_strength + `, "location": { "lat": ` + location['lat'].toFixed(2) + `, "lon": ` + location['lng'].toFixed(2) + `} },`;
			}
		}

		dataString += `]`;
		console.log(dataString);

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
	get_data(map);

	// if user clicks on a point, find wifi hotspots around that location
	google.maps.event.addListener(map, 'click', function (e) {

		if (prev_infowindow) {
			prev_infowindow.close();
		}

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

		getDataString = `{"location": {"lat": "` + lat + `", ` + `"lon": "` + lng + `"}}`;

		// var url = 'https://search-twittymap-7v4tlmzwpwmtyomcc7je3wiqa4.us-east-1.es.amazonaws.com/tweets/tweet/_search?pretty=true&size=100';
		var getUrl = 'https://opyo6yseaa.execute-api.us-east-1.amazonaws.com/chan1/wifi'

		$.ajax({
			url: getUrl,
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.setRequestHeader('Content-Type', 'application/json');
			},
			headers: headers,
			contentType: 'application/json',
			data: { getDataString: getDataString },
			success: function (response) {
				clearOverlays();

				var hits = response["hits"]["hits"];
				console.log(hits);
				var hits_dict = {};
				for (var i = 0; i < hits.length; i++) {
					hit = hits[i]["_source"];
					hit_strength = hit["strength"];
					hit_name = hit["name"];
					hit_location = JSON.stringify(hit["location"]);
					if (hits_dict[hit_location]) {
						hits_dict[hit_location].push(hit);
					} else {
						hits_dict[hit_location] = [hit];
					}
				}

				console.log(hits_dict);

				for (var index in hits_dict) {
					createMarker(JSON.parse(index), hits_dict[index]);
				}


				// createMarker(location, wifi_list);
				console.log(response);
			},
			error: function (response) {
				console.log(response);
			},
		});
	});
}
