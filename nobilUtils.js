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

	function ledAddEventListener() {
	    var x = document.getElementsByClassName("led-box");
	    for (var i = 0; i < x.length; i++) {
	        x[i].addEventListener("mouseover", mouseOver);
			x[i].addEventListener("mouseout", mouseOut);
	    }
	}

	function mouseOver(e) {
		var id = $(this).data("chargeid");
		var connectorIdx = $(this).data("connector");
		$(".descriptionBox")[0].innerHTML = "<div>Status: " + rtChargingStationsArray[id].connectors[connectorIdx].statusRead + "<br> <i>Last update: " + new Date(rtChargingStationsArray[id].connectors[connectorIdx].timestamp) + "</i></div>";

		var rect = this.getBoundingClientRect();
		console.log(rect.top, rect.right, rect.bottom, rect.left);

		$(".descriptionBox").css({
	        left: rect.right - 1,
	        top: rect.top - $(".descriptionBox").height() - 1
	    }).stop().show(100);
	}

	function mouseOut(e) {
		$(".descriptionBox").hide();
	}

	function closingSidebarTasks(e) {
	}

	map.on('popupopen', ledAddEventListener);
	map.on('locationfound', onLocationFound);
	map.on('locationerror', onLocationError);
	map.on('zoomend', zoomEnd);
	sidebar.on('closing', closingSidebarTasks);
}

function markerClick(e) {
	html = updateSidebarContent(e.target.options.title);
	activeSidebarStation = e.target.options.title;
	sidebar.open("stationInfo");
	$("#stationDetails").html(html);
}

function updateSidebarContent(id){
	var chargerStation = rtChargingStationsArray[id];

	var tmpStr = "<strong>Charger Station " + chargerStation.uuid  + ": </strong> <br>" + chargerStation.name + ".";
	tmpStr += "<br>Adresse: " + chargerStation.address;
	tmpStr += "<br>Beskrivelse: " + chargerStation.description;

	if( chargerStation.imageName != "coming" ){
		tmpStr += "<br> <img src='http://www.nobil.no/img/ladestasjonbilder/" + chargerStation.imageName + "' alt='some text'/>";
	} else{
		tmpStr += "<br> Image Coming Later.";
	}
	tmpStr += '<div class="well">';
	tmpStr += '<div class="containerCustom" style="height: ' + (Math.ceil(chargerStation.connectors.length/8 + 1)*30) + 'px;">';
	tmpStr += "<div class='connectorText'>Connectors: </div>";

	var ledStr = '';
	for(var k=0;k<chargerStation.connectorAvailable;k++){
		ledStr += '<div class="led-box" data-chargeId="' + chargerStation.uuid + '" data-connector="' + k + '"><div class="led-green"></div></div>';
	}
	for(var k=0;k<chargerStation.connectorOccupied;k++){
		ledStr += '<div class="led-box" data-chargeId="' + chargerStation.uuid + '" data-connector="' + k + '"><div class="led-yellow"></div></div>';
	}
	for(var k=0;k<chargerStation.connectorErrors;k++){
		ledStr += '<div class="led-box" data-chargeId="' + chargerStation.uuid + '" data-connector="' + k + '"><div class="led-red"></div></div>';
	}
	for(var k=0;k<chargerStation.connectorUnknown;k++){
		ledStr += '<div class="led-box" data-chargeId="' + chargerStation.uuid + '" data-connector="' + k + '"><div class="led-grey"></div></div>';
	}

	tmpStr += ledStr;
	tmpStr += '</div>';
	tmpStr += templateFunction( chargerStation.connectors );
	tmpStr += '</div>'; 	//well


	tmpStr += "<br> --------- ";
	tmpStr += "<br>Offentlig: " + chargerStation.public;
	tmpStr += "<br>Åpen: " + chargerStation.open;
	tmpStr += "<br>Avgift: " + chargerStation.fee;
	tmpStr += "<br>Tidsbegrensning: " + chargerStation.timeLimit;
	tmpStr += "<br> --------- ";	

	return tmpStr;		
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
		//console.log('Message from the stream api');
		var message = JSON.parse(e.data);
		//console.log(message.type);
		if(message.type == "snapshot:init"){
			setupStreamNobilLayer(message.data, chargingStations);
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
}

function setupStaticNobilLayer(map){
	staticNobil = L.featureGroup.subGroup(parentCluster);
	var chargingStations = [];

	$.ajax({
	   url: "https://mats.maplytic.no/proxy/nobil.no/api/server/datadump.php",
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

			for(var i = 0; i < response.chargerstations.length; i++) {
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
					marker.bindPopup("<strong>Charger Station:</strong> <br>" + tittel + "<br> Beskrivelse: " + alt );

					//adds marker to sub group
					staticNobil.addLayer(marker);
					//add charger
					chargingStations.push(response.chargerstations[i]);
				}
			}
			initSocketConnection(chargingStations);
	   }
	});
	return staticNobil;
}

