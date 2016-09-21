function weatherInit(){

	$("form").on('submit',function(e){
  	  		e.preventDefault();
  	 		console.log("'form' on 'submit'")
		});


		$( 'input').focusin(function() {
			$('.has-feedback').addClass("showClass");
			$( "#searchResults" ).html( searchResultsHtml );
			listButtonEvents();
		});
		$('input').focusout(function() {
			if(!searchResultsMouseOver){
				$('.has-feedback').removeClass("showClass");
				$( "#searchResults" ).html( "" );
			}
		});


	    $("#searchElements").on('mouseover',function(e){
	    	searchResultsMouseOver = true;
  	  		mymap.dragging.disable();
		});
		$("#searchElements").on('mouseout',function(e){
			searchResultsMouseOver = false;
  	  		mymap.dragging.enable();
		});

		
		$('#search').keyup(function() {
			delay(function(){
				console.log('func called');
				var searchText = $('#search').val();
				console.log(searchText);
				weatherSearch(searchText);
			}, 600 );
		});

		var delay = (function(){
			var timer = 0;
			console.log('pre');
			return function(callback, ms){
				console.log('inside');
				clearTimeout (timer);
				timer = setTimeout(callback, ms);
			};
			console.log('post');
		})();

		function weatherSearch(searchText){
			var url = "https://ws.geonorge.no/SKWS3Index/ssr/sok?navn=" + searchText + "*&antPerSide=10&epsgKode=4326&eksakteForst=true&side=0";

			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (xhttp.readyState == 4 && xhttp.status == 200) {
				  readSsrSearch(xhttp);
				}
			};
			xhttp.open("GET", url, true);
			xhttp.send();
		}

		function readSsrSearch(xml){
			var xmlDoc = xml.responseXML;
			searchResultsHtml = '<ul class="list-group">';
			var x = xmlDoc.getElementsByTagName("stedsnavn");
			for (var i = 0; i <x.length; i++) { 
				if (typeof x[i].getElementsByTagName("stedsnavn")[0] === "undefined") {
					continue;
				}
				//build list html element
				var sted = x[i].getElementsByTagName("stedsnavn")[0].childNodes[0].nodeValue;
				var kommune = x[i].getElementsByTagName("kommunenavn")[0].childNodes[0].nodeValue;
				var fylke = x[i].getElementsByTagName("fylkesnavn")[0].childNodes[0].nodeValue;
				var type = x[i].getElementsByTagName("navnetype")[0].childNodes[0].nodeValue;
				var stedUrl = sted.split(" ").join("_");
				var kommuneUrl = kommune.split(" ").join("_");
				var fylkeUrl = fylke.split(" ").join("_");
			    searchResultsHtml += '<button type="button" class="list-group-item"';
			    searchResultsHtml += 'data-sted="' + stedUrl + '" ';
			    searchResultsHtml += 'data-stedNavn="' + sted + '" ';
			    searchResultsHtml += 'data-kommune="' + kommuneUrl + '" ';
			    searchResultsHtml += 'data-fylke="' + fylkeUrl + '" >';
			    searchResultsHtml += '<strong>';
			    searchResultsHtml += sted;
			    searchResultsHtml += "</strong>, ";
			    searchResultsHtml += kommune;
			    searchResultsHtml += ", ";
			    searchResultsHtml += fylke;
			    searchResultsHtml += ", <strong>Type sted: ";
			    searchResultsHtml += type;
			    searchResultsHtml += "</strong>";
			    searchResultsHtml += "</button>";
		  	}
		  	searchResultsHtml += "</ul>";
		  	$( "#searchResults" ).html( searchResultsHtml );
		  	//update events to the new list
		  	listButtonEvents();
		}

		function listButtonEvents(){
			$( "button" ).click(function(e) {
		  		e.preventDefault();
				console.log("list item clicked ");

				//update search and search list elements
				$('.has-feedback').removeClass("showClass");
				$( "#searchResults" ).html( "" );
				//enable dragging on map
				mymap.dragging.enable();
				//build urls and get yr.no weather data
				var place = e.target.getAttribute("data-stedNavn");
				var url = "https://mats.maplytic.no/proxy?url=https://www.yr.no/sted/Norge/" ;
				url += e.target.getAttribute("data-fylke");
				if(e.target.getAttribute("data-kommune") != "Spitsbergen"){
					url += "/" + e.target.getAttribute("data-kommune");
				}
				url += "/" + e.target.getAttribute("data-sted");
				url += "/varsel.xml";

				weatherListClick(url, place);
			});
		}

		function weatherListClick(link, place){
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (xhttp.readyState == 4 && xhttp.status == 200) {

				  	var xmlDoc = xhttp.responseXML;
					var popContent = "";
					var sideBarContent ="";
					var textForecast = xmlDoc.getElementsByTagName("text");
					var tabularForecast = xmlDoc.getElementsByTagName("tabular");
					var tabularArrayForecast = tabularForecast[0].getElementsByTagName("time");
					
				    sideBarContent += "<br>" + textForecast[0].getElementsByTagName("body")[0].childNodes[0].nodeValue +
				    "<br><br>";
				    popContent += getPopupWithWeatherData(tabularArrayForecast, place);
				    sideBarContent += getTableWithWeatherData(tabularArrayForecast);

				    $('#stedsNavn').innerHTML("Været for " + place);
				    $('#weatherDetails').html(sideBarContent);
				    sidebar.open("weatherInfo");

				    //get position
				  	var positionElement = getAllElementsWithThisAttribute(xmlDoc, "latitude");
				    if(positionElement.length > 1 || positionElement.length == 0){
				    	console.log("positionElement length = " + positionElement.length);
				    }
				    var latLongPos = [positionElement[0].getAttribute("latitude"), positionElement[0].getAttribute("longitude")];
				  	var weatherSearchMarker = L.marker( latLongPos, {icon:sunWeatherSearchIcon} ).addTo(mymap);
				  	weatherSearchMarker.sideBar = sideBarContent;
				  	weatherSearchMarker.bindPopup(popContent, {minWidth: 192});
				  	weatherSearchMarker.openPopup();
				  	weatherSearchMarker.on("click", function (event, place) {
					    $('#stedsNavn').innerHTML("Været for " + place);
					    $('#weatherDetails').html(event.target.sideBar);
				    	sidebar.open("weatherInfo");
					});
				  	mymap.panTo(latLongPos);

				}
			};
			xhttp.open("GET", link, true);
			xhttp.send();
		}

		function getPopupWithWeatherData(data, place){
			var html = '<div class="container-fluid"><div id= "weatherPopupRow" class="row"><div class="col-md-12"><h2 class="weatherPlace">';
			for(var i=0; i<1; i++){
				var været = data[i].getElementsByTagName("symbol")[0].getAttribute('name');
				var symbol = data[i].getElementsByTagName("symbol")[0].getAttribute('var');
				var temperature = data[i].getElementsByTagName("temperature")[0].getAttribute('value');
			}
			html += place;
			html += '</h2></div></div><div class="row"><div class="col-md-6" id="weatherTemp" ><h3 >' + temperature + "&#8451;" + '</h3></div><div class="col-md-6" id="weatherImg">';
			html += '<img src="images/yr/b100/' + symbol + '.png" alt="' + været + '"height="96" width="96">';
			//html += temperature + " Celsius";
			html += '</div></div></div>';

			return html;
		}

		function getTableWithWeatherData(data){
			var html = '<div class="panel panel-default"><div class="panel-heading">';
			html += '<strong>Værvarsel</strong>';
			html += '</div>';
			html += ' <table class="table table-condensed"><tbody>';
			for(var i=0; i<4; i++){
				var timeFrom = data[i].getAttribute('from');
				var timeTo = data[i].getAttribute('to');
				var været = data[i].getElementsByTagName("symbol")[0].getAttribute('name');
				var symbol = data[i].getElementsByTagName("symbol")[0].getAttribute('var');
				var precipitation = data[i].getElementsByTagName("precipitation")[0].getAttribute('value');
				var temperature = data[i].getElementsByTagName("temperature")[0].getAttribute('value');

				html += '<tr><td><strong>';
				html += 'Time</strong></td><td><strong>' + timeFrom + ' til ' + timeTo;
				html += '</strong></td></tr>';

				html += '<tr><td>';
				html += 'Været</td><td>' + '<img src="images/yr/b48/' + symbol + '.png" alt="' + været + '"height="42" width="42">';
				html += '</td></tr>';

				html += '<tr><td>';
				html += 'Regn</td><td>' + precipitation + " mm";
				html += '</td></tr>';

				html += '<tr><td>';
				html += 'Temperatur</td><td>' + temperature + " Celsius";
				html += '</td></tr>';
			}
			html += '</table></div>';

			return html;
		}

		function getAllElementsWithThisAttribute(htmlOrXml, attribute)
		{
		  var matchingElements = [];
		  var allElements = htmlOrXml.getElementsByTagName('*');
		  for (var i = 0, n = allElements.length; i < n; i++)
		  {
		    if (allElements[i].getAttribute(attribute) !== null)
		    {
		      matchingElements.push(allElements[i]);
		    }
		  }
		  return matchingElements;
		}
}