DifiData = (function($){
	

	init =	function() {
		//////////////
		///
		///	MÅ GJØRE ALLE DIFI SETS SÅNN SOM BARNEHAGE I TILFELLE DE VOKSER TIL OVER 100 ENTRIES
		///
		//////////////
		var helseStasjonDifi = difiHelsestasjon();
		overlayMaps["healthStationLayer"] = helseStasjonDifi;

		var helseByggDifi = difiHelseBygg();
		overlayMaps["healthBuildingLayer"] = helseByggDifi;

		var barnehageDifi = difiBarnehage();
		overlayMaps["kindergartenStavanger"] = barnehageDifi;

		var toalettDifi = difiToalett();
		overlayMaps["toiletLayer"] = toalettDifi;

		var miljoStasjonDifi = difiMiljoStasjon();
		overlayMaps["enviornmentStationLayer"] = miljoStasjonDifi;

		var utsiktDifi = difiUtsiktsPunkt();
		overlayMaps["outlookArea"] = utsiktDifi;

		var gravlundDifi = difiGravlunder();
		overlayMaps["cemeteryStavanger"] = gravlundDifi;

		var trosBygningDifi = difiTrosBygning();
		overlayMaps["faithBuildingStavanger"] = trosBygningDifi;

		var badePlassDifi = difiBadePlass();
		overlayMaps["swimmingArea"] = badePlassDifi;

		var lekePlassDifi = difiLekeplass();
		overlayMaps["playGround"] = lekePlassDifi;

		var utleieLokal = difiUtleielokaler();
		overlayMaps["rentingSpaceGjesdal"] = utleieLokal;

		var barnehageGjesdal = difiBarnehageGjesdal();
		overlayMaps["kindergartenGjesdal"] = barnehageGjesdal;

		var grunnskoleGjesdal = difiSkoleGjesdal();
		overlayMaps["schoolGjesdal"] = grunnskoleGjesdal;

		var bomstasjonDifi = difiBomstasjon();
		overlayMaps["layerBomstasjon"] = bomstasjonDifi;

	}

	function difiHelsestasjon() {
	var helsestasjonGroup = L.featureGroup.subGroup(parentCluster);
	var url = 'https://hotell.difi.no/api/json/stavanger/helsestasjoner?';
	
	$.get(url, function(data) {
		var difiData = data;	
		for (var i = 0; i < difiData.entries.length; i++) {	
			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].lengdegrad;
			var breddeGrad = difiData.entries[i].breddegrad;
			var tittel = difiData.entries[i].navn;
			var alt = difiData.entries[i].adresse;

			//creates the marker
			var marker = L.marker([breddeGrad, lengdeGrad], {icon: medicineMarker});
			marker.bindPopup("<strong>" + tittel +  "</strong> <br> Adresse:"+ alt);

			//adds marker to sub group
			helsestasjonGroup.addLayer( marker );
		}
	});

	return helsestasjonGroup;
}

function difiHelseBygg() {
	var helseByggGroup = L.featureGroup.subGroup(parentCluster);
	var url = 'https://hotell.difi.no/api/json/stavanger/helsebygg?';
	
	$.get(url, function(data) {
		var difiData = data;
		for (var i = 0; i < difiData.entries.length; i++) {	
			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].longitude;
			var breddeGrad = difiData.entries[i].latitude;
			var tittel = difiData.entries[i].navn;
			var alt = difiData.entries[i].adresse;

			//creates the marker
			var marker = L.marker([breddeGrad, lengdeGrad], {icon: hospitalIcon});
			marker.bindPopup("<strong>" + tittel +  "</strong> <br> Adresse:"+ alt);

			//adds marker to sub group
			helseByggGroup.addLayer( marker );
		}
	});

	return helseByggGroup;
}

