'use strict();'

var fs = require('fs');

exports.getlibrary = function (req, res) {
	fs.readFile('./server/api/proxy/vg/gameLibrary.json', 'utf-8', function (err, data) {
		var returnData = {},
			status;
		// if (err.code !== 'ENOENT') throw err;
		if (!err) {
			returnData = {error: false, data: JSON.parse(data)};
			status = 200;
		} else {
			returnData = {error: true, data: err};
			status = 500;
		}
		res.status(status).send(returnData);
	});
};

exports.getHWLibrary = function (req, res) {
	fs.readFile('./server/api/proxy/vg/hardwareLibrary.json', 'utf-8', function (err, data) {
		var returnData = {},
			status;
		// if (err.code !== 'ENOENT') throw err;
		if (!err) {
			returnData = {error: false, data: JSON.parse(data)};
			status = 200;
		} else {
			returnData = {error: true, data: err};
			status = 500;
		}
		res.status(status).send(returnData);
	});
};