function addJsonpData(data){
	dataJsonP = data;
}

function setupStreamNobilLayer(streamData, chargingStations){
	tempDevArray = [];
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
					if (chargingStations[i].attr.conn[k+1] == null){
						console.log(streamData[j].uuid + " missing connectors");
					} else{
						connector.connector = chargingStations[i].attr.conn[k+1][4].trans;
						connector.capacity = chargingStations[i].attr.conn[k+1][5].trans;
						tempDevArray.push(chargingStations[i].attr.conn[k+1][4].trans);
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

				//create charger station object
				var chargerStation = {
					uuid: streamData[j].uuid,
					name: "",
					description:"",
					coords: [-1,-1],
					status: streamData[j].status,
					statusRead:"",
					connectors: connectors
				};

				//"build" charger station
				chargerStation.name = tittel;
				chargerStation.description = alt;
				chargerStation.address = chargingStations[i].csmd.Street + " " + chargingStations[i].csmd.House_number;
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

				//create and add marker to layer
				var marker = L.marker([latitude, longitude], {icon: statusIcon, title: chargerStation.uuid}).on('click', markerClick);
				ladeStasjonNobilStreamLayer.addLayer(marker);

				rtChargingStationsArray[streamData[j].uuid] = chargerStation;
				dynamicMarkers[streamData[j].uuid] = marker;
				break;
			}
		}
	}

	var types = [];
	var nrOfEachType = {};
	for(var i=0;i<tempDevArray.length;i++){
		var newType = true;
		for(var j=0;j<types.length;j++){
			if(tempDevArray[i] == types[j]){
				newType = false;
			}
		}
		if(newType){
			types.push(tempDevArray[i])
			nrOfEachType[tempDevArray[i]] = 1;
		} else{
			nrOfEachType[tempDevArray[i]]++;
		}
	}

	for(var i=0;i<types.length;i++){
		console.log("Nr of " + types[i] + ": " + nrOfEachType[types[i]]);
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

		//remove
		console.log("Charging Station '" + streamChargerUpdate.uuid + "':");
		console.log("Station Status: " + rtChargingStationsArray[streamChargerUpdate.uuid].statusRead + " --> " + statusRead);
		console.log("****************************************************");
		//

		//update station array
		rtChargingStationsArray[streamChargerUpdate.uuid].status = streamChargerUpdate.status;
		rtChargingStationsArray[streamChargerUpdate.uuid].statusRead = statusRead;
		rtChargingStationsArray[streamChargerUpdate.uuid].connectorUnknown = connectorUnknown;
		rtChargingStationsArray[streamChargerUpdate.uuid].connectorAvailable = connectorAvailable;
		rtChargingStationsArray[streamChargerUpdate.uuid].connectorOccupied = connectorOccupied;
		rtChargingStationsArray[streamChargerUpdate.uuid].connectorErrors = connectorErrors;
		rtChargingStationsArray[streamChargerUpdate.uuid].connectors = connectorsUpdate;

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


