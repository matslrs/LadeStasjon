function setupBaseLayers(map) {

	baseMaps =[];

	//OpenStreetMap layer
	var osm_layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	});
	baseMaps["OpenStreetMap"] = osm_layer;

	//Norges Grunnkart Graatone
	var kartverk_graatone_layer = L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart_graatone&zoom={z}&x={x}&y={y}', {
		attribution: 'Kartverket'
	});
	baseMaps["Norgeskart Gråtone"] = kartverk_graatone_layer;

	//kartverket topografisk kart
	var kartverk_topo2_layer = L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo2&zoom={z}&x={x}&y={y}', {
		attribution: 'Kartverket'
	});
	baseMaps["Topografisk Norgeskart"] = kartverk_topo2_layer;

	//kartverket sjøkart kart		 
	var kartverk_sjohovedkart2_layer = L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=sjo_hovedkart2&zoom={z}&x={x}&y={y}', {
		attribution: 'Kartverket'
	});
	baseMaps["Sjø Papirkart"] = kartverk_sjohovedkart2_layer;

	//kartverket ionosphere	 
	var kartverk_toporaster3_layer = L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=toporaster3&zoom={z}&x={x}&y={y}', {
		attribution: 'Kartverket'
	});
	baseMaps["Topografisk3 Norgeskart"] = kartverk_toporaster3_layer;


	// var googlehybrid = new L.Google('HYBRID');
	// baseMaps["Google Maps Hybrid"] = googlehybrid;

	return baseMaps;
}

function setupOverlayLayers(map) {
	//Draw & MpltcDB OR Draw
	// if(useDrawAndMaplyticDB) {
	// 	var drawnItems = loadDrawAndMaplyticDB(map);
	// 	overlayMaps["Draw"] = drawnItems;
	// }
	// else if(useLeafletDraw ) {
	// 	var drawnItems = initiateLeafletsDraw(map);
	// 	overlayMaps["Draw"] = drawnItems;
	// }
	var overlayMapsDummy = [];
	
	if(useRealTimeNobilLayer){
		//overlayMaps[" <i class='fa fa-car' aria-hidden='true'></i> Ladestasjoner Real Time"] = streamNobil;
		overlayMaps["layerLadeAvailable"] 	= streamNobilAvailable;
		overlayMaps["layerLadeOccupied"] 	= streamNobilOccupied;
	}
	if(useStaticNobilLayer){
		overlayMaps["layerLadeStatisk"] = staticNobil;
	}
	if(useRealTimeNobilLayer){
		overlayMaps["layerLadeError"] 		= streamNobilError;
		overlayMaps["layerLadeUnknown"] 	= streamNobilUnknown;
	}

	var FylkeGeoJLayer = loadFylkeGeoJSONs(map);
	overlayMaps["fylkeBorder"] = FylkeGeoJLayer;

	var KommuneGeoJLayer = loadKommuneGeoJSONs(map);
	overlayMaps["municipalityBorder"] = KommuneGeoJLayer;

	var maplyticTiles = maplyticTileApi(map);
	overlayMaps["fylkeBorderv2"] = maplyticTiles;

	var GrunnkretsTile = loadGrunnkretsTile(map);
	overlayMaps["grunnkretsBorder"] = GrunnkretsTile;

	var sykkelNettNordJæren = sykkelNett(map);
	overlayMaps["bicycleNetwork"] = sykkelNettNordJæren;

	var turnettStavanger = turNett(map);
	overlayMaps["walkingTrail"] = turnettStavanger;

	var bydelStavanger = byDelStavanger(map);
	overlayMaps["stavangerDistricts"] = bydelStavanger;

	var skoleGrenserStavanger = getSkoleGrenserStavanger(map);
	overlayMaps["schoolBordersStavanger"] = skoleGrenserStavanger;

	var vinterBeredskapStavanger = getVinterBeredskapStavanger(map);
	overlayMaps["winterPreperation"] = vinterBeredskapStavanger;

	var helseStasjonDifi = difiHelsestasjon(map);
	overlayMaps["healthStationLayer"] = helseStasjonDifi;

	var helseByggDifi = difiHelseBygg(map);
	overlayMaps["healthBuildingLayer"] = helseByggDifi;

	var kommunaleByggSavanger = openStavangerKommunaleBygg(map);
	overlayMaps["municipalityBuildingStavanger"] = kommunaleByggSavanger;

	var barnehageDifi = difiBarnehage(map);
	overlayMaps["kindergartenStavanger"] = barnehageDifi;

	var toalettDifi = difiToalett(map);
	overlayMaps["toiletLayer"] = toalettDifi;

	var miljoStasjonDifi = difiMiljoStasjon(map);
	overlayMaps["enviornmentStationLayer"] = miljoStasjonDifi;

	var utsiktDifi = difiUtsiktsPunkt(map);
	overlayMaps["outlookArea"] = utsiktDifi;

	var gravlundDifi = difiGravlunder(map);
	overlayMaps["cemeteryStavanger"] = gravlundDifi;

	var trosBygningDifi = difiTrosBygning(map);
	overlayMaps["faithBuildingStavanger"] = trosBygningDifi;

	var badePlassDifi = difiBadePlass(map);
	overlayMaps["swimmingArea"] = badePlassDifi;

	var lekePlassDifi = difiLekeplass(map);
	overlayMaps["playGround"] = lekePlassDifi;

	var utleieLokal = difiUtleielokaler(map);
	overlayMaps["rentingSpaceGjesdal"] = utleieLokal;

	var barnehageGjesdal = difiBarnehageGjesdal(map);
	overlayMaps["kindergartenGjesdal"] = barnehageGjesdal;

	var grunnskoleGjesdal = difiSkoleGjesdal(map);
	overlayMaps["schoolGjesdal"] = grunnskoleGjesdal;

	var grillplassGjesdal = openStavangerGrillGjesdal(map);
	overlayMaps["grillingArea"] = grillplassGjesdal;

	var fiskeplassGjesdal = openStavangerFiskeGjesdal(map);
	overlayMaps["fishingArea"] = fiskeplassGjesdal;

	var bomstasjonDifi = difiBomstasjon(map);
	overlayMaps["layerBomstasjon"] = bomstasjonDifi;

	var pickupPointsBring = bringPickupPoints(map);
	overlayMaps["bringPickup"] = pickupPointsBring;

	//NVE
	if(useFloodData){
		setupFlomVarsel(map);
		overlayMaps["floodForecast"] = flomDataQuery;
	}
	if(useLandslideData){
		setupJordskredVarsel(map);
		overlayMaps["landslideForecast"] = skredDataQuery;
	}

	//weatehr
	var værData = weatherData(map);
	overlayMaps["weatherForecasts"] = værData;

	var værDataPost = weatherDataPostCode(map);
	overlayMaps["weatherForecastsPostal"] = værDataPost;


	return overlayMapsDummy;
}

