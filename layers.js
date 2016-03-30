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


	if(useDrawAndMaplyticDB) {
		var drawnItems = loadDrawAndMaplyticDB(map);
		overlayMaps["Draw"] = drawnItems;
	}
	else
	{
		//leaflet.draw
		if(useLeafletDraw ) {
			//var drawnItems = initiateLeafletsDraw(map);
			var drawnItems = initiateLeafletsDraw(map);
			overlayMaps["Draw"] = drawnItems;
		}
		//gets GeoJSON data from mats.maplytic.no
		if(useMaplyticData ) {
			var myGeoJLayer = initiateAndGetGeojsonData2(map);
			overlayMaps["GeoJSON database"] = myGeoJLayer;
		}
	}
	


	//loads locally stored geoJSONs
	if(useFylkeGeoJsonData) {
		var FylkeGeoJLayer = loadFylkeGeoJSONs(map);
		overlayMaps["Fylker"] = FylkeGeoJLayer;
	}
	if(useKommuneGeoJsonData) {
		var KommuneGeoJLayer = loadKommuneGeoJSONs(map);
		overlayMaps["Komuner"] = KommuneGeoJLayer;
	}
	if(useGrunnkretsGeoJsonData) {
		var GrunnkretsGeoJLayer = loadGrunnkretsGeoJSONs(map);
		overlayMaps["Grunnkretser 100mb"] = GrunnkretsGeoJLayer;
	}



	//gets JSON data from difi
	if(useHelseStasjonData ) {
		var helseStasjonDifi = difiHelsestasjon(map);
		overlayMaps["Helsestasjon"] = helseStasjonDifi;
	}
	if(useBarnehageData ) {
		var barnehageDifi = difiBarnehage(map);
		overlayMaps["Barnehage"] = barnehageDifi;
	}



	//manuelt lagt til GeoJSON data
	if(useManualGeoData ) {
		var myGeoJLayer_manuelt = initiateGeojsonManuelt(map);
		overlayMaps["GeoJSON test"] = myGeoJLayer_manuelt;
	}
	//test popups
	if(useTestPopup ) {
		var markersGroup = testPopups(map);
		overlayMaps["Test Popups"] = markersGroup;
	}

	return overlayMaps;
}

function loadDrawAndMaplyticDB(map) {

	// Initialize the FeatureGroup to store editable layers
	var drawnItems = new L.FeatureGroup();
	map.addLayer(drawnItems);


	// Initialize the draw control and pass it the FeatureGroup of editable layers
	var drawControl = new L.Control.Draw({
		draw : {
	        circle : false
    	},
		edit: {
			featureGroup: drawnItems
		}
	});

	map.addControl(drawControl);



	//creates and empty GeoJSON Layer and adds each layer to drawnItems
	var myGeoJLayer = L.geoJson();
	//url til GeoJSON data
	var url = 'https://mats.maplytic.no/table/test.geojson';
	//henter data 
	$.get(url, function(data) {
		myGeoJLayer = L.geoJson(data, {
	    	onEachFeature: function (feature, layer) {
	    		layer.bindPopup("Gid: " + feature.properties.gid + "<br>" + "Geometry Type: " + feature.geometry.type);  
	    		drawnItems.addLayer(layer);
		    }
		}).addTo(map);	
	});	



	drawEvents(map, drawnItems);

	return drawnItems;
}

//local geoJSON data
function loadFylkeGeoJSONs(map) {

	//creates and empty GeoJSON test Layer
	var FylkeGeoJLayer = L.geoJson();

	$.getJSON('GeoJSON/fylker.geoJSON', function(data) {
		FylkeGeoJLayer.addData(data);
	});

	return FylkeGeoJLayer;

}
function loadKommuneGeoJSONs(map) {

	//creates and empty GeoJSON test Layer
	var KommuneGeoJLayer = L.geoJson();

	$.getJSON('GeoJSON/kommuner.geoJSON', function(data) {
		KommuneGeoJLayer.addData(data);
	});

	return KommuneGeoJLayer;

}
function loadGrunnkretsGeoJSONs(map) {

	//creates and empty GeoJSON test Layer
	var GrunnkretsGeoJLayer = L.geoJson();

	$.getJSON('GeoJSON/grunnkretser.geoJSON', function(data) {
		GrunnkretsGeoJLayer.addData(data);
	});

	return GrunnkretsGeoJLayer;

}



function difiHelsestasjon(map) {
	
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

function difiBarnehage(map) {
	
	//creates and empty GeoJSON Layer
	var barnehageGroup = L.layerGroup().addTo(map);
	
	//var difiData = null;
	var barnehager = [];	
	//url til JSON data 
	var url = 'https://hotell.difi.no/api/json/stavanger/barnehager?';
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
			barnehager[i] = L.marker([breddeGrad, lengdeGrad]);
			barnehager[i].title = tittel;
			barnehager[i].alt = alt;
			
			barnehager[i].bindPopup("<strong> Barnehage: </strong> <br>" + tittel +  " <br>"+ alt);
			
			barnehageGroup.addLayer( barnehager[i] );
		}
	});

	return barnehageGroup;
}


///////////////////
/////Test ting////
/////////////////


//bug: legges ikke inn i myGeoLayer
function initiateAndGetGeojsonData(map) {
	//creates and empty GeoJSON Layer
	var myGeoJLayer = L.geoJson();
	//url til GeoJSON data
	var url = 'https://mats.maplytic.no/table/test.geojson';
	//henter data 
	$.get(url, function(data) {

		myGeoJLayer = L.geoJson(data, {

	    	onEachFeature: function (feature, layer) {
	    		layer.bindPopup("Gid: " + feature.properties.gid + "<br>" + "Geometry Type: " + feature.geometry.type);  
		    }

		}).addTo(map);

		

	});	

	return myGeoJLayer;
}
//bug: får ikke opp popup med informasjon om feature
function initiateAndGetGeojsonData2(map) {
	//creates and empty GeoJSON Layer
	var myGeoJLayer = L.geoJson();

	//url til GeoJSON data 
	var url = 'https://mats.maplytic.no/table/test.geojson';
	//henter data 

	$.getJSON(url, function(data) {

    function onEachFeature(feature, layer) {
  
        layer.bindPopup("Gid: " + feature.properties.gid + "<br>" + "Geometry Type: " + feature.geometry.type);
    } 



    myGeoJLayer.addData(data, {
      onEachFeature: onEachFeature
    });

    myGeoJLayer.addTo(map);
  });	


	return myGeoJLayer;
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


	return myGeoJLayer_manuelt;
}
