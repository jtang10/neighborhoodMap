//Initialize some restaurants' locations
var locations = [
    {
        title: 'Yolk - Streeterville',
        lat: 41.891975,
        lng: -87.617959,
        id: 'yolk-chicago-8'
    },
    {
        title: 'Indian Garden',
        lat: 41.893212,
        lng: -87.620810,
        id: 'the-indian-garden-chicago-4'
    },
    {
        title: 'Garrett Popcorn Shop',
        lat: 41.893202,
        lng: -87.624556,
        id: 'garrett-popcorn-shops-chicago-8'
    },
    {
        title: 'Cite',
        lat: 41.891510,
        lng: -87.612319,
        id: 'cite-chicago-4'
    },
    {
        title: 'Tanta Chicago',
        lat: 41.891855,
        lng: -87.632020,
        id: 'tanta-chicago'
    },
    {
        title: 'The Purple Pig',
        lat: 41.891297,
        lng: -87.624837,
        id: 'the-purple-pig-chicago'
    },
    {
        title: 'Capital Grille',
        lat: 41.893787,
        lng: -87.622352,
        id: 'capital-grille-chicago'
    },
    {
        title: 'RPM Italian',
        lat: 41.890931,
        lng: -87.629948,
        id: 'rpm-italian-chicago'
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
}

//Initialize ViewModel
var ViewModel = function() {
    var self = this;
    var marker;
    var infoWindow = new google.maps.InfoWindow({
        maxWidth: 200,
    });
    self.filteredPlace = ko.observable('');
    self.restaurantList = ko.observableArray([]);

    locations.forEach(function(restaurantItem) {
        self.restaurantList.push(new Restaurant(restaurantItem));
    });

    //
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
            infoWindow.addListener('closeclick', function() {
                infoWindow.marker = null;
            });
        }
    }

    self.search = ko.computed(function() {
        var filteredPlace = self.filteredPlace().toLowerCase();
        if (!filteredPlace) {
            self.restaurantList().forEach(function (restaurantItem) {
                if (restaurantItem.hasOwnProperty('marker')) {
                    restaurantItem.marker.setVisible(true);
                }
            });
            return self.restaurantList();
        }
        else {
            return ko.utils.arrayFilter(self.restaurantList(), function(restaurantItem) {
                var match = restaurantItem.title().toLowerCase().indexOf(filteredPlace) !== -1;
                restaurantItem.marker.setVisible(match);
                //self.closeInfoWindow();
                return match;
            });
        }
    });

    self.showMarker = function(restaurantItem) {
        google.maps.event.trigger(restaurantItem.marker, 'click');
    };

    self.closeInfoWindow = function() {
        infowindow.close();
    };
}