function weatherData(map){
	var weather = L.featureGroup.subGroup(parentCluster);

	$.getJSON("weatherPlaces.json", function(json) {
	    //console.log(json); // this will show the info in firebug console

		var data = json;	
		for (var i = 0; i < data.length; i++) {
			if(data[i].Prioritet < 30){
				//Finner data som skal brukes
				var lengdeGrad = data[i].Lon;
				var breddeGrad = data[i].Lat;
				if(isNaN(lengdeGrad) || isNaN(breddeGrad)){
					console.log("entry " + i + " have NaN as Lat/Lon");
				}
				var tittel = data[i].Stadnamn;
				var type = data[i].Stadtypebokmål;
				var link = data[i].Bokmål;
				var link = link.replace("http://www.", "https://mats.maplytic.no/proxy?url=https://www."); 

				var marker = L.marker([breddeGrad, lengdeGrad], {icon: sunIcon});
				marker.bindPopup("<strong>Været for "+ tittel +"</strong> <br> Type sted: "+ type + "<br><br>");
				marker.weatherLink = link;
				marker.timeUpdated = 0;
				marker.on('click', weatherClick);

				//adds marker to sub group
				weather.addLayer(marker);
			}
		}
	});

	return weather;
}

function weatherClick(e){
	var date = new Date();
	var time = date.getTime(); 
	//if more than 10 min since last update for this marker, allow a new update.
	if(time>e.target.timeUpdated + 600000){
		console.log("requesting updated weater forecast!");
		e.target.timeUpdated = time;
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
		  readWeatherForecast(xhttp, e.target);
		}
		};
		xhttp.open("GET", e.target.weatherLink, true);
		xhttp.send();
	}
}

