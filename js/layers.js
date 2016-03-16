function setup_base_layers()
{
		 //OpenStreetMap layer
		 var osm_layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		 }).addTo(mymap); 
		 
		 // //MapBox
// 		 var mapbox_layer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
// 		     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
// 		     id: 'Default Public Token',
// 		     accessToken: 'pk.eyJ1IjoibWF0c2VjYyIsImEiOiJjaWx0YnR1bXowMDJndmZtNnFhc2t2OXhuIn0.65XQfz_pB3CNbM5KRTi9OQ'
// 		 });
		 
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

function setup_overlay_layers()
{
	// Initialize the FeatureGroup to store draw layer
	var drawnItems = new L.FeatureGroup();
	mymap.addLayer(drawnItems);
}
