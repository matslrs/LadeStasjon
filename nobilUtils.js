function setupIcons(map){
	// var LeafIcon = L.Icon.extend({
	//     options: {
	//         shadowUrl: 'leaflet/images/leaf-shadow.png',
	//         iconSize:     [34, 34],
	//         shadowSize:   [0, 0],
	//         iconAnchor:   [17, 34],
	//         shadowAnchor: [4, 62],
	//         popupAnchor:  [-3, -76]
	//     }
	// });
	
	chargerError = L.AwesomeMarkers.icon({
	    prefix: 'ion',
	    icon: 'ion-model-s',
	    markerColor: 'red'
	});

	chargerAvailable = L.AwesomeMarkers.icon({
	    prefix: 'ion',
	    icon: 'ion-model-s',
	    markerColor: 'green'
	});

	chargerOccupied = L.AwesomeMarkers.icon({
	    prefix: 'ion',
	    icon: 'ion-model-s',
	    markerColor: 'orange'
	});

	chargerUnknown = L.AwesomeMarkers.icon({
	    prefix: 'ion',
	    icon: 'ion-model-s',
	    markerColor: 'darkpurple'
	});

	staticChargerIcon = L.AwesomeMarkers.icon({
	    prefix: 'ion',
	    icon: 'ion-model-s',
	    markerColor: 'blue'
	});
}

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

	var ladeStasjonNobil = setupStaticNobilLayer(map);
	overlayMaps["<i class='fa fa-car' aria-hidden='true'></i> Ladestasjoner"] = ladeStasjonNobil;

	overlayMaps["<i class='fa fa-car' aria-hidden='true'></i> Ladestasjoner Real Time"] = ladeStasjonNobilStreamLayer;


	return overlayMaps;
}

//-------------------------------------------

function setupStaticNobilLayer(map){
	var staticNobil = L.featureGroup.subGroup(parentCluster);

	$.ajax({
	   url: "https://mats.maplytic.no/proxy/nobil.no/api/server/datadump.php",
	   //url: "http://nobil.no/api/server/datadump.php",
	   jsonp: "callback",
	   dataType: "jsonp",
	   data: {
		    apikey: "8a3fd5aedf9a815606f7b8ff9bdbb0d5",
			//fromdate: "2016-05-11",
			file: false,
		    format: "json"
	   },
	   success: function( response ) {
	       console.log( 'antall ladestasjoner: ' + response.chargerstations.length );

			for (i = 0; i < response.chargerstations.length; i++) {
				if(useOnlyNor && response.chargerstations[i].csmd.Land_code == "NOR" || !useOnlyNor){
					var position = response.chargerstations[i].csmd.Position;
					position = position.replace("(", "");
					position = position.replace(")", "");
					position = position.split(",");

					var lengdeGrad = position[1];
					var breddeGrad = position[0];

					var tittel = response.chargerstations[i].csmd.name;
					var alt = response.chargerstations[i].csmd.Description_of_location;
					
					var marker = L.marker([breddeGrad, lengdeGrad], {icon: staticChargerIcon});
					marker.bindPopup("<strong>Charger Station:</strong> <br>" + tittel + "<br> Beskrivelse: " + alt);

					//adds marker to sub group
					staticNobil.addLayer(marker);
					//add charger
					chargingStations.push(response.chargerstations[i]);
				}
			}
			initSocketConnection();
	   }
	});
	return staticNobil;
}

function addJsonpData(data){
	dataJsonP = data;
}

