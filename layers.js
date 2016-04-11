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

	//Draw & MpltcDB OR Draw
	if(useDrawAndMaplyticDB) {
		var drawnItems = loadDrawAndMaplyticDB(map);
		overlayMaps["Draw"] = drawnItems;
	}
	else if(useLeafletDraw ) {
		var drawnItems = initiateLeafletsDraw(map);
		overlayMaps["Draw"] = drawnItems;
	}
	
	//data som hentes fra mats.maplytic.no
	if(useFylkerDbQ){
		fylkeQuery = setupDbLayer(map);
		overlayMaps["Fylker Mpltc SQL"] = fylkeQuery;
	}
	if(useFylkeGeoJsonData) {
		var FylkeGeoJLayer = loadFylkeGeoJSONs(map);
		overlayMaps["Fylker Mpltc GSN"] = FylkeGeoJLayer;
	}
	if(useKommuneGeoJsonData) {
		var KommuneGeoJLayer = loadKommuneGeoJSONs(map);
		overlayMaps["Komuner Mpltc GSN"] = KommuneGeoJLayer;
	}
	if(useMaplyticTile) {
		var maplyticTiles = maplyticTileApi(map);
		overlayMaps["Fylker Mpltc TL"] = maplyticTiles;
	}
	if(useGrunnkretsTile) {
		var GrunnkretsTile = loadGrunnkretsTile(map);
		overlayMaps["Grunnkrets Mpltc TL"] = GrunnkretsTile;
	}

	//gets JSON data from difi
	if(useHelseStasjonData) {
		var helseStasjonDifi = difiHelsestasjon(map);
		overlayMaps["Helsestasjon Stavanger"] = helseStasjonDifi;
	}
	if(useBarnehageData) {
		var barnehageDifi = difiBarnehage(map);
		overlayMaps["Barnehage Stavanger"] = barnehageDifi;
	}
	if(useToalett) {
		var toalettDifi = difiToalett(map);
		overlayMaps["Offentlig Toalett Stavanger"] = toalettDifi;
	}
	if(useBomstasjon) {
		var bomstasjonDifi = difiBomstasjon(map);
		overlayMaps["Bomstasjoner Norge"] = bomstasjonDifi;
	}

	//NVE
	if(useFloodData){
		setupFlomVarsel(map);
		overlayMaps["Flom Varsel 5.12-15"] = flomDataQuery;
	}

	if(useLandslideData){
		setupJordskredVarsel(map);
		overlayMaps["Jordskred Varsel 5.12-15"] = skredDataQuery;
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
		});	
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


	    fylkeQuery.addData(data, {
	      onEachFeature: onEachFeature
	    });

  	});	

	return fylkeQuery;
}

//-------------------------------------------



//-------------------------------------------
//DIFI DATA
function difiHelsestasjon(map) {
	
	//creates and empty subgroup
	var helsestasjonGroup = L.featureGroup.subGroup(parentCluster);
	
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

			//creates the marker
			var marker = L.marker([breddeGrad, lengdeGrad], {icon: medicineMarker});
			marker.bindPopup("<strong>" + tittel +  "</strong> <br> Adresse:"+ alt);

			//adds marker to sub group
			helsestasjonGroup.addLayer( marker );
		}
	});

	return helsestasjonGroup;
}

function difiBarnehage(map) {
	
	//creates and empty subgroup
	var barnehageGroup = L.featureGroup.subGroup(parentCluster);
	
	//url til JSON data 
	var url = 'https://hotell.difi.no/api/json/stavanger/barnehager?';
	//henter data 
	$.get(url, function(data) {
		//var difiData = JSON.parse(data);
		var difiData = data;
		
		for (i = 0; i < difiData.entries.length; i++) {
			
			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].lengdegrad;
			var breddeGrad = difiData.entries[i].breddegrad;
			var tittel = difiData.entries[i].barnehagens_navn;
			var alt = difiData.entries[i].adresse;


			var marker = L.marker([breddeGrad, lengdeGrad], {icon: kindergartenMarker});
			marker.bindPopup("<strong> Barnehage: </strong><br>" + tittel + "<br> <strong>Adresse:</strong><br> " + alt);
			
			//adds marker to sub group
			barnehageGroup.addLayer( marker );
		}
	});

	return barnehageGroup;
}

function difiToalett(map) {
	
	//creates and empty subgroup
	var toalettGroup = L.featureGroup.subGroup(parentCluster);

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
			tittel = difiData.entries[i].plassering;
			alt = difiData.entries[i].adresse;
			pris = difiData.entries[i].pris;
			
			if(lengdeGrad == "" || breddeGrad == ""){
				continue;
			}

			var marker = L.marker([breddeGrad, lengdeGrad], {icon: restRoomFA});
			marker.bindPopup("<strong> Offentlig Toalett:</strong> "+ tittel +"<br>"+ alt + "<br> Pris: " + pris);

			//adds marker to sub group
			toalettGroup.addLayer(marker);
		}
	});

	return toalettGroup;
}

