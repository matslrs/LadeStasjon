NveData = (function($){
	

	init =	function(map) {
	
		setupFlomVarsel(map);
		overlayMaps["floodForecast"] = flomDataQuery;

		setupJordskredVarsel(map);
		overlayMaps["landslideForecast"] = skredDataQuery;
	}

	function setupFlomVarsel(map) {

		flomDataQuery = L.geoJson(null, {
		    style: function (feature) {
		        return {color: feature.properties.color};
		    },
		    onEachFeature: function (feature, layer) {
		        layer.bindPopup("<strong>" + feature.properties.navn +  "</strong> <br>" + "Varsel: " + feature.properties.beskrivelse);
		    }
		});
		var sqlFlomKommuner = null;

		//test data for storm dag 5.12-15
		$.ajax({
		    type: 'GET',
		    url: "https://mats.maplytic.no/proxy/api01.nve.no/hydrology/forecast/flood/v1.0.4/api/CountyOverview/1/2015-12-5/2015-12-5",
		    success: function(data) { 	
		    	flomTest = data;
		    	var kommuneNr = [];

		    	//går gjennom alle komuner
		    	for(var i=0;i<flomTest.length;i++){
		    		//hvis fylke har høy nok aktivitets nivå
		    		if( flomTest[i].HighestActivityLevel > 1){
		    			//gå gjennom kommuner i det fylke
		    			for(var j=0;j<flomTest[i].MunicipalityList.length;j++){
		    				//hvis kommunen høyt nok aktivitets nivå --> process
		    				if( flomTest[i].MunicipalityList[j].WarningList[0].ActivityLevel > 1){

		    					//kommune nr
		    					kommuneNr[kommuneNr.length] = flomTest[i].MunicipalityList[j].Id;
		    					//aktivitets nivå
		    					aNivaa = flomTest[i].MunicipalityList[j].WarningList[0].ActivityLevel;
		    					//farge
		    					if(aNivaa==2){
		    						color = '#FFFF00';
		    					}
		    					else if(aNivaa==3){
		    						color = '#ffa500';
		    					}
		    					else{
		    						color = '#FF0000';
		    					}
		    					//beskrivelse
		    					varselTekst = flomTest[i].MunicipalityList[j].WarningList[0].MainText;


		    					//lagrer data i en 2d array for bruk i getJSON nedenfor
		    					flomKommuneInfo[kommuneNr[kommuneNr.length-1]] = [];
		    					flomKommuneInfo[kommuneNr[kommuneNr.length-1]]["aNivaa"] = aNivaa;
		    					flomKommuneInfo[kommuneNr[kommuneNr.length-1]]["color"] = color;
		    					flomKommuneInfo[kommuneNr[kommuneNr.length-1]]["varselTekst"] = varselTekst;
		    				}
		    			}
		    		}
		    	}

		    	//hvis flomvarsel
		    	if(kommuneNr.length > 0){


			    	//toleranse i ST_Simplify
					var tolerance = 0.01*7/map.getZoom();
					//gets the bound of the initial zoom and position
					initialBounds = map.getBounds();
					neLat = initialBounds.getNorth();
					neLng = initialBounds.getEast();
					swLat = initialBounds.getSouth();
					swLng = initialBounds.getWest();

					//sql query code
			    	var sqlString = 'SELECT navn, komm, ST_Simplify(geom, ' + tolerance + ') AS geom FROM kommuner ';

			    	var sqlFlomKommunerTemp = 'WHERE komm IN (';
			    	//append the rest of the query code
			    	for(var i=0;i<kommuneNr.length;i++){

			    		if(i==0){
			    			appendString = kommuneNr[i];
			    		}
			    		else{
			    			appendString = ',' + kommuneNr[i];
			    		}

			    		sqlFlomKommunerTemp = sqlFlomKommunerTemp.concat(appendString);
			    	}
			    	//close kommune array
			    	sqlFlomKommunerTemp = sqlFlomKommunerTemp.concat( ')');

			    	//close sql statement
			    	sqlString = sqlString.concat( sqlFlomKommunerTemp );
			    	sqlString = sqlString.concat( ' AND kommuner.geom && ST_MakeEnvelope(' + swLng + ', ' + swLat + ', ' + neLng + ', ' + neLat + ')' );

			    	//lag URL
			    	var url = 'https://mats.maplytic.no/sql/' + encodeURIComponent(sqlString) + '/out.geojson';

			    	//Hent data
					$.getJSON(url, function(data) {

						for(var i=0;i<data.features.length;i++){

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
					    flomDataQuery.addData(data);


				  	});	
				  	//denne settes på slutten sånn at den kan brukes som
					//en sjekk for å se om setup av dynamisk lag er ferdig.
					sqlFlomKommuner = sqlFlomKommunerTemp;
				}
		    },
		    contentType: "application/json",
		    dataType: 'json'
		});
	}

	function setupJordskredVarsel(map) {

		skredDataQuery = L.geoJson(null, {
		    style: function (feature) {
		        return {color: feature.properties.color};
		    },
		    onEachFeature: function (feature, layer) {
		        layer.bindPopup("<strong>" + feature.properties.navn +  "</strong> <br>" + "Varsel: " + feature.properties.beskrivelse);
		    }
		});
		var sqlSkredKommuner = null;

		//test data for storm dag 5.12-15
		$.ajax({
		    type: 'GET',
		    url: "https://mats.maplytic.no/proxy/api01.nve.no/hydrology/forecast/landslide/v1.0.4/api/CountyOverview/1/2015-12-5/2015-12-5",
		    success: function(data) { 	
		    	flomTest = data;
		    	var kommuneNr = [];

		    	//går gjennom alle komuner
		    	for(var i=0;i<flomTest.length;i++){
		    		//hvis fylke har høy nok aktivitets nivå
		    		if( flomTest[i].HighestActivityLevel > 1){
		    			//gå gjennom kommuner i det fylke
		    			for(var j=0;j<flomTest[i].MunicipalityList.length;j++){
		    				//hvis kommunen høyt nok aktivitets nivå --> process
		    				if( flomTest[i].MunicipalityList[j].WarningList[0].ActivityLevel > 1){

		    					//kommune nr
		    					kommuneNr[kommuneNr.length] = flomTest[i].MunicipalityList[j].Id;
		    					//aktivitets nivå
		    					aNivaa = flomTest[i].MunicipalityList[j].WarningList[0].ActivityLevel;
		    					//farge
		    					if(aNivaa==2){
		    						color = '#FFFF00';
		    					}
		    					else if(aNivaa==3){
		    						color = '#ffa500';
		    					}
		    					else{
		    						color = '#FF0000';
		    					}
		    					//beskrivelse
		    					varselTekst = flomTest[i].MunicipalityList[j].WarningList[0].MainText;


		    					//lagrer data i en 2d array for bruk i getJSON nedenfor
		    					skredKommuneInfo[kommuneNr[kommuneNr.length-1]] = [];
		    					skredKommuneInfo[kommuneNr[kommuneNr.length-1]]["aNivaa"] = aNivaa;
		    					skredKommuneInfo[kommuneNr[kommuneNr.length-1]]["color"] = color;
		    					skredKommuneInfo[kommuneNr[kommuneNr.length-1]]["varselTekst"] = varselTekst;
		    				}
		    			}
		    		}
		    	}

		    	//hvis flomvarsel
		    	if(kommuneNr.length > 0){


			    	//toleranse i ST_Simplify
					var tolerance = 0.01*7/map.getZoom();
					//gets the bound of the initial zoom and position
					initialBounds = map.getBounds();
					neLat = initialBounds.getNorth();
					neLng = initialBounds.getEast();
					swLat = initialBounds.getSouth();
					swLng = initialBounds.getWest();

					//sql query code
			    	var sqlString = 'SELECT navn, komm, ST_Simplify(geom, ' + tolerance + ') AS geom FROM kommuner ';

			    	var sqlSkredKommunerTemp = 'WHERE komm IN (';
			    	//append the rest of the query code
			    	for(var i=0;i<kommuneNr.length;i++){

			    		if(i==0){
			    			appendString = kommuneNr[i];
			    		}
			    		else{
			    			appendString = ',' + kommuneNr[i];
			    		}

			    		sqlSkredKommunerTemp = sqlSkredKommunerTemp.concat(appendString);
			    	}
			    	//close kommune array
			    	sqlSkredKommunerTemp = sqlSkredKommunerTemp.concat( ')');

			    	//close sql statement
			    	sqlString = sqlString.concat( sqlSkredKommunerTemp );
			    	sqlString = sqlString.concat( ' AND kommuner.geom && ST_MakeEnvelope(' + swLng + ', ' + swLat + ', ' + neLng + ', ' + neLat + ')' );

			    	//lag URL
			    	var url = 'https://mats.maplytic.no/sql/' + encodeURIComponent(sqlString) + '/out.geojson';

			    	//Hent data
					$.getJSON(url, function(data) {

						for(var i=0;i<data.features.length;i++){
							//dårlig quick fix
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
					    skredDataQuery.addData(data);


				  	});	
				  	//denne settes på slutten sånn at den kan brukes som
					//en sjekk for å se om setup av dynamisk lag er ferdig.
					sqlSkredKommuner = sqlSkredKommunerTemp;
				}
		    },
		    contentType: "application/json",
		    dataType: 'json'
		});
	}

	return {
	    init: init,
	}

})(jQuery);