function setupStreamNobilLayer(streamData){

	var tempDebugArray = [];

	console.log( 'antall real time ladestasjoner: ' + streamData.length );
	//have to use both datasets to "build" real time layer b/c neither contains all needed info
	for(var i = 0; i < chargingStations.length; i++) {
		for(var j=0;j<streamData.length;j++){
			if(streamData[j].uuid == chargingStations[i].csmd.International_id){

				//get coords from string. ++
				var position = chargingStations[i].csmd.Position;
				position = position.replace("(", "");
				position = position.replace(")", "");
				position = position.split(",");

				var latitude = position[0];
				var longitude = position[1];

				var tittel = chargingStations[i].csmd.name;
				var alt = chargingStations[i].csmd.Description_of_location;


				var connectorUnknown = 0;
				var connectorAvailable = 0;
				var connectorOccupied = 0;
				var connectorErrors = 0;
				var oldestTime = 0;

				//Create connectors array for charger station
				var connectors = [];
				for(var k=0;k<streamData[j].connectors.length;k++){
					if(streamData[j].connectors[k].error == 1){
						var statusConn = "Error";
						connectorErrors++;
					} else if(streamData[j].connectors[k].status == -1){
						var statusConn = "Unknown";
						connectorUnknown++;
					} else if(streamData[j].connectors[k].status == 0){
						var statusConn = "Available";
						connectorAvailable++;
					} else if(streamData[j].connectors[k].status == 1){
						var statusConn = "Occupied";
						connectorOccupied++;
					}

					var connector = {
						status: streamData[j].connectors[k].status,
						statusRead:statusConn,
						error:streamData[j].connectors[k].error,
						timestamp: streamData[j].connectors[k].timestamp
					}

					connectors.push(connector);

					if(oldestTime<streamData[j].connectors[k].timestamp){
						oldestTime = streamData[j].connectors[k].timestamp;
					}

				}

				//get statusRead from charger station
				if(connectorAvailable > 0){
					var preStatusRead = "<div class='text-success'> Station Status: ";
					var statusRead = "Available";
					var statusIcon = chargerAvailable;
				} else if(connectorOccupied > 0){
					var preStatusRead = "<div class='text-warning'> Station Status: ";
					var statusRead = "Occupied";
					var statusIcon = chargerOccupied;
				} else if(connectorUnknown > 0){
					var preStatusRead = "<div class='text-muted'> Station Status: ";
					var statusRead = "Unknown";
					var statusIcon = chargerUnknown;
				} else if( connectorErrors > 0){
					var preStatusRead = "<div class='text-danger'> Station Status: ";
					var statusRead = "Error";
					var statusIcon = chargerError;
				}

				//create charger station object
				var chargerStation = {
					uuid: streamData[j].uuid,
					name: "",
					description:"",
					coords: [-1,-1],
					status: streamData[j].status,
					statusRead:"",
					updateTime:new Date(oldestTime),
					connectors: connectors
				};

				//"build" charger station
				chargerStation.name = tittel;
				chargerStation.description = alt;
				chargerStation.coords = [latitude, longitude];
				chargerStation.statusRead = statusRead;
				chargerStation.connectorUnknown = connectorUnknown;
				chargerStation.connectorAvailable = connectorAvailable;
				chargerStation.connectorOccupied = connectorOccupied;
				chargerStation.connectorErrors = connectorErrors;

				var imageName = chargingStations[i].csmd.Image;
				if(typeof chargingStations[i].csmd.Image !== 'undefined' && imageName.includes(".jpg") || imageName.includes(".jpeg") || imageName.includes(".png") ){
					chargerStation.imageName = imageName;
				} else{
					chargerStation.imageName = "coming";
					tempDebugArray.push(chargingStations[i].csmd.Image);
				}

				//create and add marker to layer
				var marker = L.marker([latitude, longitude], {icon: statusIcon});

				if( useOnlyNor ){
					id = streamData[j].uuid.replace("NOR_", "");
				}
				else{
					id = streamData[j].uuid;
				}
				tmpStr = "<strong>Charger Station " + id  + ": </strong> <br>" + tittel;
				tmpStr += "<br>" + preStatusRead + statusRead + "</div>";

				
				if( chargerStation.imageName != "coming" ){
					tmpStr += "<br> <img src='http://www.nobil.no/img/ladestasjonbilder/" + imageName + "' alt='some text'/>";
				} else{
					tmpStr += "<br> Image Coming Later.";
				}
				
				tmpStr += "<br> --------- ";

				tmpStr += '<div class="container" style="height: ' + (Math.ceil(chargerStation.connectors.length/6)*30+10) + 'px;">';
				tmpStr += "Connectors: ";

				var ledStr = '';
				for(var k=0;k<connectorAvailable;k++){
					ledStr += '<div class="led-box"><div class="led-green"></div></div>';
				}
				for(var k=0;k<connectorOccupied;k++){
					ledStr += '<div class="led-box"><div class="led-yellow"></div></div>';
				}
				for(var k=0;k<connectorErrors;k++){
					ledStr += '<div class="led-box"><div class="led-red"></div></div>';
				}
				for(var k=0;k<connectorUnknown;k++){
					ledStr += '<div class="led-box"><div class="led-grey"></div></div>';
				}

				tmpStr += ledStr;
				tmpStr += '</div>';


				tmpStr += "<br> Available: " + connectorAvailable + "/" + connectors.length;
				tmpStr += "<br> Occupied: " + connectorOccupied + "/" + connectors.length;
				tmpStr += "<br> Error: " + connectorErrors + "/" + connectors.length;
				tmpStr += "<br> Unknown: " + connectorUnknown + "/" + connectors.length;
				tmpStr += "<br> --------- ";
				tmpStr += "<br> <i>Oldest update: " + new Date(oldestTime) + "</i>";

				marker.bindPopup(tmpStr);
				ladeStasjonNobilStreamLayer.addLayer(marker);


				rtChargingStationsArray[streamData[j].uuid] = chargerStation;
				dynamicMarkers[streamData[j].uuid] = marker;
				break;
			}
		}
	}

	console.log( "images with 'wrong' name = " + tempDebugArray.length );

	for(var i=0; i<tempDebugArray.length;i++){
		console.log("image name: " + tempDebugArray[i]);
	}
}