function readWeatherForecast(xml, marker){
	var xmlDoc = xml.responseXML;
	var popContent = marker.getPopup().getContent();
	var x = xmlDoc.getElementsByTagName("text");
	for (var i = 0; i <x.length; i++) { 
	    popContent += "<br><strong>" +
	    x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue +
	    "</strong><br>" +
	    x[i].getElementsByTagName("body")[0].childNodes[0].nodeValue +
	    "<br><br>";
  	}
  	marker.getPopup().setContent(popContent);
}

function weatherDataPostCode(map){
	var weatherPost = L.featureGroup.subGroup(parentCluster);

	$.getJSON("weatherPostCode.json", function(json) {
	    //console.log(json); // this will show the info in firebug console

		var data = json;	
		for (var i = 0; i < data.length; i++) {
			//Finner data som skal brukes
			var lengdeGrad = data[i].Lon;
			var breddeGrad = data[i].Lat;
			if(isNaN(lengdeGrad) || isNaN(breddeGrad)){
				console.log("entry " + i + " have NaN as Lat/Lon");
			}
			var tittel = data[i].Poststad;
			var postNr = data[i].Postnr;
			var link = data[i].Bokmål;
			var link = link.replace("http://www.", "https://mats.maplytic.no/proxy?url=https://www."); 

			var marker = L.marker([breddeGrad, lengdeGrad], {icon: sunIcon});
			marker.bindPopup("<strong>Været for "+ tittel +"</strong> <br> Post Nr: "+ postNr + "<br><br>");
			marker.weatherLink = link;
			marker.timeUpdated = 0;
			marker.on('click', weatherClick);

			//adds marker to sub group
			weatherPost.addLayer(marker);
		}
	});

	return weatherPost;
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

function sykkelNett(map) {

	//creates and empty GeoJSON test Layer
	var sykkelNettGeoLayer = L.geoJson(); 

	//$.getJSON('https://mats.maplytic.no/proxy/open.stavanger.kommune.no/dataset/0f0e037e-b5e8-453f-97ca-8ae9be7e523c/resource/4695328a-5857-434d-86ab-97d9acbdb69c/download/cuserssk5017717downloadssykkelnettkartnord-jaeren2016.json', function(data) {
	$.getJSON('https://open.stavanger.kommune.no/dataset/0f0e037e-b5e8-453f-97ca-8ae9be7e523c/resource/7fa800bd-c094-4051-8750-e05e4b0f47ed/download/sykkelnettkartnord-jaeren2016.json', function(data) {
		sykkelNettGeoLayer.addData(data);
	});

	return sykkelNettGeoLayer;

}

function turNett(map) {

	//creates and empty GeoJSON test Layer
	var turNettGeoLayer = L.geoJson();

	$.getJSON('https://open.stavanger.kommune.no/dataset/bf627d4a-f115-41a2-82b9-d19de3cd5414/resource/e1fe43ad-c4b6-4e12-a3b4-6e864c57f96a/download/turveger.json', function(data) {
		turNettGeoLayer.addData(data);
	});

	return turNettGeoLayer;

}

function byDelStavanger(map) {

	//creates and empty GeoJSON test Layer
	var bydelStavangerLayer = L.geoJson();

	$.getJSON('https://open.stavanger.kommune.no/dataset/23fef01e-c729-43b2-8fb3-8e127f04b286/resource/cd32c3c2-4db8-4b38-a42e-9d944a1ae40d/download/bydeler.json', function(data) {
		bydelStavangerLayer.addData(data);
	});

	return bydelStavangerLayer;

}

function getSkoleGrenserStavanger(map) {

	//creates and empty GeoJSON test Layer
	var skoleGrenserStavangerLayer = L.geoJson();

	$.getJSON('https://open.stavanger.kommune.no/dataset/1d0442c1-4521-41b8-bcce-f08d7930b9e5/resource/263b665b-d937-44e9-a3a5-07e68da2ac9a/download/skolekretser.json', function(data) {
		skoleGrenserStavangerLayer.addData(data);
	});

	return skoleGrenserStavangerLayer;

}

function getVinterBeredskapStavanger(map) {

	//creates and empty GeoJSON test Layer
	var vinterBeredskapStavangerLayer = L.geoJson();

	$.getJSON('https://open.stavanger.kommune.no/dataset/1b85ba90-b675-4831-87fd-4d0de893df18/resource/0982be76-168e-4932-99b0-6d72740622cb/download/vinterberedskap.json', function(data) {
		vinterBeredskapStavangerLayer.addData(data);
	});

	return vinterBeredskapStavangerLayer;

}



function loadGrunnkretsTile(map) {

	GrunnkretsTile = L.tileLayer('https://mats.maplytic.no/tile/grunnkretser/{z}/{x}/{y}.png?linewidth=1');

	return GrunnkretsTile;

}

function setupDbLayer(map) {
	fylkeQuery = L.geoJson();
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
		
		for (var i = 0; i < difiData.entries.length; i++) {	

			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].lengdegrad;
			var breddeGrad = difiData.entries[i].breddegrad;
			var tittel = difiData.entries[i].navn;
			var alt = difiData.entries[i].adresse;

			//creates the marker
			var marker = L.marker([breddeGrad, lengdeGrad], {icon: medicineMarker});
			marker.bindPopup("<strong>" + tittel +  "</strong> <br> Adresse:"+ alt);

			//adds marker to sub group
			helsestasjonGroup.addLayer( marker );
		}
	});

	return helsestasjonGroup;
}

