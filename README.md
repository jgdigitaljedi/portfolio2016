# 2016-2107 Portfolio rewrite

...because I never spent much time on one before and my old ones were boring!

### Tech

This app/site uses a number of open source projects to work properly:

* [AngularJS](https://github.com/angular/angular) - HTML enhanced for web apps!
* [node.js](https://nodejs.org/en/) - evented I/O for the backend
* [Phaser.js](https://github.com/photonstorm/phaser) - Phaser is a fun, free and fast 2D game framework for making HTML5 games for desktop and mobile web browsers, supporting Canvas and WebGL rendering.
* [Angular Material](https://github.com/angular/material) - Material design for Angular
* [grunt](https://github.com/gruntjs/grunt) - Grunt: The JavaScript Task Runner
* [Express](https://github.com/expressjs/express) - Express.js: the fast, unopinionated, minimalist web framework for node
* [Mongoose](https://github.com/Automattic/mongoose) - MongoDB object modeling designed to work in an asynchronous environment.
* [MongoDB](https://www.mongodb.com/) - Building on the Best of Relational with the Innovations of NoSQL
* [D3](https://d3js.org/) - Data Driven Documents
* [DataTables](https://datatables.net/) - Table plugin for jQuery

### APIs

 - Yelp!
 - Weather Underground
 - Google Maps Directions
 - Google Maps Places
 - Last.fm
 - Bing!
 - GitHub
 - GiantBomb

### Installation
You must have Ruby and Sass installed for this to work. Also, you would need to set env variables for all of the API key references in the server code.

```sh
$ npm install grunt bower -g
$ npm install
$ bower install
```

### To Run It
```sh
$ grunt serve
```


### Todos that came to my attention after deployment
- update outdated deps

### Eventual improvements
- Change video game library to MongoDB instead of JSON
- Login/Auth with UI for me to manually CRUD items in video game library
- Use weather conditions to add clouds, rain, fog, etc to landing page
- Refactor some of the older code for cleanliness and performance
- Think of another app to dev and add to Fun page
- Add a blog (I plan to write my own blog platform in MEAN stack) 

### Deployment goals accomplished
- Serving with gzip if file > 256 kb
- Serving with SSL and certs auto renew
- Linux service to auto start app if server reboots
- Everything is minified/optimized
- Cache-control & expiration headers conditionally set in Express