function difiBarnehage() {
	var barnehageGroup = L.featureGroup.subGroup(parentCluster);
	var url = 'https://hotell.difi.no/api/json/stavanger/barnehager?';
	var page = 1;

	$.get(url, function(data) {
		var difiData = data;
		for (var i = 0; i < difiData.entries.length; i++) {
			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].lengdegrad;
			var breddeGrad = difiData.entries[i].breddegrad;
			var tittel = difiData.entries[i].barnehagens_navn;
			var alt = difiData.entries[i].adresse;

			var marker = L.marker([breddeGrad, lengdeGrad], {icon: kindergartenMarker});
			marker.bindPopup("<strong> Barnehage: </strong><br>" + tittel + "<br> <strong>Adresse:</strong><br> " + alt);
			
			//adds marker to sub group
			barnehageGroup.addLayer( marker );
		}

		//Difi only gives the first 100 entries, if there are more they need to be requested on a separete url
		page++;
		var pages = difiData.pages;
		while(page<=pages){
			var url = 'https://hotell.difi.no/api/json/stavanger/barnehager?page=' + page;
			$.get(url, function(data) {
				var difiData = data;
				for (var i = 0; i < difiData.entries.length; i++) {
					
					//Finner data som skal brukes
					var lengdeGrad = difiData.entries[i].lengdegrad;
					var breddeGrad = difiData.entries[i].breddegrad;
					var tittel = difiData.entries[i].barnehagens_navn;
					var alt = difiData.entries[i].adresse;

					var marker = L.marker([breddeGrad, lengdeGrad], {icon: kindergartenMarker});
					marker.bindPopup("<strong> Barnehage: </strong><br>" + tittel + "<br> <strong>Adresse:</strong><br> " + alt);
					
					//adds marker to sub group
					barnehageGroup.addLayer( marker );
				}
			});
			page++;
		}
	});

	return barnehageGroup;
}

function difiToalett() {
	var toalettGroup = L.featureGroup.subGroup(parentCluster);
	var url = 'https://hotell.difi.no/api/json/stavanger/offentligetoalett?';

	$.get(url, function(data) {
		var difiData = data;
		for (var i = 0; i < difiData.entries.length; i++) {
			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].longitude;
			var breddeGrad = difiData.entries[i].latitude;
			var tittel = difiData.entries[i].plassering;
			var alt = difiData.entries[i].adresse;
			var pris = difiData.entries[i].pris;
			
			if(lengdeGrad == "" || breddeGrad == ""){
				continue;
			}

			var marker = L.marker([breddeGrad, lengdeGrad], {icon: restRoomFA});
			marker.bindPopup("<strong> Offentlig Toalett:</strong> "+ tittel +"<br>"+ alt + "<br> Pris: " + pris);

			//adds marker to sub group
			toalettGroup.addLayer(marker);
		}
	});

	return toalettGroup;
}

function difiMiljoStasjon() {
	var miljoStasjoner = L.featureGroup.subGroup(parentCluster);
	var url = 'https://hotell.difi.no/api/json/stavanger/miljostasjoner?';
	
	$.get(url, function(data) {
		var difiData = data;
		for (var i = 0; i < difiData.entries.length; i++) {
			
			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].longitude;
			var breddeGrad = difiData.entries[i].latitude;
			var tittel = difiData.entries[i].navn;
			var glassMetal = difiData.entries[i].glass_metall;
			var plast = difiData.entries[i].plast;
			var tekstilSko = difiData.entries[i].tekstil_sko;
			
			if(lengdeGrad == "" || breddeGrad == ""){
				continue;
			}

			var marker = L.marker([breddeGrad, lengdeGrad], {icon: miljoStasjon});
			marker.bindPopup("<strong> Miljøstasjon:</strong> "+ tittel +"<br> Glass og metal: "+ glassMetal + "<br> Plast: " + plast + "<br> Tekstil og sko: " + tekstilSko);

			//adds marker to sub group
			miljoStasjoner.addLayer(marker);
		}
	});

	return miljoStasjoner;
}

function difiUtsiktsPunkt() {
	var utsiktsPunkt = L.featureGroup.subGroup(parentCluster);
	var url = 'https://hotell.difi.no/api/json/stavanger/utsiktspunkt?';
	
	$.get(url, function(data) {
		var difiData = data;
		for (var i = 0; i < difiData.entries.length; i++) {
			
			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].longitude;
			var breddeGrad = difiData.entries[i].latitude;
			var tittel = difiData.entries[i].name;
			var address = difiData.entries[i].adressenavn;
			
			var marker = L.marker([breddeGrad, lengdeGrad], {icon: pointOfInterest});
			marker.bindPopup("<strong>Utsiktspunkt:</strong> <br>" + tittel + "<br> Addressenavn: " + address);

			//adds marker to sub group
			utsiktsPunkt.addLayer(marker);
		}
	});

	return utsiktsPunkt;
}