function isInChargerList(id, chargingArray){
	if (chargingArray[id] == null){
	    return false;
	}
	return true;
}

function updateStreamData(streamChargerUpdate){

	if(isInChargerList(streamChargerUpdate.uuid, rtChargingStationsArray)){
		if(streamChargerUpdate.status == -1){
			var statusRead = "Unknown";
		} else if(streamChargerUpdate.status == 0){
			var statusRead = "Available";
		} else if(streamChargerUpdate.status == 1){
			var statusRead = "Occupied";
		} else if(streamChargerUpdate.status == 2){
			var statusRead = "Error";
		}

		var connectorsUpdate = [];
		for(var j=0;j<streamChargerUpdate.connectors.length;j++){
			if(streamChargerUpdate.connectors.status == -1){
				var statusConn = "Unknown";
			} else if(streamChargerUpdate.connectors[j].status == 0){
				var statusConn = "Available";
			} else if(streamChargerUpdate.connectors[j].status == 1){
				var statusConn = "Occupied";
			} else if(streamChargerUpdate.connectors[j].status == 2){
				var statusConn = "Error";
			}

			var connectorUpdate = {
				status: streamChargerUpdate.connectors[j].status,
				statusRead:statusConn,
				error:streamChargerUpdate.connectors[j].error,
				timestamp: streamChargerUpdate.connectors[j].timestamp
			}

			connectorsUpdate.push(connectorUpdate);

		}

		var connectorUnknown = 0;
		var connectorAvailable = 0;
		var connectorOccupied = 0;
		var connectorErrors = 0;
		var oldestTime = 0;

		for(var j=0;j<streamChargerUpdate.connectors.length;j++){
			if(streamChargerUpdate.connectors[j].status == -1){
				connectorUnknown++;
			} else if(streamChargerUpdate.connectors[j].status == 0){
				connectorAvailable++;
			} else if(streamChargerUpdate.connectors[j].status == 1){
				connectorOccupied++;
			} else if(streamChargerUpdate.connectors[j].status == 2){
				connectorErrors++;
			}

			if(oldestTime<streamChargerUpdate.connectors[j].timestamp){
				oldestTime = streamChargerUpdate.connectors[j].timestamp;
			}
		}

		console.log("Charging Station '" + streamChargerUpdate.uuid + "':");
		console.log("Station Status: " + rtChargingStationsArray[streamChargerUpdate.uuid].statusRead + " --> " + statusRead);
		console.log("Station Connectors: " + rtChargingStationsArray[streamChargerUpdate.uuid].connectors.length);

		console.log("----------------------------------------------------");
		var connectorUnknownPre = rtChargingStationsArray[streamChargerUpdate.uuid].connectorUnknown;
		var connectorAvailablePre = rtChargingStationsArray[streamChargerUpdate.uuid].connectorAvailable;
		var connectorOccupiedPre = rtChargingStationsArray[streamChargerUpdate.uuid].connectorOccupied;
		var connectorErrorsPre = rtChargingStationsArray[streamChargerUpdate.uuid].connectorErrors;
		console.log("Connectors Status Changes:");
		if(connectorUnknownPre != connectorUnknown){
			console.log("Unknown: " + connectorUnknownPre + "/" + streamChargerUpdate.connectors.length + " --> " + connectorUnknown + "/" + streamChargerUpdate.connectors.length );
		}
		if(connectorAvailablePre != connectorAvailable){
			console.log("Available: " + connectorAvailablePre + "/" + streamChargerUpdate.connectors.length + " --> " + connectorAvailable + "/" + streamChargerUpdate.connectors.length );
		}
		if(connectorOccupiedPre != connectorOccupied){
			console.log("Occupied: " + connectorOccupiedPre + "/" + streamChargerUpdate.connectors.length + " --> " + connectorOccupied + "/" + streamChargerUpdate.connectors.length );
		}
		if(connectorErrorsPre != connectorErrors){
			console.log("Error: " + connectorErrorsPre + "/" + streamChargerUpdate.connectors.length + " --> " + connectorErrors + "/" + streamChargerUpdate.connectors.length );
		}
		console.log("****************************************************");

		rtChargingStationsArray[streamChargerUpdate.uuid].status = streamChargerUpdate.status;
		rtChargingStationsArray[streamChargerUpdate.uuid].statusRead = statusRead;
		rtChargingStationsArray[streamChargerUpdate.uuid].connectorUnknown = connectorUnknown;
		rtChargingStationsArray[streamChargerUpdate.uuid].connectorAvailable = connectorAvailable;
		rtChargingStationsArray[streamChargerUpdate.uuid].connectorOccupied = connectorOccupied;
		rtChargingStationsArray[streamChargerUpdate.uuid].connectorErrors = connectorErrors;
		rtChargingStationsArray[streamChargerUpdate.uuid].connectors = connectorsUpdate;
		rtChargingStationsArray[streamChargerUpdate.uuid].updateTime = oldestTime;

		updateMarkerPopup(streamChargerUpdate.uuid);
	}

}

