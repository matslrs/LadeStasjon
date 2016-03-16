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

function initiate_leaflets_draw()
{

	// Initialize the FeatureGroup to store editable layers
	var drawnItems = new L.FeatureGroup();
	mymap.addLayer(drawnItems);

	// Initialize the draw control and pass it the FeatureGroup of editable layers
	var drawControl = new L.Control.Draw({
	    edit: {
	        featureGroup: drawnItems
	    }
	});

	mymap.addControl(drawControl);

	return drawnItems;
	
}

function setup_overlay_layers()
{
		//LEAFLET.DRAW
		var drawnItems = initiate_leaflets_draw();
 	   
		//LEAFLET.DRAW
		mymap.on('draw:created', function (e) {
		  var type = e.layerType,
		      layer = e.layer;

		  if (type === 'marker') {
		      // Do marker specific actions
		  }
		  // Do whatever else you need to. (save to db, add to map etc)
		  drawnItems.addLayer(layer);
		 });

		 mymap.on('draw:edited', function () {
		  // Update db to save latest changes.
		 });

		 mymap.on('draw:deleted', function () {
		  // Update db to save latest changes.
		 });
		//LEAFLET.DRAW END 
	   
	   
	 	
		//LEAFLET.DRAW END 
	
	
	
	//GEOJSON LAYER
	 
	 //creates and empty GeoJSON Layer
	 var myGeoJLayer = L.geoJson().addTo(mymap);
	 
	 //url til GeoJSON data 
	 url = 'https://mats.maplytic.no/table/test.geojson';
	   //henter data 
  		 $.get(url, function(data) {
 			myGeoJLayer.addData(data);
		mats_json_data = data;
 		 });
	
	 
	 
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
	     "coordinates": [[5.74337, 58.859], [5.72544, 58.8741], [5.70252, 58.93378]]
	 }, {
	     "type": "LineString",
	     "coordinates": [[6.67964, 58.29851], [6.09763, 58.52284], [5.74264, 58.85794]]
	 }];
	 
	 //style
	 var myStyle = {
	     "color": "#ff7800",
	     "weight": 5,
	     "opacity": 0.65
	 };
	
	
	 //kanskje ta dette i if statement også som test popups
	 //adds GeoJSON's to myGeoJLayer
	 // myGeoJLayer.addData(geojsonFeature);
// 		 myGeoJLayer.addData(myLines, {
// 			 style: myStyle
// 		 }).addTo(mymap);


	 //denne kommer utenfor layere som det skal i, og blir derfor på kartet etter layeret er disabled
	 L.geoJson(geojsonFeature, {
	     onEachFeature: onEachFeature
	 }).addTo(mymap);
	 
	 

 	//test popups - kanskje en if statement for å sjekke om test popup skal være me
 	var markers_group = test_popups();
	//
	
	
	//Her settes overlay layers sammen i en array
	var overlayMaps = {
	     "Test Popups": markers_group,
	     "Popups (GeoJSON)": myGeoJLayer,
		 "Draw": drawnItems
	 };
	 
	 return overlayMaps;
}
