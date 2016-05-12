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
	overlayMaps["<i class='fa fa-car' aria-hidden='true'></i> Bomstasjoner Norge"] = bomstasjonDifi;


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

	var testNobil = L.geoJson();
	var nobilApiKey = '8a3fd5aedf9a815606f7b8ff9bdbb0d5';

	jQuery.ajax({

		type: 'POST',

		url: 'http://nobil.no/api/server/search.php',

		data: { 

		success: function(data){
			testNobil.addData(data);
		},

		dataType: 'json'

	}});


	// jQuery.ajax({
	// 	type: 'GET',
	// 	url: ' https://mats.maplytic.no/proxy/nobil.no/api/server/datadump.php',
	// 	data: {
	// 		'apikey': nobilApiKey,
	// 		'countrycode': 'NOR',
	// 		'fromdate': '2012-06-02',
	// 		'format': 'JSON',
	// 		'file': 'false'
	// 		},
	// 	success: function(data){
	// 		testNobil.addData(data);
	// 	},
	// 	dataType: 'json'
	// });

}

