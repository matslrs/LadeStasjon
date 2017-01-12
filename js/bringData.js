BringData = (function($){
	

	init =	function() {
		var pickupPointsBring = bringPickupPoints(map);
		overlayMaps["bringPickup"] = pickupPointsBring;
	}

	function bringPickupPoints(map) {
		var pickupGroup = L.featureGroup.subGroup(parentCluster);

		$.ajax({
		    type: 'GET',
		    url: "https://mats.maplytic.no/proxy?url=https://api.bring.com/pickuppoint/api/pickuppoint/no/all.json",
		    success: function(data) { 	
		    	var bringData = data;
				for (var i = 0; i < bringData.pickupPoint.length; i++) {
					//Finner data som skal brukes
					var lengdeGrad = bringData.pickupPoint[i].longitude;
					var breddeGrad = bringData.pickupPoint[i].latitude;
					var tittel = bringData.pickupPoint[i].name;
					var adress = bringData.pickupPoint[i].address;
					var beskrivelse = bringData.pickupPoint[i].locationDescription;
					var open = bringData.pickupPoint[i].openingHoursNorwegian;
					
					var marker = L.marker([breddeGrad, lengdeGrad], {icon: pickupBox});
					marker.bindPopup("<strong>Pickup Point:</strong> <br>" + tittel + "<br> Adress: " + adress + "<br> Beskrivelse: " + beskrivelse + "<br> Åpen: " + open );

					//adds marker to sub group
					pickupGroup.addLayer(marker);
				}
		    },
		    contentType: "application/json",
		    dataType: 'json'
		});

		return pickupGroup;
	}

	return {
	    init: init,
	}

})(jQuery);



