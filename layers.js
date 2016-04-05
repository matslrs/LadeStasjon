function setupBaseLayers(map) {

	baseMaps =[];

	//OpenStreetMap layer
	if(useOsmLayer){
		var osm_layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		});
		baseMaps["OpenStreetMap"] = osm_layer;
	}
	//kartverket topografisk kart
	if(useKartverkTopo2Layer){
		var kartverk_topo2_layer = L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo2&zoom={z}&x={x}&y={y}', {
			attribution: 'Kartverket'
		});
		baseMaps["Topografisk Norgeskart"] = kartverk_topo2_layer;
	}
	//kartverket sjøkart kart
	if(useKartverSjoPapirLayer){			 
		var kartverk_sjohovedkart2_layer = L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=sjo_hovedkart2&zoom={z}&x={x}&y={y}', {
			attribution: 'Kartverket'
		});
		baseMaps["Sea Papirkart"] = kartverk_sjohovedkart2_layer;
	}
	//kartverket ionosphere
	if(useKartverkTopo3Layer){			 
		var kartverk_toporaster3_layer = L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=toporaster3&zoom={z}&x={x}&y={y}', {
			attribution: 'Kartverket'
		});
		baseMaps["Topografisk3 Norgeskart"] = kartverk_toporaster3_layer;
	}

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
	

	//data som hentes fra mats.maplytic.no
	if(useMaplyticQuery){
		//defined i html2 head i forsøk på å få styr på 
		dbQueryLayer = setupDbLayer(map);
		overlayMaps["Query test"] = dbQueryLayer;
	}
	if(useFylkeGeoJsonData) {
		var FylkeGeoJLayer = loadFylkeGeoJSONs(map);
		overlayMaps["Fylker"] = FylkeGeoJLayer;
	}
	if(useKommuneGeoJsonData) {
		var KommuneGeoJLayer = loadKommuneGeoJSONs(map);
		overlayMaps["Komuner"] = KommuneGeoJLayer;
	}
	if(useMaplyticTile) {
		var maplyticTiles = maplyticTileApi(map);
		overlayMaps["Tile test"] = maplyticTiles;
	}
	if(useGrunnkretsTile) {
		var GrunnkretsTile = loadGrunnkretsTile(map);
		overlayMaps["Grunnkrets Tile"] = GrunnkretsTile;
	}



	//gets JSON data from difi
	if(useHelseStasjonData) {
		var helseStasjonDifi = difiHelsestasjon(map);
		overlayMaps["Helsestasjon"] = helseStasjonDifi;
	}
	if(useBarnehageData) {
		var barnehageDifi = difiBarnehage(map);
		overlayMaps["Barnehage"] = barnehageDifi;
	}
	if(useToalett) {
		var toalettDifi = difiToalett(map);
		overlayMaps["Offentlig Toalett"] = toalettDifi;
	}
	if(useBomstasjon) {
		var bomstasjonDifi = difiBomstasjon(map);
		overlayMaps["Bomstasjoner"] = bomstasjonDifi;
	}

	//NVE
	if(useFloodData){
		var flomData = dataNorgeFlomvarsel(map);
		overlayMaps["Flomvarsel"] = flomData;
	}

	if(usePoptest){
		var bugPop = buggyPopuptest(map);
		overlayMaps["bugPop"] = bugPop;
	}

	if(usePoptest2){
		var bugPop2 = buggyPopuptest2(map);
		overlayMaps["bugPop2"] = bugPop2;
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

//-------------------------------------------
//Maplytic data
function maplyticTileApi(map) {

	var maplyticTile = L.tileLayer('https://mats.maplytic.no/tile/fylker/{z}/{x}/{y}.png?linewidth=3');

	return maplyticTile;

}
function loadFylkeGeoJSONs(map) {

	//creates and empty GeoJSON test Layer
	var FylkeGeoJLayer = L.geoJson();

	$.getJSON('https://mats.maplytic.no/table/fylker.geojson', function(data) {
		FylkeGeoJLayer.addData(data);
	});

	return FylkeGeoJLayer;

}
function loadKommuneGeoJSONs(map) {

	//creates and empty GeoJSON test Layer
	var KommuneGeoJLayer = L.geoJson();

	$.getJSON('https://mats.maplytic.no/table/kommuner.geojson', function(data) {
		KommuneGeoJLayer.addData(data);
	});

	return KommuneGeoJLayer;

}
function loadGrunnkretsTile(map) {

	GrunnkretsTile = L.tileLayer('https://mats.maplytic.no/tile/grunnkretser/{z}/{x}/{y}.png?linewidth=1');

	return GrunnkretsTile;

}
//må fiksa på layers å layer control her...bugs
function setupDbLayer(map) {

	//gets the bound of the initial zoom and position
	initialBounds = map.getBounds();
	neLat = initialBounds.getNorth();
	neLng = initialBounds.getEast();
	swLat = initialBounds.getSouth();
	swLng = initialBounds.getWest();
	
	//tolerance in ST_Simplify(postgis)
	//funksjonen for tolerance kan finjusteres mye bedre men mer enn ok for nå
	var tolerance = 0.01*7/map.getZoom();

	//url til GeoJSON data 
	var url = 'https://mats.maplytic.no/sql/select%20ST_Simplify(geom%2C%20' + tolerance + ')%20as%20geom%2C%20navn%2C%20fylkesnr%0Afrom%20fylker%0AWHERE%20fylker.geom%20%26%26%20ST_MakeEnvelope(' + swLng + '%2C%20' + swLat + '%2C%20' + neLng + '%2C%20' + neLat +')%3B/out.geojson';
	
	//henter data 
	$.getJSON(url, function(data) {

	    function onEachFeature(feature, layer) {
	  
	        layer.bindPopup("Navn: " + feature.properties.navn + "<br>" + "Fylkes nr: " + feature.geometry.fylkesnr);
	        console.log(feature.properties.navn);
	    } 


	    dbQueryLayer.addData(data, {
	      onEachFeature: onEachFeature
	    });

	    //dbQueryLayer.addTo(map);
  	});	

	eventDbQueryUpdates(map);

	return dbQueryLayer;
}

//-------------------------------------------



//-------------------------------------------
//DIFI DATA
function difiHelsestasjon(map) {
	
	//creates and empty GeoJSON Layer
	var helsestasjonGroup = L.layerGroup();
	
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
			
			//Lager marker for feature
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
	var barnehageGroup = L.layerGroup();
	
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
			tittel = difiData.entries[i].barnehagens_navn;
			alt = difiData.entries[i].adresse;
			
			//Lager marker for feature
			barnehager[i] = L.marker([breddeGrad, lengdeGrad]);
			barnehager[i].title = tittel;
			barnehager[i].alt = alt;
			
			barnehager[i].bindPopup("<strong>" + tittel +  "</strong> <br>"+ alt);
			
			barnehageGroup.addLayer( barnehager[i] );
		}
	});

	return barnehageGroup;
}

