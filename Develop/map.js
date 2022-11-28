var searchBar = $("#searchInput");
var indexSearch = localStorage.getItem("indexSearch");
var indexFlag = localStorage.getItem("indexFlag");
var placeDetails = JSON.parse(localStorage.getItem("placeDetails"));


function initMap() {

  let chargingStationResults = "https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=aeMQVkjcPT4MOb6dlvaOQLqyHzeSaqhyIB4xDSzf&location=Toronto,ON&status=E&access=public&fuel_type=ELEC&ev_charging_level=all&state=ON&country=CA&limit=all"

  let mapLocations = [];

  fetch(chargingStationResults, {
    method: "GET"
  })
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
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

      var input = document.getElementById('searchInput');
      // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input); //can remove this part in order to get the search bar above the map, in the blank area that was problematic before 

      var autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.bindTo('bounds', map);

      var infowindow = new google.maps.InfoWindow();

      function presentItOnMap(place) {
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(16);
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
        // for (var i = 0; i < place.address_components.length; i++) {
        //   if (place.address_components[i].types[0] == 'postal_code') {
        //     document.getElementById('postal_code').innerHTML = place.address_components[i].long_name;
        //   }
        //   if (place.address_components[i].types[0] == 'country') {
        //     document.getElementById('country').innerHTML = place.address_components[i].long_name;
        //   }
        // }
      }


      if (localStorage.getItem("indexSearch") != null) {
        searchBar.val(indexSearch);                       //copy the searched address from landing page or from previous search into search bar on map page
        localStorage.setItem("indexFlag", "false");
        presentItOnMap(placeDetails);                     //calls present on map function on starup


        console.log(indexSearch);

        console.log(indexFlag);
      }





      autocomplete.addListener('place_changed', function () {
        infowindow.close();
        var place = autocomplete.getPlace();
        if (!place.geometry) {
          return;
        }

        // If the place has geometry, then present it on a map.
        presentItOnMap(place);                              //call present on map function from autocomplete
        localStorage.setItem("indexSearch", searchBar.val());
        localStorage.setItem("placeDetails", JSON.stringify(place));
      });


      for (let i = 0; i < data.fuel_stations.length; i++) {
        //console.log(typeof data.fuel_stations[i].latitude)
        let location = { lat: data.fuel_stations[i].latitude, lng: data.fuel_stations[i].longitude }
        // Add pins into the map using 
        pin = new google.maps.Marker({
          map: map,
          position: { lat: data.fuel_stations[i].latitude, lng: data.fuel_stations[i].longitude },
          draggable: false,
        })
        //added click event to marker to zoom and display details in the sidebar 
        google.maps.event.addListener(pin, 'click', function () {
          //map.panTo(this.getPosition());
          //searchLocations=[];
          map.setCenter(this.getPosition());
          map.setZoom(17);
          let searchLoc = {
            station_name: data.fuel_stations[i].station_name,
            station_phone: data.fuel_stations[i].station_phone,
            street_address: data.fuel_stations[i].street_address,
            zip: data.fuel_stations[i].zip,
            city: data.fuel_stations[i].city,
            distance_km: data.fuel_stations[i].distance_km,
            access_days_time: data.fuel_stations[i].access_days_time,
            connector_type: data.fuel_stations[i].ev_connector_types,
            lat: data.fuel_stations[i].latitude,
            lng: data.fuel_stations[i].longitude
          }
          //searchLocations.push(searchLoc);
          addStationList(searchLoc);
        });

        mapLocations.push(location);
      }

      console.log(data);

      //function to dynamically add station details to the sidebar
      function addStationList(arr) {
        //for (let i = 0; i < arr.length; i++) {
        var divList = $("<div>");
        divList.addClass("selectList");
        //$(divList).attr('id', i);
        var pName = $("<p>");
        pName.text(arr.station_name);
        var pPhone = $("<p>");
        pPhone.text(arr.station_phone);
        var pStreet = $("<p>");
        pStreet.text(arr.street_address);
        var pZip = $("<p>");
        pZip.text(arr.zip);
        var pCity = $("<p>");
        pCity.text(arr.city);
        var pBreak = $("<br>");
        //aEle.append(divList);
        divList.append(pName);
        divList.append(pPhone);
        divList.append(pStreet);
        divList.append(pZip);
        divList.append(pCity);
        $("#listLoc").append(pBreak);
        $("#listLoc").append(divList);
        //}
      }
    });
};


// //function to dynamically add station details to the sidebar
// function addStationList(arr) {
//   //for (let i = 0; i < arr.length; i++) {

//     var divList = $("<div>");
//     divList.addClass("selectList");
//     //$(divList).attr('id', i);
//     var pName = $("<p>");
//     pName.text(arr.station_name);
//     var pPhone = $("<p>");
//     pPhone.text(arr.station_phone);
//     var pStreet = $("<p>");
//     pStreet.text(arr.street_address);
//     var pZip = $("<p>");
//     pZip.text(arr.zip);
//     var pCity = $("<p>");
//     pCity.text(arr.city);
//     var pBreak = $("<br>");
//     //aEle.append(divList);
//     divList.append(pName);
//     divList.append(pPhone);
//     divList.append(pStreet);
//     divList.append(pZip);
//     divList.append(pCity);
//     $("#listLoc").append(pBreak);
//     $("#listLoc").append(divList);
//   //}
// }



window.initMap = initMap;
console.log(placeDetails);

// if (localStorage.getItem("indexSearch")!=null){
//      searchBar.val(localStorage.getItem("indexSearch"));
// }
// console.log(searchBar);


