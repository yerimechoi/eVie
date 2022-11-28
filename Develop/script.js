var indexSearch = localStorage.getItem("indexSearch");
var indexFlag = localStorage.getItem("indexFlag");
var placeDetails = JSON.parse(localStorage.getItem("placeDetails"));
var goButton = $("#go-button");
var evieIcon = $("#evie-nav");
var searchBar = $("#autocomplete");
var place;

let autocomplete;
function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'),
        {
            fields: ['place_id', 'geometry', 'name']
        });
    autocomplete.addListener('place_changed', onPlaceChanged);

}

function onPlaceChanged() {
    place = autocomplete.getPlace();
    if (!place.geometry) {
        document.getElementById('#autocomplete').placeholder = 'Enter a Location'
    } else {
        //document.getElementById('details').innerHTML = place.name;
        localStorage.setItem("indexSearch", searchBar.val());  //add search item to local storage
        localStorage.setItem("placeDetails", JSON.stringify(place));  //add search item to local storage
        localStorage.setItem("indexFlag", "true");  //add search item to local storage



        indexSearch = localStorage.getItem("indexSearch");
        console.log(searchBar.val());
    }
}

goButton.on('click', function () {
    window.open("./map.html");  //open map.html when go button is clicked
});

evieIcon.on('click', function () {
    window.open("./map.html");  //open map.html when go button is clicked
});