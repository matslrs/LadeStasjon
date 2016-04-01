function setupSearch(map) {
	
	map.addControl( new L.Control.Search({
			url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
			jsonpParam: 'json_callback',
			propertyName: 'display_name',
			propertyLoc: ['lat','lon'],
			circleLocation: false,
			markerLocation: false,			
			autoType: false,
			autoCollapse: true,
			minLength: 2,
			zoom:10
	}) );

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

	});

	map.on('draw:deleted', function() {
		// Update db to save latest changes.
	});
	//LEAFLET.DRAW events END 

	return drawnItems;

}

function updateDbQueryLayer(map, layerGroup){
	//creates and empty GeoJSON Layer
	var myGeoJLayer = L.geoJson();

	newBounds = map.getBounds();
	neLat = newBounds.getNorth();
	neLng = newBounds.getEast();
	swLat = newBounds.getSouth();
	swLng = newBounds.getWest();
	
	//tolerance in ST_Simplify(postgis)
	var tolerance = 0.01*7/map.getZoom();
	console.log('New tolerance: ' + tolerance)
	//url til GeoJSON data 
	var url = 'https://mats.maplytic.no/sql/select%20ST_Simplify(geom%2C%20' + tolerance + ')%20as%20geom%2C%20navn%2C%20fylkesnr%0Afrom%20fylker%0AWHERE%20fylker.geom%20%26%26%20ST_MakeEnvelope(' + swLng + '%2C%20' + swLat + '%2C%20' + neLng + '%2C%20' + neLat +')%3B/out.geojson';
	//henter data 

	$.getJSON(url, function(data) {

	    function onEachFeature(feature, layer) {
	  
	        layer.bindPopup("Gid: " + feature.properties.gid + "<br>" + "Geometry Type: " + feature.geometry.type);
	    } 



	    myGeoJLayer.addData(data, {
	      onEachFeature: onEachFeature
	    });

	    map.removeLayer(dbQueryLayer);
	    dbQueryLayer = myGeoJLayer;
	    dbQueryLayer.addTo(map);

  	});	

}