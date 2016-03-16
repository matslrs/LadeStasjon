function events()
{
 //EVENTS
 var popup = L.popup();

 function onMapClick(e) {
     popup
         .setLatLng(e.latlng)
         .setContent("You clicked the map at " + e.latlng.toString())
         .openOn(mymap);
 }
 mymap.on('click', onMapClick);
 
 //find location and set view and zoom
 mymap.locate({setView: true, maxZoom: 16});

//when location found, show a popup where with accuracy
 function onLocationFound(e) {
     var radius = e.accuracy / 2;

     L.marker(e.latlng).addTo(mymap)
         .bindPopup("You are within " + radius + " meters from this point").openPopup();

     L.circle(e.latlng, radius).addTo(mymap);
 }

 mymap.on('locationfound', onLocationFound);
 
 //if finding location failed, display error message
 function onLocationError(e) {
     alert(e.message);
 }

 mymap.on('locationerror', onLocationError);
 
 //EVENTS END 
 
}