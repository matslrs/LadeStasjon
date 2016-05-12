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

	//Defined w/o var to make them global
	payBooth = new LeafIcon({iconUrl: 'images/flaticon/paybooth.png', iconSize:[32,32], iconAnchor:[16, 32]/*, attribution: 'FlatIcon'*/}),
	kinderGarten = new LeafIcon({iconUrl: 'images/flaticon/kindergarten.png'}),
	kinderGarten2 = new LeafIcon({iconUrl: 'images/flaticon/schoolkid.png'}),
	learning = new LeafIcon({iconUrl: 'images/flaticon/letters.png'}),
	restRoom = new LeafIcon({iconUrl: 'images/flaticon/man.png'}),
	health = new LeafIcon({iconUrl: 'images/flaticon/health.png', iconSize:[30,30], iconAnchor:[15, 30]}),
	greenIcon = new LeafIcon({iconUrl: 'leaflet/images/leaf-green.png'}),
    redIcon = new LeafIcon({iconUrl: 'leaflet/images/leaf-red.png'}),
    orangeIcon = new LeafIcon({iconUrl: 'leaflet/images/leaf-orange.png'});

	
	medicineMarker = L.AwesomeMarkers.icon({
	    prefix: 'fa',
	    icon: 'plus-square',
	    markerColor: 'red'
	});

	kindergartenMarker = L.AwesomeMarkers.icon({
	    prefix: 'fa',
	    icon: 'fa-cubes',
	    markerColor: 'blue'
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

	carCharge = L.AwesomeMarkers.icon({
	    prefix: 'fa',
	    icon: 'fa-car ',
	    markerColor: 'yellow'
	});
}