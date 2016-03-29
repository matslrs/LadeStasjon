function setupSearch(map) {
	
	map.addControl( new L.Control.Search({
			url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
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
		
		var polygon = layer.toGeoJSON();
  		var polygonForDB = JSON.stringify(polygon);

	  	$.ajax({
		    type: 'POST',
		    url: "https://mats.maplytic.no/table/test",
		    data: polygonForDB, 
		    success: function(data) { console.log('Draw lagret'); },
		    contentType: "application/json",
		    dataType: 'json'
		});

	});

	map.on('draw:edited', function() {	

	});

	map.on('draw:deleted', function() {
		// Update db to save latest changes.
	});
	//LEAFLET.DRAW events END 

	return drawnItems;

}