function difiToalett(map) {
	
	//creates and empty GeoJSON Layer
	var toalettGroup = L.layerGroup();
	
	//var difiData = null;
	var offentligToalett = [];	
	//url til JSON data 
	var url = 'https://hotell.difi.no/api/json/stavanger/offentligetoalett?';
	//henter data 
	$.get(url, function(data) {
		//var difiData = JSON.parse(data);
		var difiData = data;
		
		for (i = 0; i < difiData.entries.length; i++) {
			
			//Finner data som skal brukes
			lengdeGrad = difiData.entries[i].longitude;
			breddeGrad = difiData.entries[i].latitude;
			tittel = difiData.entries[i].plassering + " Toalett";
			alt = difiData.entries[i].adresse;
			
			if(lengdeGrad == "" || breddeGrad == ""){
				continue;
			}

			//Lager marker for feature
			offentligToalett[i] = L.marker([breddeGrad, lengdeGrad]);
			offentligToalett[i].title = tittel;
			offentligToalett[i].alt = alt;
			
			offentligToalett[i].bindPopup("<strong>" + tittel +  "</strong> <br>"+ alt);
			
			toalettGroup.addLayer( offentligToalett[i] );
		}
	});

	return toalettGroup;
}


function difiBomstasjon(map) {
	
	//creates and empty GeoJSON Layer
	var bomstasjonGroup = L.layerGroup().addTo(map);
	
	//var difiData = null;
	var bomstasjon = [];	
	//url til JSON data 
	var url = 'https://hotell.difi.no/api/json/vegvesen/bomstasjoner?';
	//henter data 
	$.get(url, function(data) {
		//var difiData = JSON.parse(data);
		var difiData = data;
		
		for (i = 0; i < difiData.entries.length; i++) {
			
			//Finner data som skal brukes
			lengdeGrad = difiData.entries[i].long;
			breddeGrad = difiData.entries[i].lat;
			tittel = "Bomstasjon: " + difiData.entries[i].navn;
			alt = difiData.entries[i].autopass_beskrivelse;
			
			//Lager marker for feature
			bomstasjon[i] = L.marker([breddeGrad, lengdeGrad]);
			bomstasjon[i].title = tittel;
			bomstasjon[i].alt = alt;
			
			bomstasjon[i].bindPopup("<strong>" + tittel +  "</strong> <br>"+ alt);
			
			bomstasjonGroup.addLayer( bomstasjon[i] );
		}
	});

	return bomstasjonGroup;
}
//-------------------------------------------



