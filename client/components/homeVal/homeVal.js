'use strict';

var place;

homeValApp.controller('HomeValCtrl', ['$scope', '$resource', 'Helpers', 'Apis',
    function ($scope, $resource, Helpers, Apis) {
        $scope.homeVal = {};
        $scope.homeVal.initmsg = true;

        $scope.homeVal.submit = function () {

            var queryParams = Helpers.getQueryParams(place);
            Apis.getZestimate(queryParams, function (result, err) {
                console.log(result);
                if (result.errorMessage) {
                    $scope.homeVal.error = true;
                    $scope.homeVal.initmsg = false;
                } else {
                    $scope.homeVal.error = false;
                    $scope.homeVal.amount = result.amount;
                    $scope.homeVal.lastUpdated = result.lastUpdated;
                    $scope.homeVal.valuationMax = result.valuationMax;
                    $scope.homeVal.valuationMin = result.valuationMin;
                    $scope.homeVal.initmsg = false;
                }
            })
        }
    }])




/* Google maps api callback */
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.714232, lng: -73.9612889 },
        zoom: 10
    });
    var input = /** @type {!HTMLInputElement} */(
        document.getElementById('pac-input'));

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete.addListener('place_changed', function () {
        infowindow.close();
        marker.setVisible(false);
        place = autocomplete.getPlace();
        console.log(place)
        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
        }
        marker.setIcon(/** @type {google.maps.Icon} */({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        }));
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map, marker);
    });
}


