function setupSearch(map) {
	
	map.addControl( new L.Control.Search({
			url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
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