function difiBomstasjon(map) {
	
	//creates and empty subgroup
	var bomstasjonGroup = L.featureGroup.subGroup(parentCluster);


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
			tittel = difiData.entries[i].navn;
			alt = difiData.entries[i].autopass_beskrivelse;
			
			var marker = L.marker([breddeGrad, lengdeGrad], {icon: payBooth});
			marker.bindPopup("<strong>Bomstasjon:</strong> <br>" + tittel + "<br> Beskrivelse: " + alt);

			//adds marker to sub group
			bomstasjonGroup.addLayer(marker);
		}
	});

	return bomstasjonGroup;
}
//-------------------------------------------

function setupNobilLayer(map){

	var testNobil = L.geoJson();
	nobilApiKey = '8a3fd5aedf9a815606f7b8ff9bdbb0d5'

	jQuery.ajax({
		type: 'GET',
		url: ' https://mats.maplytic.no/proxy/nobil.no/api/server/datadump.php',
		data: {
			'apikey': nobilApiKey,
			//'countrycode': 'NOR',
			//'fromdate': '2012-06-02',
			'format': 'JSON',
			'file': 'false'
			},
		success: function(data){
			testNobil.addData(data);
			nobilDataCopy = data;
		},
		dataType: 'json'
	});

}

//-------------------------------------------
//NVE
function setupFlomVarsel(map) {

	//test data for storm dag 5.12-15
	$.ajax({
	    type: 'GET',
	    url: "https://mats.maplytic.no/proxy/api01.nve.no/hydrology/forecast/flood/v1.0.3/api/CountyOverview/1/2015-12-5/2015-12-5",
	    success: function(data) { 	
	    	flomTest = data;
	    	var kommuneNr = [];

	    	//går gjennom alle komuner
	    	for(i=0;i<flomTest.length;i++){
	    		//hvis fylke har høy nok aktivitets nivå
	    		if( flomTest[i].HighestActivityLevel > 1){
	    			//gå gjennom kommuner i det fylke
	    			for(j=0;j<flomTest[i].MunicipalityList.length;j++){
	    				//hvis kommunen høyt nok aktivitets nivå --> process
	    				if( flomTest[i].MunicipalityList[j].WarningList[0].ActivityLevel > 1){

	    					//kommune nr
	    					kommuneNr[kommuneNr.length] = flomTest[i].MunicipalityList[j].Id;
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


	    					//lagrer data i en 2d array for bruk i getJSON nedenfor
	    					flomKommuneInfo[kommuneNr[kommuneNr.length-1]] = [];
	    					flomKommuneInfo[kommuneNr[kommuneNr.length-1]]["aNivaa"] = aNivaa;
	    					flomKommuneInfo[kommuneNr[kommuneNr.length-1]]["color"] = color;
	    					flomKommuneInfo[kommuneNr[kommuneNr.length-1]]["varselTekst"] = varselTekst;
	    				}
	    			}
	    		}
	    	}

	    	//hvis flomvarsel
	    	if(kommuneNr.length > 0){


		    	//toleranse i ST_Simplify
				var tolerance = 0.01*7/map.getZoom();
				//gets the bound of the initial zoom and position
				initialBounds = map.getBounds();
				neLat = initialBounds.getNorth();
				neLng = initialBounds.getEast();
				swLat = initialBounds.getSouth();
				swLng = initialBounds.getWest();

				//sql query code
		    	var sqlString = 'SELECT navn, komm, ST_Simplify(geom, ' + tolerance + ') AS geom FROM kommuner ';

		    	var sqlFlomKommunerTemp = 'WHERE komm IN (';
		    	//append the rest of the query code
		    	for(i=0;i<kommuneNr.length;i++){

		    		if(i==0){
		    			appendString = kommuneNr[i];
		    		}
		    		else{
		    			appendString = ',' + kommuneNr[i];
		    		}

		    		sqlFlomKommunerTemp = sqlFlomKommunerTemp.concat(appendString);
		    	}
		    	//close kommune array
		    	sqlFlomKommunerTemp = sqlFlomKommunerTemp.concat( ')');

		    	//close sql statement
		    	sqlString = sqlString.concat( sqlFlomKommunerTemp );
		    	sqlString = sqlString.concat( ' AND kommuner.geom && ST_MakeEnvelope(' + swLng + ', ' + swLat + ', ' + neLng + ', ' + neLat + ')' );

		    	//lag URL
		    	var url = 'https://mats.maplytic.no/sql/' + encodeURIComponent(sqlString) + '/out.geojson';

		    	//Hent data
				$.getJSON(url, function(data) {

					for(i=0;i<data.features.length;i++){

						//dårlig quick fix?
						if(data.features[i].properties.komm < 1000){
							kNr = '0' + data.features[i].properties.komm;
						}
						else{
							kNr = data.features[i].properties.komm;
						}

				        data.features[i].properties.beskrivelse = flomKommuneInfo[kNr]["varselTekst"];
					   	data.features[i].properties.color = flomKommuneInfo[kNr]["color"];
					}

					//add it to the layer
				    flomDataQuery.addData(data);


			  	});	
			  	//denne settes på slutten sånn at den kan brukes som
				//en sjekk for å se om setup av dynamisk lag er ferdig.
				sqlFlomKommuner = sqlFlomKommunerTemp;
			}
	    },
	    contentType: "application/json",
	    dataType: 'json'
	});
}

