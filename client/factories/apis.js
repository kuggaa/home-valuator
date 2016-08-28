'use strict';

angular.module('homeValApp').factory('Apis', ['$resource', '$route',
    function ($resource, $route) {

        return {
            /* Get Zillow Data */
            getZestimate: function (queryParams, callback) {
                $resource('/api/getZestimate').get(queryParams,
                function (results) {
                    callback(results, null);
                }, function (err) {
                    callback(null, err);
                })
            },
        }
    }])