//-------------------------------------------
//NVE
function dataNorgeFlomvarsel(map) {

	var flomGeoLayer = L.geoJson(null, {
    style: function (feature) {
        return {color: feature.properties.color};
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup("<strong>" + feature.properties.navn +  "</strong> <br>" + "Varsel: " + feature.properties.beskrivelse);
    }
});



	//test data for storm dag 5.12-15
	$.ajax({
	    type: 'GET',
	    url: "https://mats.maplytic.no/proxy/api01.nve.no/hydrology/forecast/flood/v1.0.3/api/CountyOverview/1/2015-12-5/2015-12-5",
	    success: function(data) { 	
	    	console.log('Flomvarsel success'); 
	    	flomTest = data;
	    	var kommuneNr = [];
	    	var kommuneInfo = [][];

	    	//går gjennom alle komuner
	    	for(i=0;i<flomTest.length;i++){
	    		//hvis fylke har høy nok aktivitets nivå
	    		if( flomTest[i].HighestActivityLevel > 1){
	    			//gå gjennom kommuner i det fylke
	    			for(j=0;j<flomTest[i].MunicipalityList.length;j++){
	    				//hvis kommunen høyt nok aktivitets nivå --> process
	    				if( flomTest[i].MunicipalityList[j].WarningList[0].ActivityLevel > 1){

	    					//kommune nr
	    					kommuneNr[kommuneNr.legnth] = flomTest[i].MunicipalityList[j].Id;

	    					//DATA SOM TRENGS TIL LAYER
	    					//aktivitets nivå
	    					aNivaa = flomTest[i].MunicipalityList[j].WarningList[0].ActivityLevel;
	    					//farge
	    					if(aNivaa==2){
	    						color = '#FFFF00';
	    					}
	    					else if(aNivaa==3){
	    						color = '#ffa500';
	    					}
	    					else{
	    						color = '#FF0000';
	    					}
	    					//beskrivelse
	    					varselTekst = flomTest[i].MunicipalityList[j].WarningList[0].MainText;


	    					kommuneInfo[kommuneNr[kommuneNr.length-1]]["aNivaa"] = aNivaa;
	    					kommuneInfo[kommuneNr[kommuneNr.length-1]]["color"] = color;
	    					kommuneInfo[kommuneNr[kommuneNr.length-1]]["varselTekst"] = varselTekst;

	    				// 	var url = 'https://mats.maplytic.no/sql/select%20navn%2C%20ST_Simplify(geom%2C%20' + tolerance + ')%20as%20geom%0Afrom%20kommuner%20%0Awhere%20komm%20%3D%20' + komm + '/out.geojson';

	    				// 	$.getJSON(url, function(data) {

						   //      data.features[0].properties.beskrivelse = varselTekst;
							  //  	data.features[0].properties.color = color;

							  //   flomGeoLayer.addData(data);


						  	// });	

	    				}
	    			}
	    		}
	    	}

	    	if(kommuneNr.length > 0){
		    	//gjør DB query her

		    	//toleranse i ST_Simplify
				tolerance = 0.01;
				//sql query code
		    	var sqlString = 'SELECT navn, komm, ST_Simplify(geom,' + tolerance + ') as geom FROM kommuner WHERE';
		    	//append the rest of the query code
		    	for(i=0;i<kommuneNr.length;i++){
		    		if(i==0){
		    			appendString = ' komm = ' + kommuneNr[i];
		    		}
		    		else{
		    			appendString = ' OR komm = ' + kommuneNr[i];
		    		}

		    		sqlString = sqlString.concat(appendString);
		    	}

		    	var url = 'https://mats.maplytic.no/sql/' + encodeURIComponent(sqlString) + '/out.geojson';

				$.getJSON(url, function(data) {

					for(i=0;i<data.features.length;i++){
				        data.features[i].properties.beskrivelse = kommuneInfo[data.features[i].properties.komm]["varselTekst"];
					   	data.features[i].properties.color = kommuneInfo[data.features[i].properties.komm]["color"];
					}

					//add it to the layer
				    flomGeoLayer.addData(data);


			  	});	
			}

	    },
	    contentType: "application/json",
	    dataType: 'json'
	});


	// //CountySummary
	// $.ajax({
	//     type: 'GET',
	//     url: "https://mats.maplytic.no/proxy/api01.nve.no/hydrology/forecast/flood/v1.0.2/api/CountySummary/1",
	//     success: function(data) { 	
	//     	console.log('Flomvarsel success'); 
	//     	countySummary = data;
	//     },
	//     contentType: "application/json",
	//     dataType: 'json'
	// });

	//CountyOverview
	$.ajax({
	    type: 'GET',
	    url: "https://mats.maplytic.no/proxy/api01.nve.no/hydrology/forecast/flood/v1.0.2/api/CountyOverview/1",
	    success: function(data) { 	
	    	console.log('Flomvarsel success'); 
	    	countyOverview = data;
	    },
	    contentType: "application/json",
	    dataType: 'json'
	});

	// //EmergencyWarning
	// $.ajax({
	//     type: 'GET',
	//     url: "https://mats.maplytic.no/proxy/api01.nve.no/hydrology/forecast/flood/v1.0.2/api/EmergencyWarning/1",
	//     success: function(data) { 	
	//     	console.log('Flomvarsel success'); 
	//     	emergencyWarning = data;
	//     },
	//     contentType: "application/json",
	//     dataType: 'json'
	// });

	// //MapComments
	// $.ajax({
	//     type: 'GET',
	//     url: "https://mats.maplytic.no/proxy/api01.nve.no/hydrology/forecast/flood/v1.0.2/api/MapComments/1",
	//     success: function(data) { 	
	//     	console.log('Flomvarsel success'); 
	//     	mapComments = data;
	//     },
	//     contentType: "application/json",
	//     dataType: 'json'
	// });




	// //EmergencyWarning
	// $.ajax({
	//     type: 'GET',
	//     url: "https://mats.maplytic.no/proxy/api01.nve.no/hydrology/forecast/flood/v1.0.2/api/EmergencyWarning/1",
	//     success: function(data) { 	
	//     	console.log('Flomvarsel success'); 
	//     	emergencyWarning2 = data;
	//     },
	//     contentType: "application/json",
	//     dataType: 'json'
	// });


	return flomGeoLayer;

}
//-------------------------------------------




