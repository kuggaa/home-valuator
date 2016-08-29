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


            /* Get opendoor Data */
            getopendoor: function (address, callback) {
                $resource('/api/opendoor').get({address: address}, 
                function (result) {
                    callback(result, null);
                }, function (err) {
                    callback(null, err);
                })
            },

            /* Get homesnapdata Data */
            gethomesnapdata: function (queryParams, callback) {
                $resource('/api/homesnapdata').get(queryParams,
                function (results) {
                    callback(results, null);
                }, function (err) {
                    callback(null, err);
                })
            },


        }
    }])