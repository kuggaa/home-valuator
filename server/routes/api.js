'use strict';

var express = require('express');
var router = express.Router();
var http = require('http');
var cheerio = require('cheerio');
var parseString = require('xml2js').parseString;
var util = require('util')
//var jsdom = require("jsdom");

router.get('/getZestimate', function (req, res) {
    getZestimate(req.query.address, req.query.citystatezip, res);
})


function getZestimate(address, citystatezip, res) {
    var zwsid = "X1-ZWz1fetklge1vv_3wguv"
    var options = {
        host: "www.zillow.com",
        path: encodeURI("/webservice/GetSearchResults.htm?zws-id=" + zwsid + "&address=" + address + "&citystatezip=" + citystatezip)

    }
    var callback = function (response) {
        var str = '';
        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            if (str.length === 0) {
                res.status(200).send("no data available");
                return;
            }

            var xml = cheerio.load(str, { xmlMode: true });


            /* ERROR handling */
            var responseCode = xml('code').html();

            if (responseCode !== "0") {
                console.log("ERROR** no data found")
                res.json({errorMessage: "No data found for this address"});
                return;
            }


            
            var zestimateNode = xml('zestimate').html();
            var zestimate, amount, lastupdated, valuationRange, valuationMax, valuationMin;
            if (!(zestimateNode === null)) {
                zestimate = cheerio.load(zestimateNode);
                amount = zestimate('amount').html();
                lastupdated = zestimate('last-updated').html();
                valuationRange = cheerio.load(zestimate('valuationRange').html());
                valuationMax = valuationRange('high').html();
                valuationMin = valuationRange('low').html();
            }



            console.log("***ZILLOW*** \n", "amount is", amount, "lastupdate is", lastupdated, "valMax is", valuationMax, "valMin is", valuationMin);
            res.status(200).json({ amout: amount, lastupdated: lastupdated, valuationMax: valuationMax, valuationMin: valuationMin })
        });
    }
    http.request(options, callback).end();
}






module.exports = router;


