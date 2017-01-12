MaplyticData = (function($){
	
	init =	function() {
		var FylkeGeoJLayer = loadFylkeGeoJSONs(map);
		overlayMaps["fylkeBorder"] = FylkeGeoJLayer;

		var KommuneGeoJLayer = loadKommuneGeoJSONs(map);
		overlayMaps["municipalityBorder"] = KommuneGeoJLayer;

		var maplyticTiles = maplyticTileApi(map);
		overlayMaps["fylkeBorderv2"] = maplyticTiles;

		var GrunnkretsTile = loadGrunnkretsTile(map);
		overlayMaps["grunnkretsBorder"] = GrunnkretsTile;
	}

	function maplyticTileApi(map) {
		var maplyticTile = L.tileLayer('https://mats.maplytic.no/tile/fylker/{z}/{x}/{y}.png?linewidth=3');
		return maplyticTile;
	}

	function loadFylkeGeoJSONs(map) {
		var FylkeGeoJLayer = L.geoJson();
		$.getJSON('https://mats.maplytic.no/table/fylker.geojson', function(data) {
			FylkeGeoJLayer.addData(data);
		});
		return FylkeGeoJLayer;
	}

	function loadKommuneGeoJSONs(map) {
		var KommuneGeoJLayer = L.geoJson();
		$.getJSON('https://mats.maplytic.no/table/kommuner.geojson', function(data) {
			KommuneGeoJLayer.addData(data);
		});
		return KommuneGeoJLayer;
	}

	function loadGrunnkretsTile(map) {
		GrunnkretsTile = L.tileLayer('https://mats.maplytic.no/tile/grunnkretser/{z}/{x}/{y}.png?linewidth=1');
		return GrunnkretsTile;
	}

	return {
	    init: init,
	}

})(jQuery);