///////////////////////
/////Test/bug ting////
/////////////////////


//bug: legges ikke inn i myGeoLayer
function buggyPopuptest(map) {
	//creates and empty GeoJSON Layer
	var testGeolayer = L.geoJson();
	//url til GeoJSON data
	var url = 'https://mats.maplytic.no/table/test.geojson';
	//henter data 
	$.get(url, function(data) {

		testGeolayer = L.geoJson(data, {

	    	onEachFeature: function (feature, layer) {
	    		layer.bindPopup("Gid: " + feature.properties.gid + "<br>" + "Geometry Type: " + feature.geometry.type);  
		    }

		});

		testGeolayer.addTo(map);

	});	

	return testGeolayer;
}


//bug: får ikke opp popup med informasjon om feature
function buggyPopuptest2(map) {
	//creates and empty GeoJSON Layer
	var testGeolayer2 = L.geoJson(null, {
    style: function (feature) {
        return {color: '#FF00FF'};
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup("Gid: " + feature.properties.gid + "<br>" + "Geometry Type: " + feature.geometry.type);
    }
});

	//url til GeoJSON data 
	var url = 'https://mats.maplytic.no/table/test.geojson';
	//henter data 

	$.getJSON(url, function(data) {

	    // function onEachFeature(feature, layer) {
	  
	    //     layer.bindPopup("Gid: " + feature.properties.gid + "<br>" + "Geometry Type: " + feature.geometry.type);
	    // } 

	    testGeolayer2.addData(data).addTo(map);

  });	


	return testGeolayer2;
}

