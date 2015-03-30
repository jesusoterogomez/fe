var map, placesList, hotelMarker, request, google, callback;
var placesCount = 6;

// selectors
var mapCanvas    = 'map_canvas';
var nearbyPlaces = '.nearby_places_list';
var placeClass   = 'one_place';
var placeTypes   = ['store', 'food'];

function initialize() {
  var paris = new google.maps.LatLng(48.8665735, 2.3551065);

  map = new google.maps.Map(document.getElementById(mapCanvas), {
    center: paris,
    zoom: 17
  });

  hotelMarker = new google.maps.Marker({
    map: map,
    position: paris
  });

  request = {
    location: paris,
    radius: 500,
    types: placeTypes
  };

  placesList = $(nearbyPlaces)[0];

  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

function callback(results, status) {
  if (status != google.maps.places.PlacesServiceStatus.OK) {
    return;
  }
  createMarkers(results);
}

function createMarkers(places) {
  var bounds = new google.maps.LatLngBounds();
  var i;
  for (i = 0; i < placesCount; i++) {
    var image = {
      url: places[i].icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    var marker = new google.maps.Marker({
      map: map,
      icon: image,
      title: places[i].name,
      position: places[i].geometry.location
    });

    placesList.innerHTML += '<li class="' + placeClass + '">' +
      '<img src="' + places[i].icon + '"/>' +
      '<h4>' + places[i].name + '</h4>' +
      '<address>' + places[i].vicinity + '</address></li>';

    bounds.extend(places[i].geometry.location);
  }
  map.fitBounds(bounds);
}

google.maps.event.addDomListener(window, 'load', initialize);