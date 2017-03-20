//Initialize some restaurants' locations
var locations = [
    {
        title: 'Yolk - Streeterville',
        lat: 41.891975,
        lng: -87.617959,
        id: 'ChIJW7gEhFUrDogRmZrarW7wmE8'
    },
    {
        title: 'Cite',
        lat: 41.891510,
        lng: -87.612319,
        id: 'ChIJLzy5vlMrDogR1EZU12Hh8qk'
    },
    {
        title: 'Tanta Chicago',
        lat: 41.891855,
        lng: -87.632020,
        id: 'ChIJdeoev7MsDogRZOJFBNqupKQ'
    },
    {
        title: 'Purple Pig',
        lat: 41.891297,
        lng: -87.624837,
        id: 'ChIJl8NTEawsDogRwXH-IVDyH2A'
    },
    {
        title: 'Capital Grille',
        lat: 41.893787,
        lng: -87.622352,
        id: 'ChIJo9QCaqssDogRmmJ0MAf-aeE'
    },
    {
        title: 'RPM Italian',
        lat: 41.890931,
        lng: -87.629948,
        id: 'ChIJgfrOPLIsDogRvM0_GwLBpyI'
    }
]

//Initialized the map with a marker on Olive Park
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 41.8916157, lng: -87.6169055},
        zoom: 15,
        mapTypeControl: false
    });
    ko.applyBindings(new ViewModel());
}

//Restaurant constructor
var Restaurant = function(data) {
    this.title = ko.observable(data.title);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.id = ko.observable(data.id);
    this.marker = ko.observable();
}

//Initialize ViewModel
var ViewModel = function() {
    var self = this;
    this.restaurantList = ko.observableArray([]);
    //var marker;
    locations.forEach(function(restaurantItem) {
        self.restaurantList.push(new Restaurant(restaurantItem));
    });

    var infoWindow = new google.maps.InfoWindow({
        maxWidth: 200,
    });
    var marker;

    self.restaurantList().forEach(function (restaurantItem) {
        marker = new google.maps.Marker({
        position: new google.maps.LatLng(restaurantItem.lat(), restaurantItem.lng()),
        map: map,
        title: restaurantItem.title(),
        animation: google.maps.Animation.DROP
        });

        restaurantItem.marker = marker;

        marker.addListener('click', function() {
            populateInfoWindow(this, infoWindow);
        });
    });

    function populateInfoWindow(marker, infoWindow) {
        if (infoWindow.marker != marker) {
            infoWindow.marker = marker;
            infoWindow.setContent('<div>' + marker.title + '</div>');
            infoWindow.open(map, marker);
            // Make sure the marker property is cleared if the infoWindow is closed.
            infoWindow.addListener('closeclick',function(){
                infoWindow.setMarker = null;
            });
        }
    }
}

