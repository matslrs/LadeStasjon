function setupIcons(map){
	var LeafIcon = L.Icon.extend({
	    options: {
	        shadowUrl: 'leaflet/images/leaf-shadow.png',
	        iconSize:     [34, 34],
	        shadowSize:   [0, 0],
	        iconAnchor:   [17, 34],
	        shadowAnchor: [4, 62],
	        popupAnchor:  [-3, -76]
	    }
	});

	// //Defined w/o var to make them global
	// payBooth = new LeafIcon({iconUrl: 'images/flaticon/paybooth.png', iconSize:[32,32], iconAnchor:[16, 32]}),
	// pointOfInterest = new LeafIcon({iconUrl: 'images/flaticon/poi.png', iconSize:[32,32], iconAnchor:[16, 32]}),
	// kinderGarten = new LeafIcon({iconUrl: 'images/flaticon/kindergarten.png'}),
	// kinderGarten2 = new LeafIcon({iconUrl: 'images/flaticon/schoolkid.png'}),
	// learning = new LeafIcon({iconUrl: 'images/flaticon/letters.png'}),
	// restRoom = new LeafIcon({iconUrl: 'images/flaticon/man.png'}),
	// health = new LeafIcon({iconUrl: 'images/flaticon/health.png', iconSize:[30,30], iconAnchor:[15, 30]}),
	// greenIcon = new LeafIcon({iconUrl: 'leaflet/images/leaf-green.png'}),
 //    redIcon = new LeafIcon({iconUrl: 'leaflet/images/leaf-red.png'}),
 //    orangeIcon = new LeafIcon({iconUrl: 'leaflet/images/leaf-orange.png'});

	
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
	    markerColor: 'darkpuple'
	});

	medicineMarker = L.AwesomeMarkers.icon({
	    prefix: 'fa',
	    icon: 'plus-square',
	    markerColor: 'red'
	});

	hospitalIcon = L.AwesomeMarkers.icon({
	    prefix: 'fa',
	    icon: 'fa-hospital-o',
	    markerColor: 'red'
	});

	kindergartenMarker = L.AwesomeMarkers.icon({
	    prefix: 'fa',
	    icon: 'fa-child',
	    markerColor: 'blue'
	});

	bookIcon = L.AwesomeMarkers.icon({
	    prefix: 'fa',
	    icon: 'fa-book',
	    markerColor: 'blue'
	});

	lekePlassIcon = L.AwesomeMarkers.icon({
	    prefix: 'fa',
	    icon: 'fa-cubes',
	    markerColor: 'purple'
	});

	pointOfInterest = L.AwesomeMarkers.icon({
	    prefix: 'fa',
	    icon: 'fa-eye',
	    markerColor: 'lightblue'
	});

	gravlundIcon = L.AwesomeMarkers.icon({
	    prefix: 'fa',
	    icon: 'fa-square',
	    markerColor: 'gray'
	});

	troIcon = L.AwesomeMarkers.icon({
	    prefix: 'fa',
	    icon: 'fa-bell',
	    markerColor: 'lightgray'
	});

	utleieIcon = L.AwesomeMarkers.icon({
	    prefix: 'fa',
	    icon: 'fa-building',
	    markerColor: 'black'
	});

	vannIcon = L.AwesomeMarkers.icon({
	    prefix: 'fa',
	    icon: 'fa-tint',
	    markerColor: 'cadetblue'
	});

	payBooth = L.AwesomeMarkers.icon({
	    prefix: 'fa',
	    icon: 'fa-ticket ',
	    markerColor: 'darkpurple'
	});

	restRoomFA = L.AwesomeMarkers.icon({
	    prefix: 'fa',
	    icon: 'fa-venus-mars ',
	    markerColor: 'darkgreen'
	});

	miljoStasjon = L.AwesomeMarkers.icon({
	    prefix: 'fa',
	    icon: 'fa-recycle',
	    markerColor: 'green'
	});

	carCharge = L.AwesomeMarkers.icon({
	    prefix: 'fa',
	    icon: 'fa-car ',
	    markerColor: 'yellow'
	});

	pickupBox = L.AwesomeMarkers.icon({
	    prefix: 'fa',
	    icon: 'fa-archive ',
	    markerColor: 'beige'
	});

	bicycleIcon = L.AwesomeMarkers.icon({
	    prefix: 'fa',
	    icon: 'fa-bicycle ',
	    markerColor: 'green'
	});
}