function difiHelseBygg(map) {
	
	//creates and empty subgroup
	var helseByggGroup = L.featureGroup.subGroup(parentCluster);
	
	//url til JSON data 
	var url = 'https://hotell.difi.no/api/json/stavanger/helsebygg?';
	
	//henter data 
	$.get(url, function(data) {
		//var difiData = JSON.parse(data);
		var difiData = data;
		
		for (var i = 0; i < difiData.entries.length; i++) {	

			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].longitude;
			var breddeGrad = difiData.entries[i].latitude;
			var tittel = difiData.entries[i].navn;
			var alt = difiData.entries[i].adresse;

			//creates the marker
			var marker = L.marker([breddeGrad, lengdeGrad], {icon: hospitalIcon});
			marker.bindPopup("<strong>" + tittel +  "</strong> <br> Adresse:"+ alt);

			//adds marker to sub group
			helseByggGroup.addLayer( marker );
		}
	});

	return helseByggGroup;
}

function difiBarnehage(map) {
	
	//creates and empty subgroup
	var barnehageGroup = L.featureGroup.subGroup(parentCluster);
	
	//url til JSON data 
	var url = 'https://hotell.difi.no/api/json/stavanger/barnehager?';
	var page = 1;
	//henter data 
	$.get(url, function(data) {
		//var difiData = JSON.parse(data);
		var difiData = data;
		
		for (var i = 0; i < difiData.entries.length; i++) {
			
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

		//Difi only gives the first 100 entries, if there are more they need to be requested on a separete url
		page++;
		var pages = difiData.pages;
		while(page<=pages){
			var url = 'https://hotell.difi.no/api/json/stavanger/barnehager?page=' + page;
			$.get(url, function(data) {
				//var difiData = JSON.parse(data);
				var difiData = data;
				
				for (var i = 0; i < difiData.entries.length; i++) {
					
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

			page++;
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
		
		for (var i = 0; i < difiData.entries.length; i++) {
			
			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].longitude;
			var breddeGrad = difiData.entries[i].latitude;
			var tittel = difiData.entries[i].plassering;
			var alt = difiData.entries[i].adresse;
			var pris = difiData.entries[i].pris;
			
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

function difiMiljoStasjon(map) {
	
	//creates and empty subgroup
	var miljoStasjoner = L.featureGroup.subGroup(parentCluster);

	//url til JSON data 
	var url = 'https://hotell.difi.no/api/json/stavanger/miljostasjoner?';
	//henter data 
	$.get(url, function(data) {
		//var difiData = JSON.parse(data);
		var difiData = data;
		
		for (var i = 0; i < difiData.entries.length; i++) {
			
			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].longitude;
			var breddeGrad = difiData.entries[i].latitude;
			var tittel = difiData.entries[i].navn;
			var glassMetal = difiData.entries[i].glass_metall;
			var plast = difiData.entries[i].plast;
			var tekstilSko = difiData.entries[i].tekstil_sko;
			
			if(lengdeGrad == "" || breddeGrad == ""){
				continue;
			}

			var marker = L.marker([breddeGrad, lengdeGrad], {icon: miljoStasjon});
			marker.bindPopup("<strong> Miljøstasjon:</strong> "+ tittel +"<br> Glass og metal: "+ glassMetal + "<br> Plast: " + plast + "<br> Tekstil og sko: " + tekstilSko);

			//adds marker to sub group
			miljoStasjoner.addLayer(marker);
		}
	});

	return miljoStasjoner;
}

function difiUtsiktsPunkt(map) {
	
	//creates and empty subgroup
	var utsiktsPunkt = L.featureGroup.subGroup(parentCluster);


	//url til JSON data 
	var url = 'https://hotell.difi.no/api/json/stavanger/utsiktspunkt?';
	//henter data 
	$.get(url, function(data) {
		//var difiData = JSON.parse(data);
		var difiData = data;
		
		for (var i = 0; i < difiData.entries.length; i++) {
			
			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].longitude;
			var breddeGrad = difiData.entries[i].latitude;
			var tittel = difiData.entries[i].name;
			var address = difiData.entries[i].adressenavn;
			
			var marker = L.marker([breddeGrad, lengdeGrad], {icon: pointOfInterest});
			marker.bindPopup("<strong>Utsiktspunkt:</strong> <br>" + tittel + "<br> Addressenavn: " + address);

			//adds marker to sub group
			utsiktsPunkt.addLayer(marker);
		}
	});

	return utsiktsPunkt;
}

function difiGravlunder(map) {
	
	//creates and empty subgroup
	var gravlunder = L.featureGroup.subGroup(parentCluster);


	//url til JSON data 
	var url = 'https://hotell.difi.no/api/json/stavanger/gravlunder?';
	//henter data 
	$.get(url, function(data) {
		//var difiData = JSON.parse(data);
		var difiData = data;
		
		for (var i = 0; i < difiData.entries.length; i++) {
			
			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].longitude;
			var breddeGrad = difiData.entries[i].latitude;
			var tittel = difiData.entries[i].name;
			var address = difiData.entries[i].adressenavn;
			
			var marker = L.marker([breddeGrad, lengdeGrad], {icon: gravlundIcon});
			marker.bindPopup("<strong>Gravlunder:</strong> <br>" + tittel + "<br> Addressenavn: " + address);

			//adds marker to sub group
			gravlunder.addLayer(marker);
		}
	});

	return gravlunder;
}

function difiTrosBygning(map) {
	
	//creates and empty subgroup
	var trosBygning = L.featureGroup.subGroup(parentCluster);


	//url til JSON data 
	var url = 'https://hotell.difi.no/api/json/stavanger/kirkerkapellermoskeer?';
	//henter data 
	$.get(url, function(data) {
		//var difiData = JSON.parse(data);
		var difiData = data;
		
		for (var i = 0; i < difiData.entries.length; i++) {
			
			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].longitude;
			var breddeGrad = difiData.entries[i].latitude;
			var tittel = difiData.entries[i].name;
			var address = difiData.entries[i].adressenavn;
			
			var marker = L.marker([breddeGrad, lengdeGrad], {icon: troIcon});
			marker.bindPopup("<strong>Relgiøs bygning:</strong> <br>" + tittel + "<br> Addressenavn: " + address);

			//adds marker to sub group
			trosBygning.addLayer(marker);
		}
	});

	return trosBygning;
}

function difiBadePlass(map) {
	
	//creates and empty subgroup
	var badePlass = L.featureGroup.subGroup(parentCluster);


	//url til JSON data 
	var url = 'https://hotell.difi.no/api/json/stavanger/badeplasser?';
	//henter data 
	$.get(url, function(data) {
		//var difiData = JSON.parse(data);
		var difiData = data;
		
		for (var i = 0; i < difiData.entries.length; i++) {
			
			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].longitude;
			var breddeGrad = difiData.entries[i].latitude;
			var tittel = difiData.entries[i].name;
			var address = difiData.entries[i].adressenavn;
			
			var marker = L.marker([breddeGrad, lengdeGrad], {icon: vannIcon});
			marker.bindPopup("<strong>Badeplass:</strong> <br>" + tittel + "<br> Addressenavn: " + address);

			//adds marker to sub group
			badePlass.addLayer(marker);
		}
	});

	return badePlass;
}

function difiUtleielokaler(map) {
	
	//creates and empty subgroup
	var utleieLokal = L.featureGroup.subGroup(parentCluster);


	//url til JSON data 
	var url = 'https://hotell.difi.no/api/json/gjesdal/utleielokaler?';
	//henter data 
	$.get(url, function(data) {
		//var difiData = JSON.parse(data);
		var difiData = data;
		
		for (var i = 0; i < difiData.entries.length; i++) {
			
			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].lengdegrad;
			lengdeGrad = lengdeGrad.replace(",", "."); 
			var breddeGrad = difiData.entries[i].breddegrad;
			breddeGrad = breddeGrad.replace(",", "."); 
			var tittel = difiData.entries[i].navn;
			var address = difiData.entries[i].adresse;
			var type = difiData.entries[i].type;
			
			var marker = L.marker([breddeGrad, lengdeGrad], {icon: utleieIcon});
			marker.bindPopup("<strong>Utleielokal:</strong> <br>" + tittel + "<br> Addressenavn: " + address + "<br> Type: " + type);

			//adds marker to sub group
			utleieLokal.addLayer(marker);
		}
	});

	return utleieLokal;
}

function difiBarnehageGjesdal(map) {
	
	//creates and empty subgroup
	var barnehageGjesdal = L.featureGroup.subGroup(parentCluster);


	//url til JSON data 
	var url = 'https://hotell.difi.no/api/json/gjesdal/barnehager?';
	//henter data 
	$.get(url, function(data) {
		//var difiData = JSON.parse(data);
		var difiData = data;
		
		for (var i = 0; i < difiData.entries.length; i++) {
			
			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].lengdegrad;
			lengdeGrad = lengdeGrad.replace(",", "."); 
			var breddeGrad = difiData.entries[i].breddegrad;
			breddeGrad = breddeGrad.replace(",", "."); 
			var tittel = difiData.entries[i].navn;
			var address = difiData.entries[i].adresse;
			
			var marker = L.marker([breddeGrad, lengdeGrad], {icon: kindergartenMarker});
			marker.bindPopup("<strong>Barnehage:</strong> <br>" + tittel + "<br> Addressenavn: " + address);

			//adds marker to sub group
			barnehageGjesdal.addLayer(marker);
		}
	});

	return barnehageGjesdal;
}

function difiSkoleGjesdal(map) {
	
	//creates and empty subgroup
	var skoleGjesdal = L.featureGroup.subGroup(parentCluster);


	//url til JSON data 
	var url = 'https://hotell.difi.no/api/json/gjesdal/grunnskoler?';
	//henter data 
	$.get(url, function(data) {
		//var difiData = JSON.parse(data);
		var difiData = data;
		
		for (var i = 0; i < difiData.entries.length; i++) {
			
			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].lengdegrad;
			lengdeGrad = lengdeGrad.replace(",", "."); 
			var breddeGrad = difiData.entries[i].breddegrad;
			breddeGrad = breddeGrad.replace(",", "."); 
			var tittel = difiData.entries[i].navn;
			var address = difiData.entries[i].adresse;
			
			var marker = L.marker([breddeGrad, lengdeGrad], {icon: bookIcon});
			marker.bindPopup("<strong>Grunnskole:</strong> <br>" + tittel + "<br> Addressenavn: " + address);

			//adds marker to sub group
			skoleGjesdal.addLayer(marker);
		}
	});

	return skoleGjesdal;
}