function updateMarkerPopup(id){
	//mymap.closePopup();
	dynamicMarkers[id].openPopup();

	if(rtChargingStationsArray[id].status == -1){
		var preStatusRead = "<div class='text-muted'> Station Status: ";
		var statusIcon = chargerUnknown;
	} else if(rtChargingStationsArray[id].status == 0){
		var preStatusRead = "<div class='text-success'> Station Status: ";
		var statusIcon = chargerAvailable;
	} else if(rtChargingStationsArray[id].status == 1){
		var preStatusRead = "<div class='text-warning'> Station Status: ";
		var statusIcon = chargerOccupied;
	} else if( rtChargingStationsArray[id].status == 2){
		var preStatusRead = "<div class='text-danger'> Station Status: ";
		var statusIcon = chargerError;
	}

	var tmpStr = "";
	var nrOfConnectors = rtChargingStationsArray[id].connectors.length;

	if( useOnlyNor ){
		idShow = rtChargingStationsArray[id].uuid.replace("NOR_", "");
	}
	else{
		idShow = rtChargingStationsArray[id].uuid;
	}

	tmpStr = "<strong>Charger Station " + idShow  + ": </strong> <br>" + rtChargingStationsArray[id].name;
	tmpStr += "<br>" + preStatusRead + rtChargingStationsArray[id].statusRead + "</div>";

	if( rtChargingStationsArray[id].imageName != "coming" ){
		tmpStr += "<br> <img src='http://www.nobil.no/img/ladestasjonbilder/" + rtChargingStationsArray[id].imageName + "' alt='some text'/>";
	} else{
		tmpStr += "<br> Image Coming Later.";
	}
	
	tmpStr += "<br> --------- ";

	tmpStr += '<div class="container" style="height: ' + (Math.ceil(rtChargingStationsArray[id].connectors.length/6)*30+10) + 'px;">';
	tmpStr += "Connectors: ";

	var ledStr = '';
	for(var k=0;k<rtChargingStationsArray[id].connectorAvailable;k++){
		ledStr += '<div class="led-box"><div class="led-green"></div></div>';
	}
	for(var k=0;k<rtChargingStationsArray[id].connectorOccupied;k++){
		ledStr += '<div class="led-box"><div class="led-yellow"></div></div>';
	}
	for(var k=0;k<rtChargingStationsArray[id].connectorErrors;k++){
		ledStr += '<div class="led-box"><div class="led-red"></div></div>';
	}
	for(var k=0;k<rtChargingStationsArray[id].connectorUnknown;k++){
		ledStr += '<div class="led-box"><div class="led-grey"></div></div>';
	}

	tmpStr += ledStr;
	tmpStr += '</div>';

	tmpStr += "<br> Connectors: ";
	tmpStr += "<br> Available: " + rtChargingStationsArray[id].connectorAvailable + "/" + nrOfConnectors;
	tmpStr += "<br> Occupied: " + rtChargingStationsArray[id].connectorOccupied + "/" + nrOfConnectors;
	tmpStr += "<br> Error: " + rtChargingStationsArray[id].connectorErrors + "/" + nrOfConnectors;
	tmpStr += "<br> Unknown: " + rtChargingStationsArray[id].connectorUnknown + "/" + nrOfConnectors;
	tmpStr += "<br> --------- ";
	tmpStr += "<br> <i>Oldest update: " + new Date(rtChargingStationsArray[id].updateTime) + "</i>";

	dynamicMarkers[id]._popup.setContent(tmpStr);
	dynamicMarkers[id].setIcon(statusIcon);
}

