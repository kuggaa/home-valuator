'use strict';

angular.module('homeValApp').factory('Helpers', ['$resource', '$route',
    function ($resource, $route) {

        return {
            /* Parse place object for query params */
            getQueryParams: function (place) {
                var street_number = '';
                var route = '';
                var locality = '';
                var administrative_area_level_1 = '';
                var postal_code = ''

                for (var i = 0; i < place.address_components.length; i++) {
                    var add_type = place.address_components[i].types[0];
                    if (add_type === "street_number") street_number = place.address_components[i].long_name;
                    if (add_type === "route") route = place.address_components[i].long_name;
                    if (add_type === "locality") locality = place.address_components[i].long_name;
                    if (add_type === "administrative_area_level_1") administrative_area_level_1 = place.address_components[i].long_name;
                    if (add_type === "postal_code") postal_code = place.address_components[i].long_name;
                }

                console.log("street_number", street_number)
                console.log("route", route)
                console.log("locality", locality)
                console.log("administrative_area_level_1", administrative_area_level_1)

                /* Preprocessing for Zillow call - TODO: remove */
                var address = street_number + " " + route;
                var citystatezip = locality + " " + administrative_area_level_1 + " " + postal_code;

                return {
                    street_number: street_number,
                    route: route,
                    address: address,
                    citystatezip: citystatezip,
                    postal_code: postal_code,
                    locality: locality,
                    state: administrative_area_level_1
                }
            }





        }
    }])