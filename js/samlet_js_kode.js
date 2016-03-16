function test_popups()
{
 //POPUPS
 var marker = L.marker([58.85, 5.74]);
 
 var circle = L.circle([58.8534, 5.7207], 200, {
     color: 'red',
     fillColor: '#f03',
     fillOpacity: 0.5
 });
 
 var polygon = L.polygon([
     [58.85, 5.73],
     [58.855, 5.74],
     [58.859, 5.735]
 ]); 
 
 //more popup stuff
 marker.bindPopup("Jeg er midti byen!");
 circle.bindPopup("Midt i gata");
 polygon.bindPopup("Langs jernbanen");
 
//adds popups to layer group
 var markers_group = L.layerGroup([marker, circle, polygon]);
 
 return markers_group;
}


//
// function gjson_test_data()
// {
//  //defines a GeoJSON Feature
//  var geojsonFeature = {
//      "type": "Feature",
//      "properties": {
//          "name": "Gisketjernet",
//          "amenity": "Fin park",
//          "popupContent": "Fin park med dyr og treningsmuligheter"
//      },
//      "geometry": {
//          "type": "Point",
//          "coordinates": [5.72816, 58.85807]
//      }
//  };
//
//  //defines an array of GeoJSON lines
//  var myLines = [{
//      "type": "LineString",
//      "coordinates": [[5.74337, 58.859], [5.72544, 58.8741], [5.70252, 58.93378]]
//  }, {
//      "type": "LineString",
//      "coordinates": [[6.67964, 58.29851], [6.09763, 58.52284], [5.74264, 58.85794]]
//  }];
//
//  //style
//  var myStyle = {
//      "color": "#ff7800",
//      "weight": 5,
//      "opacity": 0.65
//  };
//
//
// }