function difiLekeplass(map) {
	
	//creates and empty subgroup
	var lekePlass = L.featureGroup.subGroup(parentCluster);


	//url til JSON data 
	var url = 'https://hotell.difi.no/api/json/stavanger/lekeplasser?';

	var page = 1;
	//henter data 
	$.get(url, function(data) {
		//var difiData = JSON.parse(data);
		var difiData = data;
		
		for (var i = 0; i < difiData.entries.length; i++) {
			
			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].longitude;
			var breddeGrad = difiData.entries[i].latitude;
			
			var marker = L.marker([breddeGrad, lengdeGrad], {icon: lekePlassIcon});
			marker.bindPopup("<strong>Lekeplass</strong> <br>");

			//adds marker to sub group
			lekePlass.addLayer(marker);
		}

		//Difi only gives the first 100 entries, if there are more they need to be requested on a separete url
		page++;
		var pages = difiData.pages;
		while(page<=pages){
			var url = 'https://hotell.difi.no/api/json/stavanger/lekeplasser?page=' + page;
			$.get(url, function(data) {
				//var difiData = JSON.parse(data);
				var difiData = data;
				
				for (var i = 0; i < difiData.entries.length; i++) {
					
					//Finner data som skal brukes
					var lengdeGrad = difiData.entries[i].longitude;
					var breddeGrad = difiData.entries[i].latitude;
					
					var marker = L.marker([breddeGrad, lengdeGrad], {icon: lekePlassIcon});
					marker.bindPopup("<strong>Lekeplass</strong> <br>");

					//adds marker to sub group
					lekePlass.addLayer(marker);
				}
			});

			page++;
		}

	});
	

	return lekePlass;
}

