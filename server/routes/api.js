'use strict';

var express = require('express');
var router = express.Router();
var http = require('http');
var cheerio = require('cheerio');

router.get('/getZestimate', function (req, res) {
    console.log(req.query);
    getZpid(req.query.address, req.query.citystatezip);

})


function getZpid(address, citystatezip) {
    var zwsid = "X1-ZWz1fetklge1vv_3wguv"

    var options = {
        host: "www.zillow.com",
        path: encodeURI("/webservice/GetSearchResults.htm?zws-id=" + zwsid + "&address=" + address + "&citystatezip=" + citystatezip)

    }

    var callback = function (response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            //console.log(str);
            var xml = cheerio.load(str, {xmlMode: true});
            var zestimate = cheerio.load(xml('zestimate').html());
            var amount = zestimate('amount').html();
            var lastupdated = zestimate('last-updated').html();
            var valuationRange = cheerio.load(zestimate('valuationRange').html());
            var valuationMax = valuationRange('high').html();
            var valuationMin = valuationRange('low').html();
            console.log("amount is", amount, "lastupdate is", lastupdated, "valMax is", valuationMax, "valMin is", valuationMin);
        });
    }


    http.request(options, callback).end();


    // var baseUrl = "http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=" + zwsid + "&address=" + address + "&citystatezip=" + citystatezip;


}


module.exports = router;