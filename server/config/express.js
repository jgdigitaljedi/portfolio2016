/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');

module.exports = function(app) {
  var env = app.get('env');


  app.use(function (req, res, next) {
    var maxAge;
    if (req.url.indexOf('/assets/fonts/') >= 0 || req.url.indexOf('/assets/icons/') >= 0
      || req.url.indexOf('/assets/iconsets/') >= 0) {
      maxAge = 31536000; // browser cache for fonts and icons to a year
    } else if (req.url.indexOf('/assets/images/') >= 0  || req.url.indexOf('/bower_components/') >= 0) {
      maxAge = 604800; // browser cache for images and bower deps to a week (make longer after dev slows)
    } else if (req.url.indexOf('/assets/components/') >= 0 || req.url.indexOf('/app/') >= 0) {
      maxAge = 86400; // browser cache for scripts to a day until dev slows down
    }
    if (maxAge) {
      res.setHeader('Cache-Control', 'public, max-age=' + maxAge);
      res.setHeader('Expires', new Date(Date.now() + (maxAge * 1000)).toUTCString());
    }
    next();
  });

  app.set('views', config.root + '/server/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());

  if ('production' === env) {
    app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('appPath', path.join(config.root, 'public'));
    app.use(morgan('dev'));
  }

  if ('development' === env || 'test' === env) {
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', path.join(config.root, 'client'));
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
};
