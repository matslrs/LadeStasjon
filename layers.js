function setupBaseLayers(map) {
	//OpenStreetMap layer
	var osm_layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	//kartverket topografisk kart
	var kartverk_topo2_layer = L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo2&zoom={z}&x={x}&y={y}', {
		attribution: 'Kartverket'
	});
	//kartverket sjøkart kart			 
	var kartverk_sjohovedkart2_layer = L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=sjo_hovedkart2&zoom={z}&x={x}&y={y}', {
		attribution: 'Kartverket'
	});

	//kartverket ionosphere			 
	var kartverk_ionosphere_layer = L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=ionosphere&zoom={z}&x={x}&y={y}', {
		attribution: 'Kartverket'
	});
	//kartverket ionosphere			 
	var kartverk_toporaster3_layer = L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=toporaster3&zoom={z}&x={x}&y={y}', {
		attribution: 'Kartverket'
	});

	//adds maps to base layer group
	var baseMaps = {
		"OpenStreetMap": osm_layer,
		//"MapBox": mapbox_layer,
		"Topografisk Norgeskart": kartverk_topo2_layer,
		"Topografisk3 Norgeskart": kartverk_toporaster3_layer,
		"Sea Papirkart": kartverk_sjohovedkart2_layer
		//, "Ionosphere": kartverk_ionosphere_layer
	};

	return baseMaps;
}


function setupOverlayLayers(map) {
	//LEAFLET.DRAW
	var drawnItems = initiateLeafletsDraw(map);
	//LEAFLET.DRAW END 

	//GEOJSON LAYER
	//creates and empty GeoJSON Layer
	var myGeoJLayer = initiateAndGetGeojsonData(map);
	//GEOJSON LAYER END

	var myGeoJLayer_manuelt = initiateGeojsonManuelt(map);

	//test popups - kanskje en if statement for å sjekke om test popup skal være me
	var markers_group = testPopups();
	//

	//Her settes overlay layers sammen i en array
	var overlayMaps = {
		"Test Popups": markers_group,
		"GeoJSON database": myGeoJLayer,
		"GeoJSON lokal": myGeoJLayer_manuelt,
		"Draw": drawnItems
	};

	return overlayMaps;
}

function initiateAndGetGeojsonData(map) {
	//creates and empty GeoJSON Layer
	var myGeoJLayer = L.geoJson().addTo(map);

	//url til GeoJSON data 
	url = 'https://mats.maplytic.no/table/test.geojson';
	//henter data 
	$.get(url, function(data) {
		myGeoJLayer.addData(data);
	});

	return myGeoJLayer;
}


function initiateLeafletsDraw(map) {

	// Initialize the FeatureGroup to store editable layers
	var drawnItems = new L.FeatureGroup();
	map.addLayer(drawnItems);

	// Initialize the draw control and pass it the FeatureGroup of editable layers
	var drawControl = new L.Control.Draw({
		edit: {
			featureGroup: drawnItems
		}
	});

	map.addControl(drawControl);

	//LEAFLET.DRAW events
	map.on('draw:created', function(e) {
		var type = e.layerType,
			layer = e.layer;

		if (type === 'marker') {
			// Do marker specific actions
		}
		// Do whatever else you need to. (save to db, add to map etc)
		drawnItems.addLayer(layer);
	});

	map.on('draw:edited', function() {
		// Update db to save latest changes.
	});

	map.on('draw:deleted', function() {
		// Update db to save latest changes.
	});
	//LEAFLET.DRAW events END 

	return drawnItems;

}

//noen GeoJSON data som er manuelt lagt inn

function initiateGeojsonManuelt(map) {
	//defines a GeoJSON Feature
	var geojsonFeature = {
		"type": "Feature",
		"properties": {
			"name": "Gisketjernet",
			"amenity": "Fin park",
			"popupContent": "Fin park med dyr og treningsmuligheter"
		},
		"geometry": {
			"type": "Point",
			"coordinates": [5.72816, 58.85807]
		}
	};

	//defines an array of GeoJSON lines
	var myLines = [{
		"type": "LineString",
		"coordinates": [
			[5.74337, 58.859],
			[5.72544, 58.8741],
			[5.70252, 58.93378]
		]
	}, {
		"type": "LineString",
		"coordinates": [
			[6.67964, 58.29851],
			[6.09763, 58.52284],
			[5.74264, 58.85794]
		]
	}];

	//style
	var myStyle = {
		"color": "#ff7800",
		"weight": 5,
		"opacity": 0.65
	};

	//creates and empty GeoJSON test Layer
	var myGeoJLayer_manuelt = L.geoJson().addTo(map);

	//adds GeoJSON's to myGeoJLayer
	myGeoJLayer_manuelt.addData(geojsonFeature);
	myGeoJLayer_manuelt.addData(myLines, {
		style: myStyle
	}).addTo(map);


	return myGeoJLayer_manuelt;

}

function testPopups() {
	//POPUPS
	var marker = L.marker([58.85, 5.74]);

	var circle = L.circle([58.8534, 5.7207], 200, {
		color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.5
	});

	var polygon = L.polygon([
		[58.85, 5.73],
		[58.855, 5.74],
		[58.859, 5.735]
	]);

	//more popup stuff
	marker.bindPopup("Jeg er midti byen!");
	circle.bindPopup("Midt i gata");
	polygon.bindPopup("Langs jernbanen");

	//adds popups to layer group
	var markers_group = L.layerGroup([marker, circle, polygon]);

	return markers_group;
}
