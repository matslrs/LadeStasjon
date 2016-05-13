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
	   url: "http://nobil.no/api/server/datadump.php",
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
					
					var marker = L.marker([breddeGrad, lengdeGrad], {icon: carCharge});
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
					if(streamData[j].connectors[k].status == -1){
						var statusConn = "Unknown";
						connectorUnknown++;
					} else if(streamData[j].connectors[k].status == 0){
						var statusConn = "Available";
						connectorAvailable++;
					} else if(streamData[j].connectors[k].status == 1){
						var statusConn = "Occupied";
						connectorOccupied++;
					} else if(streamData[j].connectors[k].status == 2){
						var statusConn = "Error";
						connectorErrors++;
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


				//get statusRead fro charger station
				if(streamData[j].status == -1){
					var statusRead = "Unknown";
				} else if(streamData[j].status == 0){
					var statusRead = "Available";
				} else if(streamData[j].status == 1){
					var statusRead = "Occupied";
				} else if( streamData[j].status == 2){
					var statusRead = "Error";
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

				//add charger to stream array
				chargerStation.name = tittel;
				chargerStation.description = alt;
				chargerStation.coords = [latitude, longitude];
				//charger.status = streamData[j].status;
				chargerStation.statusRead = statusRead;
				//charger.connectors = connectors;
				rtChargingStationsArray.push(chargerStation);

				//create and add marker to layer
				var marker = L.marker([latitude, longitude], {icon: carCharge});
				tmpStr = "<strong>Charger Station " + streamData[j].uuid.replace("NOR_", "")  + ": </strong> <br>" + tittel;
				tmpStr += "<br> Status: " + statusRead;
				tmpStr += "<br> --------- ";
				tmpStr += "<br> Connectors: ";
				tmpStr += "<br> Available: " + connectorAvailable + "/" + connectors.length;
				tmpStr += "<br> Occupied: " + connectorOccupied + "/" + connectors.length;
				tmpStr += "<br> Error: " + connectorErrors + "/" + connectors.length;
				tmpStr += "<br> Unknown: " + connectorUnknown + "/" + connectors.length;
				tmpStr += "<br> --------- ";
				tmpStr += "<br> <i>Last update: " + new Date(oldestTime) + "</i>";

				marker.bindPopup(tmpStr);
				ladeStasjonNobilStreamLayer.addLayer(marker);

				break;
			}
		}
	}

	console.log("****************************************************");
}

function isInStreamData(id, streamData){
	for(var i=0;i<streamData.length;i++){
		if(id == streamData[i].uuid){
			return true;
		}
	}
	return false;
}

function updateStreamData(streamChargerUpdate){
	for(var i = 0; i < rtChargingStationsArray.length; i++) {
		if(rtChargingStationsArray[i].uuid == streamChargerUpdate.uuid){

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

			var connectorUnknownPre = 0;
			var connectorAvailablePre = 0;
			var connectorOccupiedPre = 0;
			var connectorErrorsPre = 0;

			var connectorUnknown = 0;
			var connectorAvailable = 0;
			var connectorOccupied = 0;
			var connectorErrors = 0;

			console.log("Charging Station '" + streamChargerUpdate.uuid + "':");
			console.log("Station Status: " + rtChargingStationsArray[i].statusRead + " --> " + statusRead);
			console.log("Station Connectors: " + rtChargingStationsArray[i].connectors.length);
			for(var j=0;j<rtChargingStationsArray[i].connectors.length;j++){
				if(rtChargingStationsArray[i].connectors[j].status == -1){
					connectorUnknownPre++;
				} else if(rtChargingStationsArray[i].connectors[j].status == 0){
					connectorAvailablePre++;
				} else if(rtChargingStationsArray[i].connectors[j].status == 1){
					connectorOccupiedPre++;
				} else if(rtChargingStationsArray[i].connectors[j].status == 2){
					connectorErrorsPre++;
				}
			}

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
			}
			console.log("----------------------------------------------------");
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
			rtChargingStationsArray[i].status = streamChargerUpdate.status;
			rtChargingStationsArray[i].statusRead = statusRead;
			rtChargingStationsArray[i].connectors = connectorsUpdate;

			// mymap.panTo(rtChargingStationsArray[i].coords);
			// mymap.setZoom(14);


			break;
		}
	}
}



