function events(map) {
	//when location found, show a popup where with accuracy
	function onLocationFound(e) {
		var radius = e.accuracy / 2;

		L.marker(e.latlng).addTo(map)
			.bindPopup("You are within " + radius + " meters from this point").openPopup();

		L.circle(e.latlng, radius).addTo(map);
	}
	//if finding location failed, display error message
	function onLocationError(e) {
		alert(e.message);
	}

	function zoomEnd(e) {
	
		console.log('Zoom:' + map.getZoom());
	}

	function mouseOut(e) {
		$(".descriptionBox").hide();
	}

	function closingSidebarTasks(e) {
	}

	map.on('locationfound', onLocationFound);
	map.on('locationerror', onLocationError);
	map.on('zoomend', zoomEnd);
	sidebar.on('closing', closingSidebarTasks);
}

function updatePrefferedPanel(prefPanel){
	if(preferredPanel[prefPanel-1] == prefPanel){
		preferredPanel[prefPanel-1] = 0;
	} else{
		preferredPanel[prefPanel-1] = prefPanel;
	}
}

function markerClick(e) {
	updateSidebarContent(e.target.options.title);
	sidebar.open("stationInfo");
	if(chargingStationsArray[e.target.options.title].isRealtime){
		$('[data-toggle="tooltip"]').tooltip({container: "html"});
	}
}

function updateSidebarContent(id){
	var chargerStation = chargingStationsArray[id];	
	chargerStation.preferredPanel = preferredPanel;
	htmlName = templateSidebarName(chargerStation);
	htmlContent = templateSidebarInfo(chargerStation);
	$("#stationName").html(htmlName);	
	$("#stationDetails").html(htmlContent);	
}

function setupBaseLayers(map) {
	baseMaps =[];

	//OpenStreetMap layer
	if(useOsmLayer){
		var osm_layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
		});
		baseMaps["OpenStreetMap"] = osm_layer;
	}
	//Norges Grunnkart Graatone
	if(useKartverkGraatoneLayer){
		var kartverk_graatone_layer = L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart_graatone&zoom={z}&x={x}&y={y}', {
			attribution: 'Kartverket'
		});
		baseMaps["Norgeskart"] = kartverk_graatone_layer;
	}

	return baseMaps;
}

function setupOverlayLayers(map) {
	var overlayMaps = [];

	if(useRealTimeNobilLayer){
		//overlayMaps[" <i class='fa fa-car' aria-hidden='true'></i> Ladestasjoner Real Time"] = streamNobil;
		overlayMaps[" <i style='background-color:rgb(97,190,30)'></i>Available"] 	= streamNobilAvailable;
		overlayMaps[" <i style='background-color:rgb(240,131,0)'></i> Occupied"] 	= streamNobilOccupied;
	}
	if(useStaticNobilLayer){
		overlayMaps["<i style='background-color:rgb(30,144,255)'></i> Statisk"] = staticNobil;
	}
	if(useRealTimeNobilLayer){
		overlayMaps[" <i style='background-color:rgb(256,32,32)'></i> Error"] 		= streamNobilError;
		overlayMaps[" <i style='background-color:rgb(69,69,69)'></i> Unknown"] 	= streamNobilUnknown;
	}
	return overlayMaps;
}

function setupIcons(map){
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
	    markerColor: 'gray'
	});
	staticChargerIcon = L.AwesomeMarkers.icon({
	    prefix: 'ion',
	    icon: 'ion-model-s',
	    markerColor: 'blue'
	});
}

function initSocketConnection(chargingStations){
	var connection = new WebSocket('ws://realtime.nobil.no/api/v1/stream?apikey=8a3fd5aedf9a815606f7b8ff9bdbb0d5');
	connection.onmessage = function(e) {
		console.log('Message from the stream api');
		var message = JSON.parse(e.data);
		console.log(message.type);
		if(message.type == "snapshot:init"){
			var realtimeSt = extractRealtimeStToBeUsed(message.data);
			setupNobilLayers(realtimeSt, chargingStations);
		} else if(message.type == "status:update"){
			updateStreamData(message.data);
			
		}
	}
	connection.onopen = function(){
	   console.log('Connected to the real time api');
	}
	connection.onclose = function(){
	   	var retry = setTimeout(connection, 6000);
		console.log('Connection to the stream api closed. Trying to reconnect in 10 seconds');
	}
	connection.onerror = function(e){
		console.log('Error');
		console.log(e);
	}
}

function extractRealtimeStToBeUsed(realtimeStArray){
	var tempRealtimeStArray = [];
	for(var i=0;i<realtimeStArray.length; i++){
		if(useOnlyNor && realtimeStArray[i].uuid.includes("NOR") || !useOnlyNor){
			//add charger
			tempRealtimeStArray.push(realtimeStArray[i]);
			
		}
	}
	return tempRealtimeStArray;
}

