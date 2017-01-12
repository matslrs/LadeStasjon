OpenStavangerData = (function($){
	

	init =	function() {

		var sykkelNettNordJæren = sykkelNett();
		overlayMaps["bicycleNetwork"] = sykkelNettNordJæren;

		var turnettStavanger = turNett();
		overlayMaps["walkingTrail"] = turnettStavanger;

		var bydelStavanger = byDelStavanger();
		overlayMaps["stavangerDistricts"] = bydelStavanger;

		var skoleGrenserStavanger = getSkoleGrenserStavanger();
		overlayMaps["schoolBordersStavanger"] = skoleGrenserStavanger;

		var vinterBeredskapStavanger = getVinterBeredskapStavanger();
		overlayMaps["winterPreperation"] = vinterBeredskapStavanger;

		var kommunaleByggSavanger = openStavangerKommunaleBygg();
		overlayMaps["municipalityBuildingStavanger"] = kommunaleByggSavanger;

		var grillplassGjesdal = openStavangerGrillGjesdal();
		overlayMaps["grillingArea"] = grillplassGjesdal;

		var fiskeplassGjesdal = openStavangerFiskeGjesdal();
		overlayMaps["fishingArea"] = fiskeplassGjesdal;

	}

	function sykkelNett() {
		var sykkelNettGeoLayer = L.geoJson(); 

		$.getJSON('https://open.stavanger.kommune.no/dataset/0f0e037e-b5e8-453f-97ca-8ae9be7e523c/resource/7fa800bd-c094-4051-8750-e05e4b0f47ed/download/sykkelnettkartnord-jaeren2016.json', function(data) {
			sykkelNettGeoLayer.addData(data);
		});

		return sykkelNettGeoLayer;

	}

	function turNett() {
		var turNettGeoLayer = L.geoJson();

		$.getJSON('https://open.stavanger.kommune.no/dataset/bf627d4a-f115-41a2-82b9-d19de3cd5414/resource/e1fe43ad-c4b6-4e12-a3b4-6e864c57f96a/download/turveger.json', function(data) {
			turNettGeoLayer.addData(data);
		});

		return turNettGeoLayer;

	}

	function byDelStavanger() {
		var bydelStavangerLayer = L.geoJson();

		$.getJSON('https://open.stavanger.kommune.no/dataset/23fef01e-c729-43b2-8fb3-8e127f04b286/resource/cd32c3c2-4db8-4b38-a42e-9d944a1ae40d/download/bydeler.json', function(data) {
			bydelStavangerLayer.addData(data);
		});

		return bydelStavangerLayer;

	}

	function getSkoleGrenserStavanger() {
		var skoleGrenserStavangerLayer = L.geoJson();

		$.getJSON('https://open.stavanger.kommune.no/dataset/1d0442c1-4521-41b8-bcce-f08d7930b9e5/resource/263b665b-d937-44e9-a3a5-07e68da2ac9a/download/skolekretser.json', function(data) {
			skoleGrenserStavangerLayer.addData(data);
		});

		return skoleGrenserStavangerLayer;

	}

	function getVinterBeredskapStavanger() {
		var vinterBeredskapStavangerLayer = L.geoJson();

		$.getJSON('https://open.stavanger.kommune.no/dataset/1b85ba90-b675-4831-87fd-4d0de893df18/resource/0982be76-168e-4932-99b0-6d72740622cb/download/vinterberedskap.json', function(data) {
			vinterBeredskapStavangerLayer.addData(data);
		});

		return vinterBeredskapStavangerLayer;

	}

	function openStavangerKommunaleBygg() {
		var stavangerUtleieLokal = L.featureGroup.subGroup(parentCluster);

		$.ajax({
		    url: 'https://open.stavanger.kommune.no/api/action/datastore_search?resource_id=0c728874-f9d8-466b-8b81-572d924e3145',
		    dataType: 'json',
		    success: function(data) {
		      	var openStavangerData = data;
			
				for (var i = 0; i < openStavangerData.result.records.length; i++) {
					
					//Finner data som skal brukes
					var longitude = openStavangerData.result.records[i].longitude;
					var latitude = openStavangerData.result.records[i].latitude;
					var service = openStavangerData.result.records[i].service;
					var address = openStavangerData.result.records[i].adresse;
					
					var marker = L.marker([latitude, longitude], {icon: utleieIcon});
					marker.bindPopup("<strong>Bygg Publikumstjeneste:</strong> <br>" + service + "<br> Addressenavn: " + address);

					//adds marker to sub group
					stavangerUtleieLokal.addLayer(marker);
				}
		    }
		});

		return stavangerUtleieLokal;
	}

	function openStavangerGrillGjesdal() {
		var grillPlassGjesdalLayer = L.featureGroup.subGroup(parentCluster);

		$.ajax({
		    url: 'https://open.stavanger.kommune.no/api/action/datastore_search?resource_id=fd6dc8bc-5df7-469f-81ec-9df61b67179e',
		    dataType: 'json',
		    success: function(data) {
		      	var openStavangerData = data;
			
				for (var i = 0; i < openStavangerData.result.records.length; i++) {
					
					//Finner data som skal brukes
					var longitude = openStavangerData.result.records[i].Longitude;
					var latitude = openStavangerData.result.records[i].Latitude;
					var name = openStavangerData.result.records[i].Navn;
					
					var marker = L.marker([latitude, longitude], {icon: fireIcon});
					marker.bindPopup("<strong>Grill Plass:</strong> <br>" + name);

					//adds marker to sub group
					grillPlassGjesdalLayer.addLayer(marker);
				}
		    }
		});

		return grillPlassGjesdalLayer;
	}

	function openStavangerFiskeGjesdal() {
		var fiskeGjesdal = L.featureGroup.subGroup(parentCluster);

		$.ajax({
		    url: 'https://open.stavanger.kommune.no/api/action/datastore_search?resource_id=eac99e21-33b4-4bf6-81d4-608b2a4de7f1',
		    dataType: 'json',
		    success: function(data) {
		      	var openStavangerData = data;
			
				for (var i = 0; i < openStavangerData.result.records.length; i++) {
					
					//Finner data som skal brukes
					var longitude = openStavangerData.result.records[i].Longitude;
					var latitude = openStavangerData.result.records[i].Latitude;
					var name = openStavangerData.result.records[i].Navn;
					var adresse = openStavangerData.result.records[i].Adresse;
					var beskrivelse = openStavangerData.result.records[i].Beskrivelse;
					
					var marker = L.marker([latitude, longitude], {icon: fishingIcon});
					marker.bindPopup("<strong>Vassdrag:</strong> <br>" + name + "<br> Adresse: " + adresse + "<br> Beskrivelse: " + beskrivelse);

					//adds marker to sub group
					fiskeGjesdal.addLayer(marker);
				}
		    }
		});

		return fiskeGjesdal;
	}
	
	return {
	    init: init,
	}

})(jQuery);



