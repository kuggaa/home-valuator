'use strict';

var express = require('express');
var router = express.Router();
var http = require('http');
var cheerio = require('cheerio');
var parseString = require('xml2js').parseString;
var util = require('util');
var request = require('request');
var replaceall = require('replaceall');
var madison = require('madison');
var noodle = require('noodlejs');
// var phantom = require('node-phantom');
var Horseman = require('node-horseman');
//var jsdom = require("jsdom");

router.get('/getZestimate', function (req, res) {
    getZestimate(req.query.address, req.query.citystatezip, res);
})

router.get('/opendoor', function (req, res) {
    console.log("called opendoor api")
    opendoordata(req.query.address, res);
})

router.get('/homesnapdata', function (req, res) {
    gethomesnapdata(req.query, res);
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
                res.json({ errorMessage: "No data found for this address" });
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
            res.status(200).json({ amount: amount, lastUpdated: lastupdated, valuationMax: valuationMax, valuationMin: valuationMin })
        });
    }
    http.request(options, callback).end();
}


function gethomesnapdata(query, res) {

    var url;
    var baseUrl = "http://www.homesnap.com/"
    var locality = replaceall(" ", "-", query.locality);
    var address = replaceall(" ", "-", query.address);
    var options = {
        headers: { 'user-agent': 'node.js' }
    }

    madison.getStateAbbrev(query.state, function (abbrev) {
        var url = baseUrl + abbrev + "/" + locality + "/" + address;
        // console.log("constructed url is", url);
        request(url, options, function (error, response, html) {
            console.log(response.statusCode);

            if (error || response.statusCode === 404) {
                console.log("error")
                res.json({ errorMessage: "No data found for this address" });
                return;
            }
            var $ = cheerio.load(html);
            var minval = $('.valueEstimateLow').find('.priceValue').text()
            var maxval = $('.valueEstimateHigh').find('.priceValue').text()
            var estimate;
            try {
                estimate = $('.pfValue.value').contents().get(0).nodeValue;
            } catch(err) {
                estimate = $('.lineStop').find('.statusSubInfo').text();
            }
            
            console.log("minval", minval, "currval", estimate, "maxval", maxval);
            res.status(200).json({ min: minval, est: estimate, max: maxval });
        })
    })
}


module.exports = router;


