'use strict';

var express = require('express'),
    app = express(),
    http = require('http'),
    mornObj = {},
    coldMessage = ['. You should take a jacket', '. It\'s gonna be a cold one', '. Chilly might be an understatement',
        '. Turn off the infrared heater before you leave'],
    hotMessage = ['. It will be another typical summer day in Texas', '. Triple digits once again', '. Prepare to be a sweaty mess at some point today',
        '. I heard hell is going to be cooler than Austin today'];

function randomNum(num) {
    return Math.floor(Math.random() * num);
}

function organizeResponse(res, anoon) {
    var currentBit = mornObj.curTemp ? '. Currently it is ' + mornObj.curTemp + ' degrees and ' + mornObj.curCondition : '. Current conditions not available',
        forecastBit = mornObj.forecast ? '. Forecast is ' + mornObj.forecast : '. Forecast not available',
        rainMessage = [' Better check to make sure you have an umbrella. There is a ' + mornObj.rain + ' percent chance of precipitation.',
            ' It\'s gonna be a wet one! Looks like there is a ' + mornObj.rain + ' percent chance of precipitation.',
            ' Expect to have soggy feet when you get to work because there is a ' + mornObj.rain + ' percent chance of precipitation.'],
        trafficTime = mornObj.traffic ? 'Today\'s commute should take about ' +  Math.round(mornObj.traffic.travelDurationTraffic / 60) + ' minutes' : 'Bing fucked up so no traffic data';
    if (mornObj.low <= 50 && !anoon) {
        var needCoat = coldMessage[randomNum(4)];
        currentBit += needCoat;
    }
    if (mornObj.high >= 100 && !anoon) {
        var texasDay = hotMessage[randomNum(4)];
        currentBit += texasDay;
    }
    if (parseInt(mornObj.rain && !anoon) >= 30) {
        var wetOne = rainMessage[randomNum(3)];
        forecastBit += wetOne;
    }

    res.send(trafficTime + currentBit + forecastBit);
}

function getCalendar(res, anoon) {
    // TODO: write in Google Calendar bit to get events for the day
    organizeResponse(res, anoon);
}

function getForecast(res, anoon) {
    http.get({
        host: 'api.wunderground.com',
        path: '/api/' + process.env.JWUKEY + '/forecast/q/TX/' + (anoon ? 'Manor' : 'Austin') + '.json'
    }, function (response) {
        var body = '';
        if (response.statusCode < 200 || response.statusCode > 299) {
            mornObj.forecast = false;
        } else {
            response.on('data', function (d) {
                body += d;
            });
            response.on('end', function () {
                var parsed = JSON.parse(body);
                mornObj.forecast = parsed.forecast.txt_forecast.forecastday[0].fcttext;
                mornObj.rain = parsed.forecast.txt_forecast.forecastday[0]['pop']; // jshint ignore:line
                mornObj.high = Math.round(parsed.forecast.simpleforecast.forecastday[0].high.fahrenheit);
                mornObj.low = Math.round(parsed.forecast.simpleforecast.forecastday[0].low.fahrenheit);
                getCalendar(res, anoon);
            });
        }
    });
}

function getConditions(res, anoon) {
    http.get({
        host: 'api.wunderground.com',
        path: '/api/' + process.env.JWUKEY + '/conditions/q/TX/' + (anoon ? 'Manor' : 'Austin') + '.json'
    }, function (response) {
        var body = '';
        if (response.statusCode < 200 || response.statusCode > 299) {
            mornObj.curTemp = false;
        } else {
            response.on('data', function (d) {
                body += d;
            });
            response.on('end', function () {
                var parsed = JSON.parse(body);
                mornObj.curTemp = Math.round(parsed.current_observation.temp_f);
                mornObj.curCondition = parsed.current_observation.weather;
                mornObj.precip = parsed.current_observation.precip_today_in;
                getForecast(res, anoon);
            });
        }
    });
}

function getTraffic(res, anoon) {
    var home = encodeURI(process.env.JHOMEADD),
        parking = encodeURI(process.env.JWORKADD);
    http.get({
        host: 'dev.virtualearth.net',
        path: '/REST/V1/Routes/Driving?wp.0=' + (anoon ? parking : home) + '&wp.1=' + (anoon ? home : parking) + '&key=' + process.env.JBINGMAPS
    }, function (response) {
        var body = '';
        if (response.statusCode < 200 || response.statusCode > 299) {
            mornObj.traffic = false;
        } else {
            response.on('data', function (d) {
                body += d;
            });
            response.on('end', function () {
                var parsed = JSON.parse(body);
                mornObj.traffic = parsed.resourceSets[0].resources[0];
                getConditions(res, anoon);
            });
        }
    });
}

exports.getInfo = function(req, res) {
    getTraffic(res, false);
};

exports.getHomeCommute = function (req, res) {
    getTraffic(res, true);
};