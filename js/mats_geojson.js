function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
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