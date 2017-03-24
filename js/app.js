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
];

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

function mapError() {
    window.alert("Google Map not loading. Please try again.");
}

var YelpAPI = function(restaurantItem) {
    function nonce_generate() {
        return(Math.floor(Math.random() * 1e12).toString());
    }

    var yelp_url = 'https://api.yelp.com/v2/business/' + restaurantItem.id;

    var YELP_KEY = 'B9ymBjC2WE00WOsAZoNt2Q',
        YELP_KEY_SECRET = 'zZ8Q2IdeGJijD16F4Z_Bh8NxR4s',
        YELP_TOKEN = 'VJh8RhLzka23z7qAcJfK1o7vsYMCnrV1',
        YELP_TOKEN_SECRET = 'GBCUKxLdCP5LBAigCDzvlBRny0w';

    var parameters = {
        oauth_consumer_key: YELP_KEY,
        oauth_token: YELP_TOKEN,
        oauth_nonce: nonce_generate(),
        oauth_timestamp: Math.floor(Date.now() / 1000),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_version: '1.0',
        callback: 'cb'
    };

    var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
    parameters.oauth_signature = encodedSignature;

    var settings = {
        url: yelp_url,
        data: parameters,
        cache: true,
        dataType: 'jsonp',

        success: function(results) {
            //retrieve the restaurant rating and category.
            results.rating_img_url !== undefined ? restaurantItem.rating = results.rating_img_url : restaurantItem.rating = '';
            results.categories !== undefined ? restaurantItem.categories = results.categories : restaurantItem.categories = [];
            results.review_count !== undefined ? restaurantItem.review_count = results.review_count : restaurantItem.review_count = 0;
            //restaurantItem.rating = results.rating_img_url;
            //restaurantItem.categories = results.categories;
            //restaurantItem.review_count = results.review_count;
        },
        error: function() {
            window.alert("The API call failed. Please contact admin to fix the bug");
        }
    };

    $.ajax(settings);
};

//Initialize ViewModel
var ViewModel = function() {
    var self = this;
    var marker;
    var infoWindow = new google.maps.InfoWindow({
        maxWidth: 200,
    });
    self.filteredPlace = ko.observable('');
    self.restaurantList = ko.observableArray(locations);

    self.restaurantList().forEach(function (restaurantItem) {
        //Make a new marker for each restaurant.
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(restaurantItem.lat, restaurantItem.lng),
            map: map,
            title: restaurantItem.title,
            animation: google.maps.Animation.DROP
        });
        restaurantItem.marker = marker;
        //Call the API to get all the yelp results.
        YelpAPI(restaurantItem);

        //populate the infoWindow with all the information retrieved.
        google.maps.event.addListener(restaurantItem.marker, 'click', function() {

            //Set the infoWindow content with link to the yelp page, review and review counts.
            infoWindow.open(map, restaurantItem.marker);
            var content = '<a id="yelp-title" href="https://www.yelp.com/biz/'+ restaurantItem.id + '">' + restaurantItem.title + '</a>' +
                          '<p id="restaurant-category">' + restaurantItem.categories[0][0] + '</p>' +
                          '<h4 id="ylp-review-title">Rating:</h4>' + '<img id="ylp-review" src="' + restaurantItem.rating + '">' +
                          '<h4 id="ylp-review-count">Review Counts:' + restaurantItem.review_count + '</h4>';
            infoWindow.setContent(content);
            //Set the map center to the marker and bounce to highlight the marker.
            map.setCenter(restaurantItem.marker.position);
            if (restaurantItem.marker.getAnimation() !== null) {
                    restaurantItem.marker.setAnimation(null);
                }
            else {
                restaurantItem.marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    restaurantItem.marker.setAnimation(null);
                }, 1400);
            }
        });
    });

    //Add the search function
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
                //search the input in every entry. If found one (indexOf return value is not -1), set it as visible
                var match = restaurantItem.title.toLowerCase().indexOf(filteredPlace) !== -1;
                restaurantItem.marker.setVisible(match);
                infoWindow.close();
                return match;
            });
        }
    });

    self.showMarker = function(restaurantItem) {
         google.maps.event.trigger(restaurantItem.marker, 'click');
    };
};

