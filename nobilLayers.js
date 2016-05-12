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

	if(useBomstasjon) {
		var bomstasjonDifi = difiBomstasjon(map);
		overlayMaps["<i class='fa fa-ticket' aria-hidden='true'></i> Bomstasjoner Norge"] = bomstasjonDifi;
	}

	var ladeStasjonNobil = setupNobilLayer(map);
	overlayMaps["<i class='fa fa-car' aria-hidden='true'></i> El-Bil Ladestasjoner"] = ladeStasjonNobil;


	return overlayMaps;
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
	//var testNobil = L.featureGroup.subGroup(parentCluster);

	$.ajax({
	   url: "http://nobil.no/api/server/datadump.php",
	   jsonp: "callback",
	   dataType: "jsonp",
	   data: {
		    apikey: "8a3fd5aedf9a815606f7b8ff9bdbb0d5",
			fromdate: "2016-05-11",
			file: false,
		    format: "json"
	   },
	   success: function( response ) {
	       console.log( 'antall ladestasjoner: ' + response.chargerstations.length );
	       dataNobil = response;

			for (i = 0; i < dataNobil.chargerstations.length; i++) {
				
				var position = dataNobil.chargerstations[i].csmd.Position;
				position = position.replace("(", "");
				position = position.replace(")", "");
				position = position.split(",");

				var lengdeGrad = position[1];
				var breddeGrad = position[0];

				var tittel = dataNobil.chargerstations[i].csmd.name;
				var alt = dataNobil.chargerstations[i].csmd.Description_of_location;
				
				var marker = L.marker([breddeGrad, lengdeGrad], {icon: carCharge});
				marker.bindPopup("<strong>Charger Station:</strong> <br>" + tittel + "<br> Beskrivelse: " + alt);

				//adds marker to sub group
				testNobil.addLayer(marker);
			}
	   }
	});
	return testNobil;
}

function addJsonpData(data){
	dataJsonP = data;
}