function setupJordskredVarsel(map) {

	//test data for storm dag 5.12-15
	$.ajax({
	    type: 'GET',
	    url: "https://mats.maplytic.no/proxy/api01.nve.no/hydrology/forecast/landslide/v1.0.3/api/CountyOverview/1/2015-12-5/2015-12-5",
	    success: function(data) { 	
	    	flomTest = data;
	    	var kommuneNr = [];

	    	//går gjennom alle komuner
	    	for(i=0;i<flomTest.length;i++){
	    		//hvis fylke har høy nok aktivitets nivå
	    		if( flomTest[i].HighestActivityLevel > 1){
	    			//gå gjennom kommuner i det fylke
	    			for(j=0;j<flomTest[i].MunicipalityList.length;j++){
	    				//hvis kommunen høyt nok aktivitets nivå --> process
	    				if( flomTest[i].MunicipalityList[j].WarningList[0].ActivityLevel > 1){

	    					//kommune nr
	    					kommuneNr[kommuneNr.length] = flomTest[i].MunicipalityList[j].Id;
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


	    					//lagrer data i en 2d array for bruk i getJSON nedenfor
	    					skredKommuneInfo[kommuneNr[kommuneNr.length-1]] = [];
	    					skredKommuneInfo[kommuneNr[kommuneNr.length-1]]["aNivaa"] = aNivaa;
	    					skredKommuneInfo[kommuneNr[kommuneNr.length-1]]["color"] = color;
	    					skredKommuneInfo[kommuneNr[kommuneNr.length-1]]["varselTekst"] = varselTekst;
	    				}
	    			}
	    		}
	    	}

	    	//hvis flomvarsel
	    	if(kommuneNr.length > 0){


		    	//toleranse i ST_Simplify
				var tolerance = 0.01*7/map.getZoom();
				//gets the bound of the initial zoom and position
				initialBounds = map.getBounds();
				neLat = initialBounds.getNorth();
				neLng = initialBounds.getEast();
				swLat = initialBounds.getSouth();
				swLng = initialBounds.getWest();

				//sql query code
		    	var sqlString = 'SELECT navn, komm, ST_Simplify(geom, ' + tolerance + ') AS geom FROM kommuner ';

		    	var sqlSkredKommunerTemp = 'WHERE komm IN (';
		    	//append the rest of the query code
		    	for(i=0;i<kommuneNr.length;i++){

		    		if(i==0){
		    			appendString = kommuneNr[i];
		    		}
		    		else{
		    			appendString = ',' + kommuneNr[i];
		    		}

		    		sqlSkredKommunerTemp = sqlSkredKommunerTemp.concat(appendString);
		    	}
		    	//close kommune array
		    	sqlSkredKommunerTemp = sqlSkredKommunerTemp.concat( ')');

		    	//close sql statement
		    	sqlString = sqlString.concat( sqlSkredKommunerTemp );
		    	sqlString = sqlString.concat( ' AND kommuner.geom && ST_MakeEnvelope(' + swLng + ', ' + swLat + ', ' + neLng + ', ' + neLat + ')' );

		    	//lag URL
		    	var url = 'https://mats.maplytic.no/sql/' + encodeURIComponent(sqlString) + '/out.geojson';

		    	//Hent data
				$.getJSON(url, function(data) {

					for(i=0;i<data.features.length;i++){
						//dårlig quick fix
						if(data.features[i].properties.komm < 1000){
							kNr = '0' + data.features[i].properties.komm;
						}
						else{
							kNr = data.features[i].properties.komm;
						}

				        data.features[i].properties.beskrivelse = skredKommuneInfo[kNr]["varselTekst"];
					   	data.features[i].properties.color = skredKommuneInfo[kNr]["color"];
					}

					//add it to the layer
				    skredDataQuery.addData(data);


			  	});	
			  	//denne settes på slutten sånn at den kan brukes som
				//en sjekk for å se om setup av dynamisk lag er ferdig.
				sqlSkredKommuner = sqlSkredKommunerTemp;
			}
	    },
	    contentType: "application/json",
	    dataType: 'json'
	});
}
//-------------------------------------------




///////////////////////
/////Test/bug ting////
/////////////////////

