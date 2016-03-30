function events(map) {
	
	//EVENTS
	
	var popup = L.popup();

	function onMapClick(e) {
		popup
			.setLatLng(e.latlng)
			.setContent("You clicked the map at " + e.latlng.toString())
			.openOn(map);
	}
	
	
	map.on('click', onMapClick);

	//find location and set view and zoom
	map.locate({
		setView: true,
		maxZoom: 16
	});

	//when location found, show a popup where with accuracy

	function onLocationFound(e) {
		var radius = e.accuracy / 2;

		L.marker(e.latlng).addTo(map)
			.bindPopup("You are within " + radius + " meters from this point").openPopup();

		L.circle(e.latlng, radius).addTo(map);
	}

	map.on('locationfound', onLocationFound);

	//if finding location failed, display error message

	function onLocationError(e) {
		alert(e.message);
	}

	map.on('locationerror', onLocationError);

	//EVENTS END 

}


function drawEvents(map, drawnItems){

	//LEAFLET.DRAW events
	map.on('draw:created', function(e) {
		var type = e.layerType,
			layer = e.layer;

		if (type === 'marker') {
			// Do marker specific actions
		}
		
		var polygon = layer.toGeoJSON();
  		var polygonForDB = JSON.stringify(polygon);

	  	$.ajax({
		    type: 'POST',
		    url: "https://mats.maplytic.no/table/test",
		    data: polygonForDB, 
		    success: function(data) { 
		    	console.log('draw:created. Gid = ' +  data.properties.gid); 
				L.geoJson(data, {
		    		onEachFeature: function (feature, layer) {
			    		layer.bindPopup("Gid: " + feature.properties.gid + "<br>" + "Geometry Type: " + feature.geometry.type);  
			    		drawnItems.addLayer(layer);
				    }
				});
		    },
		    contentType: "application/json",
		    dataType: 'json'
		});
	});

	map.on('draw:edited', function(e) {	
		var layers = e.layers;

   		layers.eachLayer(function (layer) {

   			var polygon = layer.toGeoJSON();
  			var polygonForDB = JSON.stringify(polygon);

   			$.ajax({
			    type: 'POST',
			    url: "https://mats.maplytic.no/table/test/" + layer.feature.properties.gid,
			    data: polygonForDB, 
			    success: function(data) { 
			    	console.log('draw:edited. Gid = ' +  layer.feature.properties.gid); 
					L.geoJson(data, {
		    			onEachFeature: function (feature, layer) {
				    		layer.bindPopup("Gid: " + feature.properties.gid + "<br>" + "Geometry Type: " + feature.geometry.type);  
				    		drawnItems.addLayer(layer);
					   	}
					});
			    },
			    contentType: "application/json",
			    dataType: 'json'
			});  
    	});
	});

	map.on('draw:deleted', function(e) {
		var layers = e.layers;

   		layers.eachLayer(function (layer) {

   			var polygon = layer.toGeoJSON();
  			var polygonForDB = JSON.stringify(polygon);

   			$.ajax({
			    type: 'DELETE',
			    url: "https://mats.maplytic.no/table/test/" + layer.feature.properties.gid,
			    data: polygonForDB, 

			    success: function(data) { 
			    	console.log('draw:deleted. Gid = ' +  layer.feature.properties.gid); 
					L.geoJson(data, {
		    			onEachFeature: function (feature, layer) { 
				    		drawnItems.removeLayer(layer);
					   	}
					});
			    },
			    contentType: "application/json",
			    dataType: 'json'
			});
    	});
	});
	//LEAFLET.DRAW events END 
}