function openStavangerKommunaleBygg(map) {
	
	//creates and empty subgroup
	var stavangerUtleieLokal = L.featureGroup.subGroup(parentCluster);

	$.ajax({
	    url: 'https://open.stavanger.kommune.no/api/action/datastore_search?resource_id=0c728874-f9d8-466b-8b81-572d924e3145',
	    dataType: 'json',
	    success: function(data) {
	      	var openStavangerData = data;
		
			for (var i = 0; i < openStavangerData.result.records.length; i++) {
				
				//Finner data som skal brukes
				var longitude = openStavangerData.result.records[i].longitude;
				var latitude = openStavangerData.result.records[i].latitude;
				var service = openStavangerData.result.records[i].service;
				var address = openStavangerData.result.records[i].adresse;
				
				var marker = L.marker([latitude, longitude], {icon: utleieIcon});
				marker.bindPopup("<strong>Bygg Publikumstjeneste:</strong> <br>" + service + "<br> Addressenavn: " + address);

				//adds marker to sub group
				stavangerUtleieLokal.addLayer(marker);
			}
	    }
	});

	return stavangerUtleieLokal;
}

function openStavangerGrillGjesdal(map) {
	
	//creates and empty subgroup
	var grillPlassGjesdalLayer = L.featureGroup.subGroup(parentCluster);

	$.ajax({
	    url: 'https://open.stavanger.kommune.no/api/action/datastore_search?resource_id=fd6dc8bc-5df7-469f-81ec-9df61b67179e',
	    dataType: 'json',
	    success: function(data) {
	      	var openStavangerData = data;
		
			for (var i = 0; i < openStavangerData.result.records.length; i++) {
				
				//Finner data som skal brukes
				var longitude = openStavangerData.result.records[i].Longitude;
				var latitude = openStavangerData.result.records[i].Latitude;
				var name = openStavangerData.result.records[i].Navn;
				
				var marker = L.marker([latitude, longitude], {icon: fireIcon});
				marker.bindPopup("<strong>Grill Plass:</strong> <br>" + name);

				//adds marker to sub group
				grillPlassGjesdalLayer.addLayer(marker);
			}
	    }
	});

	return grillPlassGjesdalLayer;
}

