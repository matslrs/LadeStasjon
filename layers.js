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
	var kartverk_toporaster3_layer = L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=toporaster3&zoom={z}&x={x}&y={y}', {
		attribution: 'Kartverket'
	});

	//adds maps to base layer group
	var baseMaps = {
		"OpenStreetMap": osm_layer,
		"Topografisk Norgeskart": kartverk_topo2_layer,
		"Topografisk3 Norgeskart": kartverk_toporaster3_layer,
		"Sea Papirkart": kartverk_sjohovedkart2_layer
	};

	return baseMaps;
}


function setupOverlayLayers(map) {

	var overlayMaps = [];

	//leaflet.draw
	if(useLeafletDraw ) {
		var drawnItems = initiateLeafletsDraw(map);
		overlayMaps["Draw"] = drawnItems;
	}
	//gets GeoJSON data from mats.maplytic.no
	if(useMaplyticData ) {
		var myGeoJLayer = initiateAndGetGeojsonData(map);
		overlayMaps["GeoJSON database"] = myGeoJLayer;
	}
	//loads locally stored geoJSONs
	if(useLocalGeoJsonData ) {
		var myLocalGeoJLayer = loadLocalGeoJSONs(map);
		overlayMaps["GeoJSON local"] = myLocalGeoJLayer;
	}	
	//gets JSON data from difi
	if(useHelseStasjonData ) {
		var helseStasjonDifi = difiDataSett(map);
		overlayMaps["Helsestasjon difi"] = helseStasjonDifi;
	}
	//manuelt lagt til GeoJSON data
	if(useManualGeoData ) {
		var myGeoJLayer_manuelt = initiateGeojsonManuelt(map);
		overlayMaps["GeoJSON test"] = myGeoJLayer_manuelt;
	}
	//test popups - kanskje en if statement for å sjekke om test popup skal være me
	if(useTestPopup ) {
		var markersGroup = testPopups(map);
		overlayMaps["Test Popups"] = markersGroup;
	}

	if( enableSearching )
	{
		mymap.addControl( new L.Control.Search({
			layer: myGeoJLayer_manuelt,
			propertyName: 'popupContent',
		}) );
	}


	/*//Her settes overlay layers sammen i en array
	var overlayMaps = {
		"Test Popups": markersGroup,
		"GeoJSON database": myGeoJLayer,
		//"GeoJSON local": myLocalGeoJLayer,
		"GeoJSON test": myGeoJLayer_manuelt,
		//"Helsestasjon difi": helseStasjonDifi,
		"Draw": drawnItems
	};*/

	return overlayMaps;
}

function initiateAndGetGeojsonData(map) {
	//creates and empty GeoJSON Layer
	var myGeoJLayer = L.geoJson().addTo(map);

	//url til GeoJSON data 
	var url = 'https://mats.maplytic.no/table/test.geojson';
	//henter data 
	$.get(url, function(data) {
		myGeoJLayer.addData(data);

		for( i=0; i<myGeoJLayer.lentgh; i++ )
		{
			myGeoJLayer[i].bindPopup("<strong> Dette er nr " + i +  "</strong>");
		}

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

//local geoJSON data
function loadLocalGeoJSONs(map) {

	//creates and empty GeoJSON test Layer
	var myLocalGeoJLayer = L.geoJson();

	$.getJSON('localJSON/abas/fylker.geoJSON', function(data) {

  //adds data to myLocalGeoJLayer
	myLocalGeoJLayer.addData(data);

});

	return myLocalGeoJLayer;

}

//noen GeoJSON data som er manuelt lagt inn
function initiateGeojsonManuelt(map) {
	//defines a GeoJSON Feature
	var geojsonFeatures = 
	{
  		"type": "FeatureCollection",
  		"features": [
			{
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
			},
			{
				"type": "Feature",
				"properties": {
					"name": "Dalsnuten",
					"amenity": "God utsik!",
					"popupContent": "Fin gaatur og veldig god utsikt."
				},
				"geometry": {
					"type": "Point",
					"coordinates": [5.78664, 58.89358]
				}
			}
		]
	};

	

	//creates and empty GeoJSON test Layer
	var myGeoJLayer_manuelt = L.geoJson().addTo(map);
	//adds GeoJSON's to myGeoJLayer
	myGeoJLayer_manuelt.addData(geojsonFeatures);

	//forsøk på å få opp popup content on Lclick
	//onEachFeature(geojsonFeatures, myGeoJLayer_manuelt)

	return myGeoJLayer_manuelt;

}

function difiDataSett(map) {
	
	//creates and empty GeoJSON Layer
	var helsestasjonGroup = L.layerGroup().addTo(map);
	
	//var difiData = null;
	var helsestasjoner = [];	
	//url til JSON data 
	var url = 'https://hotell.difi.no/api/json/stavanger/helsestasjoner?';
	//henter data 
	$.get(url, function(data) {
		//var difiData = JSON.parse(data);
		var difiData = data;
		
		for (i = 0; i < difiData.entries.length; i++) {
			
			//Finner data som skal brukes
			lengdeGrad = difiData.entries[i].lengdegrad;
			breddeGrad = difiData.entries[i].breddegrad;
			tittel = difiData.entries[i].navn;
			alt = difiData.entries[i].adresse;
			
			//Lager marker for helsestasjonen
			helsestasjoner[i] = L.marker([breddeGrad, lengdeGrad]);
			helsestasjoner[i].title = tittel;
			helsestasjoner[i].alt = alt;
			
			helsestasjoner[i].bindPopup("<strong>" + tittel +  "</strong> <br>"+ alt);
			
			helsestasjonGroup.addLayer( helsestasjoner[i] );
		}
		
		
	});

	return helsestasjonGroup;
}

function testPopups(map) {
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
	var markers_group = L.layerGroup([marker, circle, polygon]).addTo(map);

	return markers_group;
}