function difiGravlunder() {
	var gravlunder = L.featureGroup.subGroup(parentCluster);
	var url = 'https://hotell.difi.no/api/json/stavanger/gravlunder?';
	
	$.get(url, function(data) {
		//var difiData = JSON.parse(data);
		var difiData = data;
		
		for (var i = 0; i < difiData.entries.length; i++) {
			
			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].longitude;
			var breddeGrad = difiData.entries[i].latitude;
			var tittel = difiData.entries[i].name;
			var address = difiData.entries[i].adressenavn;
			
			var marker = L.marker([breddeGrad, lengdeGrad], {icon: gravlundIcon});
			marker.bindPopup("<strong>Gravlunder:</strong> <br>" + tittel + "<br> Addressenavn: " + address);

			//adds marker to sub group
			gravlunder.addLayer(marker);
		}
	});

	return gravlunder;
}

function difiTrosBygning() {
	var trosBygning = L.featureGroup.subGroup(parentCluster);
	var url = 'https://hotell.difi.no/api/json/stavanger/kirkerkapellermoskeer?';
	
	$.get(url, function(data) {
		var difiData = data;
		for (var i = 0; i < difiData.entries.length; i++) {
			
			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].longitude;
			var breddeGrad = difiData.entries[i].latitude;
			var tittel = difiData.entries[i].name;
			var address = difiData.entries[i].adressenavn;
			
			var marker = L.marker([breddeGrad, lengdeGrad], {icon: troIcon});
			marker.bindPopup("<strong>Relgiøs bygning:</strong> <br>" + tittel + "<br> Addressenavn: " + address);

			//adds marker to sub group
			trosBygning.addLayer(marker);
		}
	});

	return trosBygning;
}

function difiBadePlass() {
	var badePlass = L.featureGroup.subGroup(parentCluster);
	var url = 'https://hotell.difi.no/api/json/stavanger/badeplasser?';
	
	$.get(url, function(data) {
		var difiData = data;
		for (var i = 0; i < difiData.entries.length; i++) {
			
			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].longitude;
			var breddeGrad = difiData.entries[i].latitude;
			var tittel = difiData.entries[i].name;
			var address = difiData.entries[i].adressenavn;
			
			var marker = L.marker([breddeGrad, lengdeGrad], {icon: vannIcon});
			marker.bindPopup("<strong>Badeplass:</strong> <br>" + tittel + "<br> Addressenavn: " + address);

			//adds marker to sub group
			badePlass.addLayer(marker);
		}
	});

	return badePlass;
}

function difiUtleielokaler() {
	var utleieLokal = L.featureGroup.subGroup(parentCluster);
	var url = 'https://hotell.difi.no/api/json/gjesdal/utleielokaler?';
	
	$.get(url, function(data) {
		var difiData = data;
		for (var i = 0; i < difiData.entries.length; i++) {
			
			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].lengdegrad;
			lengdeGrad = lengdeGrad.replace(",", "."); 
			var breddeGrad = difiData.entries[i].breddegrad;
			breddeGrad = breddeGrad.replace(",", "."); 
			var tittel = difiData.entries[i].navn;
			var address = difiData.entries[i].adresse;
			var type = difiData.entries[i].type;
			
			var marker = L.marker([breddeGrad, lengdeGrad], {icon: utleieIcon});
			marker.bindPopup("<strong>Utleielokal:</strong> <br>" + tittel + "<br> Addressenavn: " + address + "<br> Type: " + type);

			//adds marker to sub group
			utleieLokal.addLayer(marker);
		}
	});

	return utleieLokal;
}

function difiBarnehageGjesdal() {
	var barnehageGjesdal = L.featureGroup.subGroup(parentCluster);
	var url = 'https://hotell.difi.no/api/json/gjesdal/barnehager?';
	
	$.get(url, function(data) {
		var difiData = data;
		for (var i = 0; i < difiData.entries.length; i++) {
			
			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].lengdegrad;
			lengdeGrad = lengdeGrad.replace(",", "."); 
			var breddeGrad = difiData.entries[i].breddegrad;
			breddeGrad = breddeGrad.replace(",", "."); 
			var tittel = difiData.entries[i].navn;
			var address = difiData.entries[i].adresse;
			
			var marker = L.marker([breddeGrad, lengdeGrad], {icon: kindergartenMarker});
			marker.bindPopup("<strong>Barnehage:</strong> <br>" + tittel + "<br> Addressenavn: " + address);

			//adds marker to sub group
			barnehageGjesdal.addLayer(marker);
		}
	});

	return barnehageGjesdal;
}

