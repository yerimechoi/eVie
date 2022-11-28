var searchBar = $("#searchInput");
var indexSearch = localStorage.getItem("indexSearch");
var indexFlag = localStorage.getItem("indexFlag");
var placeDetails = JSON.parse(localStorage.getItem("placeDetails"));
let infoW;
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

      var autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.bindTo('bounds', map);

      var infowindow = new google.maps.InfoWindow();

      function presentItOnMap(place) {
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(16);
        };

        var address = '';
        if (place.address_components) {
          address = [
            (place.address_components[0] && place.address_components[0].short_name || ''),
            (place.address_components[1] && place.address_components[1].short_name || ''),
            (place.address_components[2] && place.address_components[2].short_name || '')
          ].join(' ');
        };

        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map);
      }

      autocomplete.addListener('place_changed', function () {
        infowindow.close();
        var place = autocomplete.getPlace();
        if (!place.geometry) {
          return;
        }

        presentItOnMap(place);                              //call present on map function from autocomplete
        localStorage.setItem("indexSearch", searchBar.val());
        localStorage.setItem("placeDetails", JSON.stringify(place));

        document.getElementById('location').innerHTML = place.formatted_address;
        document.getElementById('lat').innerHTML = place.geometry.location.lat();
        document.getElementById('lon').innerHTML = place.geometry.location.lng();
      });

      if (localStorage.getItem("indexSearch") != null) {
        searchBar.val(indexSearch);                       //copy the searched address from landing page or from previous search into search bar on map page
        localStorage.setItem("indexFlag", "false");
        presentItOnMap(placeDetails);                     //calls present on map function on starup
      };

      for (let i = 0; i < data.fuel_stations.length; i++) {
        let location = { lat: data.fuel_stations[i].latitude, lng: data.fuel_stations[i].longitude }
        // Add pins into the map using 
        pin = new google.maps.Marker({
          map: map,
          position: { lat: data.fuel_stations[i].latitude, lng: data.fuel_stations[i].longitude },
          animation: google.maps.Animation.DROP,
          draggable: false,
        })
        //display info window
        infoW=new google.maps.InfoWindow({});
        
        //added click event to marker to zoom and display details in the sidebar 
        google.maps.event.addListener(pin, 'click', function () {
          map.setCenter(this.getPosition());
          map.setZoom(16);
          infoW.setContent(data.fuel_stations[i].station_name);
          infoW.open(map,this);
          let searchLoc = {
            station_name: data.fuel_stations[i].station_name,
            station_phone: data.fuel_stations[i].station_phone,
            street_address: data.fuel_stations[i].street_address,
            zip: data.fuel_stations[i].zip,
            city: data.fuel_stations[i].city,
            distance_km: data.fuel_stations[i].distance_km,
            access_days_time: data.fuel_stations[i].access_days_time,
            lat: data.fuel_stations[i].latitude, lng: data.fuel_stations[i].longitude,
            facility: data.fuel_stations[i].facility_type,
            network: data.fuel_stations[i].ev_network,
            pricing: data.fuel_stations[i].ev_pricing,
            state: data.fuel_stations[i].state,
            lastConfirmed: data.fuel_stations[i].date_last_confirmed,
          }
          addStationList(searchLoc);
        });

        mapLocations.push(location);
      }
    });
}

//function to dynamically add station details to the sidebar
function addStationList(arr) {

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
  var pAccessDays = $("<p>");
  pAccessDays.text(arr.access_days_time);
  var pFacility = $("<p>")
  if (arr.facility == null) {
    pFacility.text("Facility Type: -");
  }
  else {
    pFacility.text("Facility Type: " + arr.facility);
  };
  var pNetwork = $("<p>");
  pNetwork.text("Network Type: " + arr.network)
  var pPricing = $("<p>")
  if (arr.pricing == null) {
    pPricing.text("Pricing: -");
  }
  else {
    pPricing.text("Pricing: " + arr.pricing);
  };
  var pState = $("<p>");
  pState.text("State of Station: " + arr.state)
  var pLC = $("<p>");
  pLC.text("Last Confirmed: " + arr.lastConfirmed)
  var pBreak = $("<br>");
  //aEle.append(divList);
  divList.append(pName);
  divList.append(pPhone);
  divList.append(pStreet);
  divList.append(pZip);
  divList.append(pCity);
  divList.append(pAccessDays);
  divList.append(pFacility);
  divList.append(pNetwork);
  divList.append(pPricing);
  divList.append(pState);
  divList.append(pLC);
  $("#listLoc").prepend(pBreak);
  $("#listLoc").prepend(divList);
}

window.initMap = initMap;
