Map = (function($) {

	map = null;
	
	var layersControl;

	init = function(container) {
		var theMap = L.map(container, {
			maxZoom: 18
		});
		theMap.setView([64, 13], 5);

		// add default layers

		var mapLink =
			'<a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a>';
		var osm_layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		});
		//Norges Grunnkart Graatone
		var kartverk_graatone_layer = L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart_graatone&zoom={z}&x={x}&y={y}', {
			attribution: 'Kartverket'
		});
		//kartverket topografisk kart
		var kartverk_topo2_layer = L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo2&zoom={z}&x={x}&y={y}', {
			attribution: 'Kartverket'
		});
		//kartverket ionosphere	 
		var kartverk_toporaster3_layer = L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=toporaster3&zoom={z}&x={x}&y={y}', {
			attribution: 'Kartverket'
		});
		
		var baseMaps = {
			'OpenStreetMap': osm_layer,
			'Norgeskart Gråtone': kartverk_graatone_layer,
			'Topografisk Norgeskart v2': kartverk_topo2_layer,
			'Topografisk Norgeskart v3': kartverk_toporaster3_layer,			
		}

		var overlayMapsss = {
			
		}
		
		baseMaps['OpenStreetMap'].addTo(theMap);
		layersControl = L.control.layers(baseMaps, overlayMapsss).addTo(theMap);
		
		map = theMap;
		
	};
	
	addLayer = function(layer) {
		map.addLayer(layer);
        layer.bringToFront(); 
	}

	removeLayer = function(layer) {
		map.removeLayer(layer);
	}

	addOverlay = function(name, layer) {
		layersControl.addOverlay(layer, name); 
	}
	
	getMap = function() {
		return map;
	}

	return {
	    init: init,
	    addLayer: addLayer,
	    removeLayer: removeLayer,
	    addOverlay: addOverlay,
	    getMap: getMap,
	}

})(jQuery);
