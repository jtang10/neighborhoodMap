var locations = [
    {
        title: 'Yolk - Streeterville',
        lat: 41.8910135,
        lng: -87.6165893,
        id: 'ChIJW7gEhFUrDogRmZrarW7wmE8'
    },
    {
        title: 'Cite',
        lat: 41.8910135,
        lng: -87.6165893,
        id: 'ChIJLzy5vlMrDogR1EZU12Hh8qk'
    },
    {
        title: 'Tanta Chicago',
        lat: 41.8920694,
        lng:-87.6206376,
        id: 'ChIJdeoev7MsDogRZOJFBNqupKQ'
    },
    {
        title: 'Purple Pig',
        lat: 41.8920694,
        lng: -87.6206376,
        id: 'ChIJl8NTEawsDogRwXH-IVDyH2A'
    }
    {
        title: 'Capital Grille',
        lat: 41.8942018,
        lng: -87.6193394,
        id: 'ChIJo9QCaqssDogRmmJ0MAf-aeE'
    },
    {
        title: 'RPM Italian',
        lat: 41.8902564,
        lng: -87.6271285,
        id: 'ChIJgfrOPLIsDogRvM0_GwLBpyI'
    }
]
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