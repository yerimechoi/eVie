let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 43.653, lng: -79.383 }, //changed these coordinates to be Toronto centered
    zoom: 12, //change zoom if needed
  });
}

window.initMap = initMap;