function openStavangerFiskeGjesdal(map) {
	
	//creates and empty subgroup
	var fiskeGjesdal = L.featureGroup.subGroup(parentCluster);

	$.ajax({
	    url: 'https://open.stavanger.kommune.no/api/action/datastore_search?resource_id=eac99e21-33b4-4bf6-81d4-608b2a4de7f1',
	    dataType: 'json',
	    success: function(data) {
	      	var openStavangerData = data;
		
			for (var i = 0; i < openStavangerData.result.records.length; i++) {
				
				//Finner data som skal brukes
				var longitude = openStavangerData.result.records[i].Longitude;
				var latitude = openStavangerData.result.records[i].Latitude;
				var name = openStavangerData.result.records[i].Navn;
				var adresse = openStavangerData.result.records[i].Adresse;
				var beskrivelse = openStavangerData.result.records[i].Beskrivelse;
				
				var marker = L.marker([latitude, longitude], {icon: fishingIcon});
				marker.bindPopup("<strong>Vassdrag:</strong> <br>" + name + "<br> Adresse: " + adresse + "<br> Beskrivelse: " + beskrivelse);

				//adds marker to sub group
				fiskeGjesdal.addLayer(marker);
			}
	    }
	});

	return fiskeGjesdal;
}

function difiBomstasjon(map) {
	
	//creates and empty subgroup
	var bomstasjonGroup = L.featureGroup.subGroup(parentCluster);

	var page = 1;
	//url til JSON data 
	var url = 'https://hotell.difi.no/api/json/vegvesen/bomstasjoner?';
	//henter data 
	$.get(url, function(data) {
		//var difiData = JSON.parse(data);
		var difiData = data;
		
		for (var i = 0; i < difiData.entries.length; i++) {
			
			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].long;
			var breddeGrad = difiData.entries[i].lat;
			var tittel = difiData.entries[i].navn;
			var alt = difiData.entries[i].autopass_beskrivelse;
			
			var marker = L.marker([breddeGrad, lengdeGrad], {icon: payBooth});
			marker.bindPopup("<strong>Bomstasjon:</strong> <br>" + tittel + "<br> Beskrivelse: " + alt);

			//adds marker to sub group
			bomstasjonGroup.addLayer(marker);
		}

		//Difi only gives the first 100 entries, if there are more they need to be requested on a separete url
		page++;
		var pages = difiData.pages;
		while(page<=pages){
			var url = 'https://hotell.difi.no/api/json/vegvesen/bomstasjoner?page=' + page;
			$.get(url, function(data) {
				//var difiData = JSON.parse(data);
				var difiData = data;
				
				for (var i = 0; i < difiData.entries.length; i++) {
					
					//Finner data som skal brukes
					var lengdeGrad = difiData.entries[i].long;
					var breddeGrad = difiData.entries[i].lat;
					var tittel = difiData.entries[i].navn;
					var alt = difiData.entries[i].autopass_beskrivelse;
					
					var marker = L.marker([breddeGrad, lengdeGrad], {icon: payBooth});
					marker.bindPopup("<strong>Bomstasjon:</strong> <br>" + tittel + "<br> Beskrivelse: " + alt);

					//adds marker to sub group
					bomstasjonGroup.addLayer(marker);
				}
			});

			page++;
		}

	});

	return bomstasjonGroup;
}

