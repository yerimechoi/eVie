var indexSearch = localStorage.getItem("indexSearch");
var goButton = $("#go-button");
var evieIcon = $("#evie-nav");

var place;

let autocomplete; 
function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'),
    {
        fields: ['place_id','geometry','name']
    });
    autocomplete.addListener('place_changed', onPlaceChanged) ; 

}

function onPlaceChanged() {
    var place = autocomplete.getPlace();
    if (!place.geometry) {
        document.getElementById('#autocomplete').placeholder = 'Enter a Location'
    } else {
        //document.getElementById('details').innerHTML = place.name;
        localStorage.setItem("indexSearch", place.name);  //add search item to local storage
        indexSearch = localStorage.getItem("indexSearch");
    }   
}

goButton.on('click', function(){
    window.open("./map.html");  //open map.html when go button is clicked
});

evieIcon.on('click', function(){
    window.open("./map.html");  //open map.html when go button is clicked
});