function getStationsToBeUsed(){
	var chargingStations = [];

	$.ajax({
	   url: "https://mats.maplytic.no/proxy/nobil.no/api/server/datadump.php",
	   jsonp: "callback",
	   dataType: "jsonp",
	   data: {
		    apikey: "8a3fd5aedf9a815606f7b8ff9bdbb0d5",
			file: false,
		    format: "json"
	   },
	   success: function( response ) {
	   	var StationNR = 0;
	   	var staticStationNR = 0;
	   	var realtimStationNR = 0;
	   	var notDefinedStationNR = 0;
	   	var somethingElseStationNR = 0;

			for(var i = 0; i < response.chargerstations.length; i++) {
				if(useOnlyNor && response.chargerstations[i].csmd.Land_code == "NOR" || !useOnlyNor){
					StationNR++;
					//if station is not real time
					if(response.chargerstations[i].attr.st[21].attrvalid == 2){
						staticStationNR++;
					}
					else if(response.chargerstations[i].attr.st[21].attrvalid == 1){
						realtimStationNR++;
					}
					else{
						if (typeof variable !== 'undefined') {
						   notDefinedStationNR++;
						}
						else{
							somethingElseStationNR++;
						}
						console.log("attrvalid = " + response.chargerstations[i].attr.st[21].attrvalid );
					}
					//add charger
					chargingStations.push(response.chargerstations[i]);
					
				}
			}
			console.log('antall ladestasjoner: ' + StationNR );
			console.log("antall statisk ladestasjoner(data dump): " + staticStationNR);
			console.log("antall sanntid ladestasjoner(data dump): " + realtimStationNR);
			console.log("antall notDefined ladestasjoner(data dump): " + notDefinedStationNR);
			console.log("antall somethingElse ladestasjoner(data dump): " + somethingElseStationNR);

			initSocketConnection(chargingStations);
	   }
	});
}

function addJsonpData(data){
	dataJsonP = data;
}

function setupNobilLayers(streamData, chargingStations){
	var realtimeNorStation = 0;
	var staticNorStation = 0;
	//have to use both datasets to "build" real time layer b/c neither contains all needed info
	for(var i = 0; i < chargingStations.length; i++) {
		var position = chargingStations[i].csmd.Position;
		position = position.replace("(", "");
		position = position.replace(")", "");
		position = position.split(",");

		var latitude = position[0];
		var longitude = position[1];

		var tittel = chargingStations[i].csmd.name;
		var alt = chargingStations[i].csmd.Description_of_location;

		var j = getStationIdxInArray(chargingStations[i].csmd.International_id, streamData);

		var connectorUnknown = 0;
		var connectorAvailable = 0;
		var connectorOccupied = 0;
		var connectorErrors = 0;

		//Create connectors array for charger station
		var connectors = [];
		//if static station
		if(j == -1){
			var realtime = 0;
			var stationStatus = "Statisk Stasjon";
			var statusIcon = staticChargerIcon;

			for (var key in chargingStations[i].attr.conn) {
			  if(chargingStations[i].attr.conn.hasOwnProperty(key)) {
			  	var connector = {
					connector: chargingStations[i].attr.conn[key][4].trans,
					capacity: chargingStations[i].attr.conn[key][5].trans
				}
				connectors.push(connector);
			  }
			}
		} else{
			var realtime = 1;
			var stationStatus = streamData[j].status;
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
				if (chargingStations[i].attr.conn[k+1] == null){
					console.log(streamData[j].uuid + " missing connectors");
				} else{
					if (chargingStations[i].attr.conn[k+1][4] == null){
						console.log(streamData[j].uuid + " missing data [4]");
					} else{
						connector.connector = chargingStations[i].attr.conn[k+1][4].trans;
					}
					if (chargingStations[i].attr.conn[k+1][5] == null){
						console.log(streamData[j].uuid + " missing data [4]");
					} else{
						connector.connector = chargingStations[i].attr.conn[k+1][5].trans;
					}
				}
			}

			//get statusRead from charger station
			if(connectorAvailable > 0){
				var statusRead = "Available";
				var statusIcon = chargerAvailable;
			} else if(connectorOccupied > 0){
				var statusRead = "Occupied";
				var statusIcon = chargerOccupied;
			} else if(connectorUnknown > 0){
				var statusRead = "Unknown";
				var statusIcon = chargerUnknown;
			} else if( connectorErrors > 0){
				var statusRead = "Error";
				var statusIcon = chargerError;
			}
		}

		//create charger station object
		var chargerStation = {
			uuid: chargingStations[i].csmd.International_id,
			name: "",
			description:"",
			coords: [-1,-1],
			isRealtime: realtime,
			status: stationStatus,
			statusRead:"",
			connectors: connectors
		};

		//"build" charger station
		chargerStation.name = tittel;
		chargerStation.description = alt;
		chargerStation.address = chargingStations[i].csmd.Street + " " + chargingStations[i].csmd.House_number;
		chargerStation.city = chargingStations[i].csmd.City;
		chargerStation.zipcode = chargingStations[i].csmd.Zipcode;
		chargerStation.kommune = chargingStations[i].csmd.Municipality;
		chargerStation.fylke = chargingStations[i].csmd.County;
		chargerStation.owner = chargingStations[i].csmd.Owned_by;
		chargerStation.public = chargingStations[i].attr.st[2].trans;
		chargerStation.fee = chargingStations[i].attr.st[7].trans;
		chargerStation.timeLimit = chargingStations[i].attr.st[6].trans;
		if(chargingStations[i].attr.st[24].attrvalid == 1){
			chargerStation.open = chargingStations[i].attr.st[24].attrname;
		} else{
			chargerStation.open = chargingStations[i].attr.st[24].attrval;
		}
		chargerStation.contactInfo = chargingStations[i].csmd.Contact_info;
		chargerStation.userComment = chargingStations[i].csmd.User_comment;
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
		}

		chargingStationsArray[chargerStation.uuid] = chargerStation;

		if( j != -1 ){
			realtimeNorStation++;
			//create and add marker to layer
			var marker = L.marker([latitude, longitude], {icon: statusIcon, title: chargerStation.uuid}).on('click', markerClick);
			//streamNobil.addLayer(marker);
			//get statusRead from charger station
			if(connectorAvailable > 0){
				//sub layer
				streamNobilAvailable.addLayer(marker);
			} else if(connectorOccupied > 0){
				//sub layer
				streamNobilOccupied.addLayer(marker);
			} else if(connectorUnknown > 0){
				//sub layer
				streamNobilUnknown.addLayer(marker);
			} else if( connectorErrors > 0){
				streamNobilError.addLayer(marker);
			}
		} else{
			staticNorStation++;
			//create and add marker to layer
			var marker = L.marker([latitude, longitude], {icon: statusIcon, title: chargerStation.uuid}).on('click', markerClick);
			staticNobil.addLayer(marker);
		}
	}
	console.log("antall sanntid ladestasjoner(post socket connect): " + realtimeNorStation);
	console.log("antall statiske ladestasjoner(post socket connect): " + staticNorStation);
}

