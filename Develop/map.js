let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 43.653, lng: -79.383 }, //changed these coordinates to be Toronto centered
    zoom: 12, //change zoom if needed
  });

  // const markers = [
  //   { lat: }
  // ]

  const marker = new google.maps.Marker({
    position: { lat: 43.133157, lng: -79.386041 },
    title: "This is my test"
  });
  marker.setMap(map);
};

window.initMap = initMap;

let chargingStationResults = "https://developer.nrel.gov/api/alt-fuel-stations/v1.json?api_key=aeMQVkjcPT4MOb6dlvaOQLqyHzeSaqhyIB4xDSzf&status=E&fuel_type=ELEC&cng_fill_type=all&state=ON&country=CA&limit=all"
async function getApi(){
  const response = await fetch(chargingStationResults);
  var data = await response.json();
  console.log(data);
}

getApi(chargingStationResults);