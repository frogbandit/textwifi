var map;
var markersArray = [];

// to create marker
function createMarker(latLng, wifi_list) {
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
function get_data(map) {

	clearOverlays();
	$("#list").html('<div>' + 'Fetching your location wifi...' + '</div>');
	var startTime = new Date();
	$.getJSON('/generateWifi', function (data) {

		console.log(data);
		var wifi_list = data[0]['wifiAccessPoints'];
		var location = data[1]['location'];
		$("#list").html('<div><table class="table"><thead><tr><th>Wifi Name</th><th>Strength</th></tr></thead><tbody>');

		var dataString = `[`;
		var headers = {
			'Content-Type': 'application/json',
		};

		for (var i = 0; i < wifi_list.length; i++) {
			var wifi = wifi_list[i];
			var wifi_name = wifi['name'];
			var wifi_strength = wifi['signalStrength'];
			$("#list").append('<tr><td>' + wifi_name + '</td><td>' + wifi_strength + '</td></tr>')

			if (i + 1 == wifi_list.length) {
				dataString += `{ "name": "` + wifi_name + `", "strength": ` + wifi_strength + `, "location": { "lat": ` + location['lat'] + `, "lon": ` + location['lng'] + `} }`;
			} else {
				dataString += `{ "name": "` + wifi_name + `", "strength": ` + wifi_strength + `, "location": { "lat": ` + location['lat'] + `, "lon": ` + location['lng'] + `} },`;
			}
		}
		
		dataString += `]`;
		console.log(dataString);

		$("#list").append('</tbody></table></div>')

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
		zoom: 7,
	});

	// some examples: therealjamesxue, realDonaldTrump, justinbieber
	get_data(map);

	// If user clicks on a point, find the tweets within radius through ES
	google.maps.event.addListener(map, 'click', function (e) {

		var radius = $('#radius').val();
		if (radius == '') {
			radius = 100;
		}

		var headers = {
			'Content-Type': 'application/json',
		};

		var dataString = `
        {
					[
						{
							"name": bla, 
							"strength": bla, 
							"location": {
								lat: bla, lon: bla
							}
						},
						
					]
        }`;

		var url =
			'https://search-twittymap-7v4tlmzwpwmtyomcc7je3wiqa4.us-east-1.es.amazonaws.com/tweets/tweet/_search?pretty=true&size=100';
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
				clearOverlays();
				var tweets = response['hits']['hits'];

				// loop through all of the tweets returned
				for (var index in tweets) {
					var location = tweets[index]['_source']['location'];
					var tweet = tweets[index]['_source'];

					// add marker if there's a location
					if (location) {
						geocodingGenerator(map, location, tweet);
					}
				}
			},
			error: function (response) {
				console.log(response);
			},
		});
	});
}
