function setupSearch1(map) {
	
	map.addControl( new L.Control.Search({
			url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
			jsonpParam: 'json_callback',
			propertyName: 'display_name',
			propertyLoc: ['lat','lon'],
			textPlaceholder: 'Nominatim Search',
			circleLocation: false,
			markerLocation: false,			
			autoType: false,
			autoCollapse: true,
			minLength: 2,
			zoom:14
	}) );

}

function setupSearch2(map) {
	map.addControl( new L.Control.Search({
		position: 'topright',
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

function updateLegend() {
	var tempHTML = "";
	var tempEndHTML = "";

	for(var i=0;i<activeOverlays.length;i++){
		var pos = activeOverlays[i].search("<i class=");
		if(pos != -1){
			tempHTML += activeOverlays[i] + "<br>";
		}
		else{
			pos = activeOverlays[i].search("Flom Varsel");
			if(activeOverlays[i].search("Flom Varsel") != -1 || activeOverlays[i].search("Jordskred Varsel") != -1 ){
				if(tempEndHTML == ""){
					tempEndHTML += "<i style='background:red' aria-hidden='true'></i> Stor fare<br>";
				    tempEndHTML += "<i style='background:orange' aria-hidden='true'></i> Middels fare<br>";
				    tempEndHTML += "<i style='background:yellow' aria-hidden='true'></i> Lavere fare<br>";
				}
			}
		}
	}
	tempHTML += tempEndHTML;

	if(tempHTML == ""){
		$(".legend").css("visibility", "hidden");
	}
	else{
		$(".legend").css("visibility", "visible");
	}
	
	legend._container.innerHTML = tempHTML;
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


//----
//Funksjon som tar seg av dynamiske layers
//----
//den tar oppdaterer fordi om layers ikke er tegnet på kartet igjen. uncomment map.hasLayer i if statement hvis det skal tilbake
function updateDynamicLayers(map){
	//creates and empty GeoJSON Layer

	newBounds = map.getBounds();
	neLat = newBounds.getNorth();
	neLng = newBounds.getEast();
	swLat = newBounds.getSouth();
	swLng = newBounds.getWest();
	
	//tolerance in ST_Simplify(postgis)
	//funksjonen for tolerance kan finjusteres mye bedre men mer enn ok for nå
	var tolerance = 0.001*7/map.getZoom();
	
	console.log('New tolerance: ' + tolerance)

	if(useFylkerDbQ /*&& map.hasLayer(fylkeQuery)*/){
		//url til GeoJSON data 
		var url = 'https://mats.maplytic.no/sql/select%20ST_Simplify(geom%2C%20' + tolerance + ')%20as%20geom%2C%20navn%2C%20fylkesnr%0Afrom%20fylker%0AWHERE%20fylker.geom%20%26%26%20ST_MakeEnvelope(' + swLng + '%2C%20' + swLat + '%2C%20' + neLng + '%2C%20' + neLat +')%3B/out.geojson';
		//henter data 

		$.getJSON(url, function(data) {

		    function onEachFeature(feature, layer) {
		  
		        layer.bindPopup("Gid: " + feature.properties.gid + "<br>" + "Geometry Type: " + feature.geometry.type);
		    } 

		    fylkeQuery.clearLayers();

		    fylkeQuery.addData(data, {
		      onEachFeature: onEachFeature
		    });
	  	});	
	}

	if(useFloodData && sqlFlomKommuner != null /*&& map.hasLayer(flomDataQuery)*/){
		//sql query code
		var sqlString = 'SELECT navn, komm, ST_Simplify(geom, ' + tolerance + ') AS geom FROM kommuner ' + sqlFlomKommuner +  ' AND kommuner.geom && ST_MakeEnvelope(' + swLng + ', ' + swLat + ', ' + neLng + ', ' + neLat + ')';
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
		    flomDataQuery.clearLayers();
		    flomDataQuery.addData(data);

	  	});	
	}

	if(useLandslideData && sqlSkredKommuner != null /*&& map.hasLayer(skredDataQuery)*/){
		//sql query code
		var sqlString = 'SELECT navn, komm, ST_Simplify(geom, ' + tolerance + ') AS geom FROM kommuner ' + sqlSkredKommuner +  ' AND kommuner.geom && ST_MakeEnvelope(' + swLng + ', ' + swLat + ', ' + neLng + ', ' + neLat + ')';
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

		        data.features[i].properties.beskrivelse = skredKommuneInfo[kNr]["varselTekst"];
			   	data.features[i].properties.color = skredKommuneInfo[kNr]["color"];
			}

			//add it to the layer
		    skredDataQuery.clearLayers();
		    skredDataQuery.addData(data);

	  	});	
	}


}
