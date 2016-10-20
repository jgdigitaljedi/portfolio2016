# 2016 Portfolio rewrite

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


### Installation
You must have Ruby and Sass installed for this to work. Also, you would need to set env variables for all of the API key references in the server code.

```sh
$ npm install grunt bower -g
$ npm install
```

### To Run It
```sh
$ grunt serve
```

### APIs

 - Yelp!
 - Weather Underground
 - Google Maps
 - Last.fm
 - Bing!
 - GitHub

### Todos

 - Style it up
 - Make it more responsive
 - Redesign fun page (no thoughts on something visually appealing yet)
 - Make a social page
 - Finish Restaurant Roulette Remix
 	- make result cards same height always
 	- stress test it some more
 	- darken background in night mode
 	- delay distance options card rendering until possible options are calculated
 - Eventually add a blog