function bringPickupPoints(map) {
	
	//creates and empty subgroup
	var pickupGroup = L.featureGroup.subGroup(parentCluster);

	$.ajax({
	    type: 'GET',
	    url: "https://mats.maplytic.no/proxy?url=https://api.bring.com/pickuppoint/api/pickuppoint/no/all.json",
	    success: function(data) { 	
	    	var bringData = data;
		
			for (var i = 0; i < bringData.pickupPoint.length; i++) {
				
				//Finner data som skal brukes
				var lengdeGrad = bringData.pickupPoint[i].longitude;
				var breddeGrad = bringData.pickupPoint[i].latitude;
				var tittel = bringData.pickupPoint[i].name;
				var adress = bringData.pickupPoint[i].address;
				var beskrivelse = bringData.pickupPoint[i].locationDescription;
				var open = bringData.pickupPoint[i].openingHoursNorwegian;
				
				var marker = L.marker([breddeGrad, lengdeGrad], {icon: pickupBox});
				marker.bindPopup("<strong>Pickup Point:</strong> <br>" + tittel + "<br> Adress: " + adress + "<br> Beskrivelse: " + beskrivelse + "<br> Åpen: " + open );

				//adds marker to sub group
				pickupGroup.addLayer(marker);
			}
	    },
	    contentType: "application/json",
	    dataType: 'json'
	});

	return pickupGroup;
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
	    url: "https://mats.maplytic.no/proxy/api01.nve.no/hydrology/forecast/flood/v1.0.4/api/CountyOverview/1/2015-12-5/2015-12-5",
	    success: function(data) { 	
	    	flomTest = data;
	    	var kommuneNr = [];

	    	//går gjennom alle komuner
	    	for(var i=0;i<flomTest.length;i++){
	    		//hvis fylke har høy nok aktivitets nivå
	    		if( flomTest[i].HighestActivityLevel > 1){
	    			//gå gjennom kommuner i det fylke
	    			for(var j=0;j<flomTest[i].MunicipalityList.length;j++){
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
		    	for(var i=0;i<kommuneNr.length;i++){

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

					for(var i=0;i<data.features.length;i++){

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
	    url: "https://mats.maplytic.no/proxy/api01.nve.no/hydrology/forecast/landslide/v1.0.4/api/CountyOverview/1/2015-12-5/2015-12-5",
	    success: function(data) { 	
	    	flomTest = data;
	    	var kommuneNr = [];

	    	//går gjennom alle komuner
	    	for(var i=0;i<flomTest.length;i++){
	    		//hvis fylke har høy nok aktivitets nivå
	    		if( flomTest[i].HighestActivityLevel > 1){
	    			//gå gjennom kommuner i det fylke
	    			for(var j=0;j<flomTest[i].MunicipalityList.length;j++){
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
		    	for(var i=0;i<kommuneNr.length;i++){

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

					for(var i=0;i<data.features.length;i++){
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

function roundNumber(number, precision){
	number = parseFloat(number);
    precision = Math.abs(parseInt(precision)) || 0;
    var multiplier = Math.pow(10, precision);
    var result = number*multiplier;
    result = Math.round(result);
    result = result/multiplier;
    return result;
}


///////////////////////
/////Test/bug ting////
/////////////////////

