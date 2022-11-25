let searchLocations=[];
function initMap() {
  
  var input = document.getElementById('searchInput');
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input); //can remove this part in order to get the search bar above the map, in the blank area that was problematic before 

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  var infowindow = new google.maps.InfoWindow();

  autocomplete.addListener('place_changed', function () {
    infowindow.close();
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }

    // If the place has geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(12);
    }
    // marker.setIcon(({
    //   url: place.icon,
    //   size: new google.maps.Size(71, 71),
    //   origin: new google.maps.Point(0, 0),
    //   anchor: new google.maps.Point(17, 34),
    //   scaledSize: new google.maps.Size(35, 35)
    // }));

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    infowindow.open(map);

    // Location details
    for (var i = 0; i < place.address_components.length; i++) {
      if (place.address_components[i].types[0] == 'postal_code') {
        document.getElementById('postal_code').innerHTML = place.address_components[i].long_name;
      }
      if (place.address_components[i].types[0] == 'country') {
        document.getElementById('country').innerHTML = place.address_components[i].long_name;
      }
    }
    document.getElementById('location').innerHTML = place.formatted_address;
    document.getElementById('lat').innerHTML = place.geometry.location.lat();
    document.getElementById('lon').innerHTML = place.geometry.location.lng();
  });

  let chargingStationResults = "https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=aeMQVkjcPT4MOb6dlvaOQLqyHzeSaqhyIB4xDSzf&location=Toronto,ON&status=E&access=public&fuel_type=ELEC&ev_charging_level=all&state=ON&country=CA&limit=all"

  let mapLocations = [];
  
  fetch(chargingStationResults, {
    method: "GET"
  })
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      console.log(data);
      var map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 43.653, lng: -79.383 }, //changed these coordinates to be Toronto centered
        zoom: 12, //change zoom if needed
        styles: [
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#f5f5f5"
              }
            ]
          },
          {
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#f5f5f5"
              }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#bdbdbd"
              }
            ]
          },
          {
            "featureType": "poi",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e5e5e5"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#ffffff"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#dadada"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "transit",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e5e5e5"
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#c9c9c9"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          }
        ],
      });
      for (let i = 0; i < data.fuel_stations.length; i++) {
        //console.log(typeof data.fuel_stations[i].latitude)
      let location = {lat: data.fuel_stations[i].latitude, lng: data.fuel_stations[i].longitude}
         // Add pins into the map using 
         pin = new google.maps.Marker({
          map: map,
          position: {lat: data.fuel_stations[i].latitude, lng: data.fuel_stations[i].longitude},
          draggable: false,
        })
        
        //added first five elements to the list
        if (i<=5) {
          let searchLoc={ station_name: data.fuel_stations[i].station_name, 
            station_phone: data.fuel_stations[i].station_phone,
            street_address: data.fuel_stations[i].street_address,
            zip: data.fuel_stations[i].zip,
            city: data.fuel_stations[i].city,
            distance_km: data.fuel_stations[i].distance_km, 
            access_days_time: data.fuel_stations[i].access_days_time,
            lat: data.fuel_stations[i].latitude, lng: data.fuel_stations[i].longitude
          }
          searchLocations.push(searchLoc);
        }
        
        mapLocations.push(location)
      }
      addStationList(searchLocations);
      console.log(mapLocations);
    });
}

//function to dynamically add address to the sidebar
function addStationList(arr) {
  for (let i = 0; i < arr.length; i++) {
    var aEle = $("<a>");
    var divList = $("<div>");
    divList.addClass("selectList");
    $(divList).attr('id', i);
    var pName = $("<p>");
    pName.text(arr[i].station_name);
    var pPhone = $("<p>");
    pPhone.text(arr[i].station_phone);
    var pStreet = $("<p>");
    pStreet.text(arr[i].street_address);
    var pZip = $("<p>");
    pZip.text(arr[i].zip);
    var pCity = $("<p>");
    pCity.text(arr[i].city);
    var pBreak = $("<br>");
    aEle.append(divList);
    divList.append(pName);
    divList.append(pPhone);
    divList.append(pStreet);
    divList.append(pZip);
    divList.append(pCity);
    $("#listLoc").append(pBreak);
    $("#listLoc").append(aEle);
  }
}


//Sidebar click event
$(document).on('click', ".selectList" , function() {
  //code here ....
  var id = $(this).attr('id');
  let location = {lat: searchLocations[id].lat, lng: searchLocations[id].lng};
  //alert("Id: "+id + " lat: " + searchLocations[id].lat + " lng: "+ searchLocations[id].lng);
  var lat = parseFloat(searchLocations[id].lat);
  var lng = parseFloat(searchLocations[id].lng);
  var map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: lat, lng: lng }, //changed these coordinates to be slected item centered
    zoom: 16, 
  });
  pin = new google.maps.Marker({
    map: map,
    position: {lat: lat, lng: lng},
    draggable: false,
  })
});


window.initMap = initMap;