function difiSkoleGjesdal() {
	var skoleGjesdal = L.featureGroup.subGroup(parentCluster);
	var url = 'https://hotell.difi.no/api/json/gjesdal/grunnskoler?';
	
	$.get(url, function(data) {
		var difiData = data;
		for (var i = 0; i < difiData.entries.length; i++) {
			
			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].lengdegrad;
			lengdeGrad = lengdeGrad.replace(",", "."); 
			var breddeGrad = difiData.entries[i].breddegrad;
			breddeGrad = breddeGrad.replace(",", "."); 
			var tittel = difiData.entries[i].navn;
			var address = difiData.entries[i].adresse;
			
			var marker = L.marker([breddeGrad, lengdeGrad], {icon: bookIcon});
			marker.bindPopup("<strong>Grunnskole:</strong> <br>" + tittel + "<br> Addressenavn: " + address);

			//adds marker to sub group
			skoleGjesdal.addLayer(marker);
		}
	});

	return skoleGjesdal;
}

function difiLekeplass() {
	var lekePlass = L.featureGroup.subGroup(parentCluster);
	var url = 'https://hotell.difi.no/api/json/stavanger/lekeplasser?';
	var page = 1;
	
	$.get(url, function(data) {
		var difiData = data;
		for (var i = 0; i < difiData.entries.length; i++) {
			
			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].longitude;
			var breddeGrad = difiData.entries[i].latitude;
			
			var marker = L.marker([breddeGrad, lengdeGrad], {icon: lekePlassIcon});
			marker.bindPopup("<strong>Lekeplass</strong> <br>");

			//adds marker to sub group
			lekePlass.addLayer(marker);
		}

		//Difi only gives the first 100 entries, if there are more they need to be requested on a separete url
		page++;
		var pages = difiData.pages;
		while(page<=pages){
			var url = 'https://hotell.difi.no/api/json/stavanger/lekeplasser?page=' + page;
			$.get(url, function(data) {
				//var difiData = JSON.parse(data);
				var difiData = data;
				
				for (var i = 0; i < difiData.entries.length; i++) {
					
					//Finner data som skal brukes
					var lengdeGrad = difiData.entries[i].longitude;
					var breddeGrad = difiData.entries[i].latitude;
					
					var marker = L.marker([breddeGrad, lengdeGrad], {icon: lekePlassIcon});
					marker.bindPopup("<strong>Lekeplass</strong> <br>");

					//adds marker to sub group
					lekePlass.addLayer(marker);
				}
			});

			page++;
		}

	});
	

	return lekePlass;
}

function difiBomstasjon() {
	var bomstasjonGroup = L.featureGroup.subGroup(parentCluster);
	var page = 1;
	var url = 'https://hotell.difi.no/api/json/vegvesen/bomstasjoner?';
	
	$.get(url, function(data) {
		var difiData = data;
		for (var i = 0; i < difiData.entries.length; i++) {
			
			//Finner data som skal brukes
			var lengdeGrad = difiData.entries[i].long;
			var breddeGrad = difiData.entries[i].lat;
			var tittel = difiData.entries[i].navn;
			var alt = difiData.entries[i].autopass_beskrivelse;
			
			var marker = L.marker([breddeGrad, lengdeGrad], {icon: payBooth});
			marker.bindPopup("<strong>Bomstasjon:</strong> <br>" + tittel + "<br> Beskrivelse: " + alt);

			//adds marker to sub group
			bomstasjonGroup.addLayer(marker);
		}

		//Difi only gives the first 100 entries, if there are more they need to be requested on a separete url
		page++;
		var pages = difiData.pages;
		while(page<=pages){
			var url = 'https://hotell.difi.no/api/json/vegvesen/bomstasjoner?page=' + page;
			$.get(url, function(data) {
				//var difiData = JSON.parse(data);
				var difiData = data;
				
				for (var i = 0; i < difiData.entries.length; i++) {
					
					//Finner data som skal brukes
					var lengdeGrad = difiData.entries[i].long;
					var breddeGrad = difiData.entries[i].lat;
					var tittel = difiData.entries[i].navn;
					var alt = difiData.entries[i].autopass_beskrivelse;
					
					var marker = L.marker([breddeGrad, lengdeGrad], {icon: payBooth});
					marker.bindPopup("<strong>Bomstasjon:</strong> <br>" + tittel + "<br> Beskrivelse: " + alt);

					//adds marker to sub group
					bomstasjonGroup.addLayer(marker);
				}
			});

			page++;
		}

	});

	return bomstasjonGroup;
}
	
	return {
	    init: init,
	}

})(jQuery);



