YrData = (function($){
	

	init =	function() {
		var værData = weatherData();
		overlayMaps["weatherForecasts"] = værData;

		var værDataPost = weatherDataPostCode();
		overlayMaps["weatherForecastsPostal"] = værDataPost;
	}

	function weatherData(){
		var weather = L.featureGroup.subGroup(parentCluster);

		$.getJSON("weatherPlaces.json", function(json) {
		    //console.log(json); // this will show the info in firebug console

			var data = json;	
			for (var i = 0; i < data.length; i++) {
				if(data[i].Prioritet < 30){
					//Finner data som skal brukes
					var lengdeGrad = data[i].Lon;
					var breddeGrad = data[i].Lat;
					if(isNaN(lengdeGrad) || isNaN(breddeGrad)){
						console.log("entry " + i + " have NaN as Lat/Lon");
					}
					var tittel = data[i].Stadnamn;
					var type = data[i].Stadtypebokmål;
					var link = data[i].Bokmål;
					var link = link.replace("http://www.", "https://mats.maplytic.no/proxy?url=https://www."); 

					var marker = L.marker([breddeGrad, lengdeGrad], {icon: sunIcon});
					marker.bindPopup("<strong>Været for "+ tittel +"</strong> <br> Type sted: "+ type + "<br><br>");
					marker.weatherLink = link;
					marker.timeUpdated = 0;
					marker.on('click', weatherClick);

					//adds marker to sub group
					weather.addLayer(marker);
				}
			}
		});

		return weather;
	}

	function weatherClick(e){
		var date = new Date();
		var time = date.getTime(); 
		//if more than 10 min since last update for this marker, allow a new update.
		if(time>e.target.timeUpdated + 600000){
			console.log("requesting updated weater forecast!");
			e.target.timeUpdated = time;
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
			  readWeatherForecast(xhttp, e.target);
			}
			};
			xhttp.open("GET", e.target.weatherLink, true);
			xhttp.send();
		}
	}

	function readWeatherForecast(xml, marker){
		var xmlDoc = xml.responseXML;
		var popContent = marker.getPopup().getContent();
		var x = xmlDoc.getElementsByTagName("text");
		for (var i = 0; i <x.length; i++) { 
		    popContent += "<br><strong>" +
		    x[i].getElementsByTagName("title")[0].childNodes[0].nodeValue +
		    "</strong><br>" +
		    x[i].getElementsByTagName("body")[0].childNodes[0].nodeValue +
		    "<br><br>";
	  	}
	  	marker.getPopup().setContent(popContent);
	}

	function weatherDataPostCode(){
		var weatherPost = L.featureGroup.subGroup(parentCluster);

		$.getJSON("weatherPostCode.json", function(json) {
		    //console.log(json); // this will show the info in firebug console

			var data = json;	
			for (var i = 0; i < data.length; i++) {
				//Finner data som skal brukes
				var lengdeGrad = data[i].Lon;
				var breddeGrad = data[i].Lat;
				if(isNaN(lengdeGrad) || isNaN(breddeGrad)){
					console.log("entry " + i + " have NaN as Lat/Lon");
				}
				var tittel = data[i].Poststad;
				var postNr = data[i].Postnr;
				var link = data[i].Bokmål;
				var link = link.replace("http://www.", "https://mats.maplytic.no/proxy?url=https://www."); 

				var marker = L.marker([breddeGrad, lengdeGrad], {icon: sunIcon});
				marker.bindPopup("<strong>Været for "+ tittel +"</strong> <br> Post Nr: "+ postNr + "<br><br>");
				marker.weatherLink = link;
				marker.timeUpdated = 0;
				marker.on('click', weatherClick);

				//adds marker to sub group
				weatherPost.addLayer(marker);
			}
		});

		return weatherPost;
	}

	return {
	    init: init,
	}

})(jQuery);