function getStationIdxInArray(id, array){
	for(var i=0;i<array.length; i++){
		if(id == array[i].uuid){
			return i;
		}
	}
	return -1;
}

function isInChargerList(id, chargingArray){
	if (chargingArray[id] == null){
	    return false;
	}
	return true;
}

function updateStreamData(streamChargerUpdate){
	if(isInChargerList(streamChargerUpdate.uuid, chargingStationsArray)){
		var connectorsUpdate = [];
		var connectorUnknown = 0;
		var connectorAvailable = 0;
		var connectorOccupied = 0;
		var connectorErrors = 0;
		//"builds" updated connectors
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

			if(streamChargerUpdate.connectors[j].error == 1){
				connectorErrors++;
			} else if(streamChargerUpdate.connectors[j].status == -1){
				connectorUnknown++;
			} else if(streamChargerUpdate.connectors[j].status == 0){
				connectorAvailable++;
			} else if(streamChargerUpdate.connectors[j].status == 1){
				connectorOccupied++;
			}
		}

		//decide statusRead for charger station based on its connectors
		if(connectorAvailable > 0){
			var statusRead = "Available";
		} else if(connectorOccupied > 0){
			var statusRead = "Occupied";
		} else if(connectorUnknown > 0){
			var statusRead = "Unknown";
		} else if( connectorErrors > 0){
			var statusRead = "Error";
		}

		//update station array
		chargingStationsArray[streamChargerUpdate.uuid].status = streamChargerUpdate.status;
		chargingStationsArray[streamChargerUpdate.uuid].statusRead = statusRead;
		chargingStationsArray[streamChargerUpdate.uuid].connectorUnknown = connectorUnknown;
		chargingStationsArray[streamChargerUpdate.uuid].connectorAvailable = connectorAvailable;
		chargingStationsArray[streamChargerUpdate.uuid].connectorOccupied = connectorOccupied;
		chargingStationsArray[streamChargerUpdate.uuid].connectorErrors = connectorErrors;
		chargingStationsArray[streamChargerUpdate.uuid].connectors = connectorsUpdate;

		if(activeSidebarStation == streamChargerUpdate.uuid){
			html = updateSidebarContent(streamChargerUpdate.uuid);
			$("#stationDetails").html(html);
		}
	}
}

function indicateUpdateOnMap(coords){
	var timeIndicatingMs = 10000;
	var radiusBig = 30000;
	var radiusSmall = 1000;

	var circle = L.circle(coords, radiusBig, {
	    color: 'blue',
	    fillColor: '#0080ff',
	    fillOpacity: 0.1
	}).addTo(mymap);

	var circleSpot = L.circle(coords, radiusSmall, {
	    color: 'blue ',
	    fillColor: '#0080ff',
	    fillOpacity: 0.5
	}).addTo(mymap);

	setTimeout(function(){mymap.removeLayer(circle)},timeIndicatingMs);
	setTimeout(function(){mymap.removeLayer(circleSpot)},timeIndicatingMs);
}


