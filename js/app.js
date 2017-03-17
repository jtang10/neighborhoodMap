var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 41.8916157, lng: -87.6169055},
        zoom: 15
    });

    var OlivePark = {lat: 41.8939502, lng: -87.613118};
    var marker = new google.maps.Marker({
        position: OlivePark,
        map: map,
        title: 'Huge Dog Park!'
    });
    var infowindow = new google.maps.InfoWindow({
        content: 'Test'
    });
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });
}