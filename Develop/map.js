var searchBar = $("#searchInput");
var indexSearch = localStorage.getItem("indexSearch");
var placeDetails = JSON.parse(localStorage.getItem("placeDetails"));
var map, pin, infoW, currentLocation;
var loadList = [];

var mapDetails = {   //details about how the map will be displayed and styled
  center: { lat: 43.653, lng: -79.383 },
  zoom: 12,
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
  ]
}
function addStationList(arr) {  //function to dynamically add station details to the sidebar
  var divList = $("<div>");            //declare element vars
  var pName = $("<p>");
  var pPhone = $("<p>");
  var pStreet = $("<p>");
  var pZip = $("<p>");
  var pCity = $("<p>");
  var pAccessDays = $("<p>");
  var pFacility = $("<p>")
  var pPricing = $("<p>")
  var pNetwork = $("<p>");
  var pState = $("<p>");
  var pLC = $("<p>");
  var pBreak = $("<br>");

  divList.addClass("selectList");      //assign values to element
  pName.text(arr.station_name);
  pPhone.text(arr.station_phone);
  pStreet.text(arr.street_address);
  pZip.text(arr.zip);
  pCity.text(arr.city);
  pAccessDays.text(arr.access_days_time);
  pNetwork.text("Network Type: " + arr.network)
  pState.text("State of Station: " + arr.state)
  pLC.text("Last Confirmed: " + arr.lastConfirmed)    

  if (arr.facility == null) pFacility.text("Facility Type: -");
  else pFacility.text("Facility Type: " + arr.facility);

  if (arr.pricing == null) pPricing.text("Pricing: -");
  else pPricing.text("Pricing: " + arr.pricing);

 
  divList.append(pName);               //append elements to sidebar
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
function loadPins(location,province,country){   //loads pins to map based on searched city or mapcenter if dragged
    var apiKey = "aeMQVkjcPT4MOb6dlvaOQLqyHzeSaqhyIB4xDSzf";            
    let chargingStationResults = `https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=${apiKey}&location=${location}&status=E&access=public&fuel_type=ELEC&ev_charging_level=all&state=${province}&country=${country}&limit=all`;
    fetch(chargingStationResults, {
      method: "GET"
    })
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      for (let i = 0; i < data.fuel_stations.length; i++) {   //searches results for lat and lng to stick pins
        let thisStation = data.fuel_stations[i];
        let location = { lat: thisStation.latitude, lng: thisStation.longitude }

        pin = new google.maps.Marker({                           //create new pin   
          map: map,
          position: location,
          animation: google.maps.Animation.DROP,
          draggable: false,
        })
        infoW=new google.maps.InfoWindow({});                    //create info window on clicked pin
        google.maps.event.addListener(pin, 'click', function (){ //added click event to marker to zoom and display details in the sidebar 
            searchBar.val('');                                   //clear search bar after pin is clicked
            map.setCenter(this.getPosition());                   //center map on clicked pin
            map.setZoom(16);
            infoW.setContent(thisStation.station_name);          //content of info window
            infoW.open(map,this);                                 
            let searchLoc = {                                    //get info about station to be displayed in sidebar   
              station_name: thisStation.station_name,
              station_phone: thisStation.station_phone,
              street_address: thisStation.street_address,
              zip: thisStation.zip,
              city: thisStation.city,
              distance_km: thisStation.distance_km,
              access_days_time: thisStation.access_days_time,
              lat: thisStation.latitude, lng: thisStation.longitude,
              facility: thisStation.facility_type,
              network: thisStation.ev_network,
              pricing: thisStation.ev_pricing,
              state: thisStation.state,
              lastConfirmed: thisStation.date_last_confirmed,
            }
            addStationList(searchLoc);                           //add info to sidebar 
          })     
      }
   })
}
function loadedPins(currLoc){   //keeps tracks of pins loaded to map to avoid fetching same info multiple times
  for(var i=0;i<loadList.length;i++){           
    if (loadList[i]==currLoc) return true;      //return true if current search already loaded
    
  };
  loadList = loadList.concat(currLoc);          //added current search to list and return false
  return false;
}
async function reverseGeo(coord){   //convert coordinate data into city,province,country
  var reverseGeoApi = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coord}&key=AIzaSyAzzcBB7D-V2eI4A_yM91uuRdsuUYvS-0A`;
  const response = await fetch(reverseGeoApi);
  const data = await response.json();
  var target = data.results.length-4;                                                     //determine targex index of data.results
  if(data.results[target].address_components.length<4) target -= 1;                       //adjust target index if necessary    
  var longnameLocation = await (data.results[target].formatted_address);                  //eg. "Toronto,Ontario,Canada"
  var shortnameProvince = await (data.results[target].address_components[2].short_name);  //eg. "ON"
  var shortnameCountry = await (data.results[target].address_components[3].short_name);   //eg. "CA"
  currentLocation = longnameLocation.replace(/ /g,'');              //removes white spaces so currentLocation can be used in query url
  if (!loadedPins(currentLocation)) {                               //determines if pins for current location are already loaded or need to be loaded
    loadPins(currentLocation,shortnameProvince,shortnameCountry);   //function to load pins to maps
  }
  return;
}
async function centerChanged() {    //captures when map is moved by search or by drag 
    var lat = map.getCenter().lat();
    var lng = map.getCenter().lng();
    var coord = ""+lat+","+lng;
    reverseGeo(coord);               //determine location of mapcenter
}
async function presentItOnMap(place) {    //move map to searched location, will automatically trigger centerChanged function
  if (place.geometry.viewport) map.fitBounds(place.geometry.viewport);
  else {
    map.setCenter(place.geometry.location);
    map.setZoom(16);
  }; 
  var longnameLocation = await place.formatted_address;                  //eg. "Toronto,Ontario,Canada"
  var shortnameProvince = await place.address_components[2].short_name;  //eg. "ON"
  var shortnameCountry = await place.address_components[3].short_name;   //eg. "CA"
  currentLocation = longnameLocation.replace(/ /g,'');
  if (!loadedPins(currentLocation)) {                               //determines if pins for current location are already loaded or need to be loaded
    loadPins(currentLocation,shortnameProvince,shortnameCountry);   //function to load pins to maps  
  }
}
function loadLastSearch(){    //brings map to last searched location on startup
  if (indexSearch != null) {
    searchBar.val(indexSearch);         //copy the searched address from landing page or from previous search into search bar on map page
    presentItOnMap(placeDetails);       //calls present on map function on startup
  };
}
function initMap(){   //initialize map window
  map=new google.maps.Map(document.getElementById("map"),mapDetails);

  var input = document.getElementById('searchInput');
  var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);
  
  map.addListener("center_changed", centerChanged);                     //listener for dragging map or moving to new search location
  
  loadLastSearch(); 

  autocomplete.addListener('place_changed', () => {                     //listener for selecting location from autocomplete   
      var place = autocomplete.getPlace();
      if (!place.geometry) return;                                      //if place is not found on map
      else{
        indexSearch = searchBar.val();
        localStorage.setItem("indexSearch", indexSearch);               //update localStorage content
        localStorage.setItem("placeDetails", JSON.stringify(place));
        
        presentItOnMap(place);                                          //call function to move map
    
      }
    });
}
window.initMap = initMap;

