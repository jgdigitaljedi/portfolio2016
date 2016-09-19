'use strict';
/*jshint camelcase: false */
/*global moment: false */

angular.module('portfolioApp').factory('Dataobjects', [
	function() {
		var projectsObject = {
            personal: {
                entertainment: {
                    shortName: 'entertainment',
                    title: 'Home Entertainment Control Center',
                    color: '#424242',
                    tile: '../assets/images/home/gallery1.jpg',
                    images: ['../assets/images/home/gallery1.jpg', '../assets/images/home/gallery3.jpg',
                        '../assets/images/home/gallery4.jpg', '../assets/images/home/gallery5.jpg'],
                    description: 'I\'ve got 10 video game consoles along with streaming boxes, a bluray player, '+
                        'a surround system, and more hooked up to my living room entertainment center. My wife '+
                        'and, on occasion, our houseguests find it difficult to know how to operate everything. '+
                        'This app started as a basic guide with pictures to instruct you how to use everything. '+
                        'It has since grown and become a video game library database and more. This on is still got '+
                        'a fair amount of development left, but I have my master branch version running on my home '+
                        'server and a Raspberry Pi acting as my DNS server to route traffic from "ghome.help" to this app.',
                    github: 'https://github.com/jgdigitaljedi/homeEntertainment',
                    techs: 'Node, MongoDB, Angular, Express, Angular Material',
                    apis: 'GiantBomb, WeatherUnderground'
                },
                dash: {
                    shortName: 'dash',
                    title: 'My Dash',
                    color: '#BF360C',
                    tile: '../assets/images/dash/dash-gallery-1.png',
                    images: ['../assets/images/dash/dash-gallery-1.png', '../assets/images/dash/dash-gallery-2.png', '../assets/images/dash/dash-gallery-3.png',
                        '../assets/images/dash/dash-gallery-4.png', '../assets/images/dash/dash-gallery-5.png'],
                    description: 'This was one of my "senior projects" at MakerSquare. Get randomized restaurant and bar suggestions, view weather '+
                        'info and radar, track packages, view phone notifications, and control your HomeJS devices all from one screen! I have not launched this app ' +
                        'because I want to rebuild it with my newly learned superpowers!',
                    link: false,
                    github: 'https://github.com/jgdigitaljedi/dashboard',
                    techs: 'AngularJS, Bootstrap',
                    apis: 'FourSquare, WeatherUnderground, Openweathermap, Boxoh, Pushbullet, HomeJS, Firebase, and Google Maps'
                },
                lassos: {
                    shortName: 'lassos',
                    title: 'Texas Lassos Alumni Connect',
                    color: '#F57F17',
                    tile: '../assets/images/lassos/lassos-gallery-1.png',
                    images: ['../assets/images/lassos/lassos-gallery-1.png', '../assets/images/lassos/lassos-gallery-2.png', '../assets/images/lassos/lassos-gallery-3.png'],
                    description: 'This application was built by request for the Texas Lassos Alumni Group. I worked on a team with two other developers' +
                        ' to create a private social network for the group. The app has a table for all alums and a table for alums who have joined the' +
                        ' network. Upon signing up, the app notifies the admins, tells the user they must wait for approval, and ' +
                        'looks for the user in the alum table to see if it can move their info to the active user table. After approval' +
                        ' the user is notified to log in and can edit their profile and use the app. Admins can import and export user info via Excel sheets.',
                    link: 'http://connect.lassoalumni.org/users/sign_in',
                    github: 'https://github.com/jgdigitaljedi/tx-lassos',
                    techs: 'Ruby on Rails, Devise gem, Roo gem, jQuery, Bootstrap'
                },
                rr: {
                    shortName: 'rr',
                    title: 'Restaurant Roulette',
                    color: '#B71C1C',
                    tile: '../assets/images/rr/rr-gallery-1.png',
                    images: ['../assets/images/rr/rr-gallery-1.png', '../assets/images/rr/rr-gallery-2.png', '../assets/images/rr/rr-gallery-3.png', '../assets/images/rr/rr-gallery-4.png',
                        '../assets/images/rr/rr-gallery-5.png'],
                    description: 'This app was done during a 2 day hackathon when I was completely new to Angular so I chose to use it as a way to teach myself how it works . It geolocates you via IP address,' +
                        ' gets a list of 30 restaurants near you via the FourSquare API, then randomly selects 2 choices for you providing you with a website link and ' +
                        'Google map for each one. The idea was to take the trouble out of deciding where to eat lunch. I have plans to do a complete rewrite and host '+
                        'it on this server eventually',
                    link: false,
                    github: 'https://github.com/jgdigitaljedi/hackday/tree/gh-pages',
                    techs: 'AngularJS, Angular-strap',
                    apis: 'Foursquare, Google Maps'
                },
                game: {
                    shortName: 'game',
                    title: 'Phangular 2048',
                    color: '#AFB42B',
                    tile: '../assets/images/2048/preview/gallery1.jpg',
                    images: ['../assets/images/2048/preview/gallery1.jpg', '../assets/images/2048/preview/gallery2.jpg'],
                    description: 'As a coding challenge once, I was asked to make a 2048 game. I liked the project '+
                        'so much I decided to include it in the "Fun" section of this site. Check it out!',
                    github: 'https://github.com/jgdigitaljedi/ng2048',
                    techs: 'Node, Angular, Express, MongoDB, Phaser, Angular Material'
                },
                portfolio: {
                    shortName: 'portfolio',
                    title: 'Portfolio',
                    color: '#FBC02D',
                    tile: '../assets/images/port/gallery1.jpg',
                    description: 'Well, this is the page you\'re looking at right now. Why list it as a project? There\'s a lot going on here, that\'s why! For starters, '+
                        'I deploy my team\'s apps at work so I decided I might as well rough it here too. This is running on a DigitalOcean server on my '+
                        'server config setup. All configuration was done through ssh. Aside from that and just from generally liking what I\'ve done '+
                        'here, I\'ve got some things going on that you can\'t see. I decided to use this server for more than just hosting my portfolio. I\'ve used '+
                        'Express to make routes that just return data to me. For example, got to http://joeyg.me/morning and you\'ll see a string returned ' +
                        'that is talking about traffic and weather. I use an app called Tasker on my phone to hit that address in the morning when my phone connects '+
                        'to the bluetooth in my truck. That string is then read aloud to me over my truck\s stereo so I know what to expect my commute to be like. I am also working on integrating a call to my calendar to read back my ' +
                        'events for the day as well. I have more plans for the server too, but time is greatest my obstacle. \n \n TLDR: I am doing some cool things '+
                        'with this server I have setup!',
                    github: 'https://github.com/jgdigitaljedi/portfolio2016',
                    techs: 'MongoDB, ExpressJS, AngularJS, NodeJS, Angular Material, MomentJS, Nodemailer, d3, Phaser',
                    apis: 'Weather Underground, Last.fm, Bing Maps, GitHub, Yelp'
                },
                toolbox: {
                    shortName: 'toolbox',
                    title: 'Toolbox',
                    color: '#2196F3',
                    tile: '../assets/images/toolbox-screen.png',
                    images: ['../assets/images/toolbox-screen.png'],
                    description: 'After writing a countless number of vbscripts and batch files to perform remote and batch tasks, I finally decided to write an' +
                        ' HTA to give the script collection a GUI and make it easier for anyone to use my scripts. Although a lot of features had to be removed prior' +
                        ' to posting to GitHub because they contained server addresses or were for very client specific tasks, the project is still huge and loaded with' +
                        ' functionality. I used vbscript, JavaScript, HTML, and CSS to generate an HTA that has many external vbscript and batch file dependencies. This ' +
                        'is a Windows desktop app made to function inside a Windows domain and was made for people in IT positions.',
                    link: false,
                    github: 'https://github.com/jgdigitaljedi/myToolBox',
                    techs: 'VBScript, batch, JavaScript, ActiveX'
                },
                restaurant: {
                    shortName: 'restaurant',
                    title: 'Restaurant Roulette Remix',
                    color: '#2196F3',
                    tile: '',
                    description: 'I made the original version of this app with 2 other guys during a 2 day hackathon '+
                        'while attending MakerSquare. For the sake of getting things done quickly, we used the '+
                        'FourSquare API and kind of ignored best practices. Since that was hosted on divshot which '+
                        'has since been terminated, I made a new version of it hosted on this site using the Yelp! '+
                        'API with more options. No github link since the code lives in this sites\'s code.',
                    techs: 'Angular Material, Angular, Node, Express',
                    apis: 'Yelp!'
                }
            },
            work: {
                host: {
                    shortName: 'host',
                    title: 'Host Reports',
                    description: 'DUE TO A NONDISCLOSURE AGREEMENT, I AM LIMITED AS TO WHAT I CAN SAY ABOUT THIS APP AND CANNOT PROVIDE IMAGES. The purpose of this app is to give very' +
                    ' detailed, highly customizable reports to the client across a wide array of data sets. The app is' +
                    ' completely dynamic meaning if new methods for generating reports are added to the backend, the app will automatically add the report name to the side' +
                    ' navbar and generate the report page without any additional development. This was made possible due to the fact that the app makes a call on load to see what' +
                    ' reports are available. Once the client navigates to a report, a call is made to get the report definition which allows the app to know what kind of input fields ' +
                    'should be used and how to format the tables and generate the charts. All data calls are done as Ajax requests to Python methods. We also wrote some PHP to handle CORS issues. ' +
                    'The app also has the current weather conditions in the navigation bar for the client\'s convenience. ',
                    apis: 'Weather Underground',
                    techs: 'Bootstrap, jQuery, Bootstrap Tables, MomentJS, D3, ChartJS, Raphael',
                    members: 4
                },
                roms: {
                    shortName: 'roms',
                    title: 'WebROMS',
                    description: 'DUE TO A NONDISCLOSURE AGREEMENT, I AM LIMITED AS TO WHAT I CAN SAY ABOUT THIS APP AND CANNOT PROVIDE IMAGES. This app was meant for our internal technicians ' +
                    'as well as the people in a more technical role in our client\'s organization. This application visualizes data with interactive maps, multiple chart types, and Kendo grids. ' +
                    'Additionally, there is an admin panel built in allowing for granular permissions controls for user groups allowing management to control who can see and do what in the application. ' +
                    'The highlight of the application is a completely customizable dashboard that allows the user to add widgets and arrange widgets. A user can select what kind of widget they would like, ' +
                    'what data set will be visualized, widget location on the dashboard, and the widget size. As an added bonus, I added the ability to change the color of any widget and save the widget layout to our MongoDB allowing the ' +
                    'user to immediately pull up their preferred layout on application launch. All data calls are made through a Soap service running on our node server that converts the xml to JSON' +
                    ' and back allowing the team to make standard http requests.',
                    apis: 'Weather Underground, Google Maps',
                    techs: 'AngularJS, ExpressJS, NodeJS, MongoDB, Kendo UI, Bootstrap, MomentJS, Gridster',
                    members: 12
                },
                elcc: {
                    shortName: 'elcc',
                    title: 'ELCC',
                    description: 'DUE TO A NONDISCLOSURE AGREEMENT, I AM LIMITED AS TO WHAT I CAN SAY ABOUT THIS APP AND CANNOT PROVIDE IMAGES. This is my most '+
                        'recent project and the entire UI was written by myself and 1 other team member. The purpose of the application was to allow our clients to '+
                        'monitor their toll roads at the sensor level. This allows for traffic map generation, more visualizations for the client, and the creation '+
                        'of a dynamic pricing engine that adjusts the toll rates according to the current volume and historical data. The granular security '+
                        'components are more widesporead throughout this application because the user can change toll rates and signs from this application, granted '+
                        'they have the permissions or have a supervisor override. The application features maps with clickable canvas elements that change data parameters '+
                        'represented on the page; almost every chart type available in Kendo UI with date/time pickers and dropdowns to change the parameters and '+
                        'rebuild the charts; grids that can be sorted, filtered, and reordered; live camera feeds; live updating data; and much more. During development '+
                        'the decision was made to take the design into a material design direction making this the most visually appealing app I have been a part of yet.',
                    apis: 'Weather Underground, Google Maps',
                    techs: 'AngularJS, ExpressJS, NodeJS, Kendo UI, Bootstrap, MomentJS, Raphael, Socket.IO',
                    members: 8
                },
                printer: {
                    shortName: 'printer',
                    title: 'Printable Reports Generator',
                    description: 'My company had a real need to create a PDF generator so our client\'s could print '+
                        'from our reports app. Our old solution was in Python and had some very hardcoded, report specific '+
                        'parts to it. I volunteered to create a new solution. I used Node and Express to generate a '+
                        'server instance with some endpoints. From there I was able to create a PDF generator that receives '+
                        'a string containing the html of the report table and, using some custom css and PhantomJS, I '+
                        'render the report and return it back to the caller in a stream. I didn\'t stop there. I went ahead '+
                        'and added endpoints and logic for csv and Excel document creation from JSON objects as well.',
                    techs: 'Node, Express, PhantomJS, Bluebird, ms-excelbuilder-colorfix',
                    members: 1
                }
            }
		};

		var resumeObject = {
		    'experience':[
		    	{
		            'type':'Employment',
		            'institution':'AT&T Mobility',
		            'title':'Customer Service Representative',
		            'from':'2006-09-25',
		            'to':'2008-04-01',
		            'description':'Answered incoming phone calls from customers and tried to negotiate payment arrangements on past due balances.'+
		            	'\n Performed manager relief duties answering escalted phone calls and generating reports.',
		            'default_item':false
		        },
		        {
		            'type':'Employment',
		            'institution':'Partnership Broadband',
		            'title':'Field Technician',
		            'from':'2008-11-01',
		            'to':'2014-07-12',
		            'description':'Deployed and configured wireless networking technologies on towers.'+
		            	'\n Installed service for new customers and did service tickets for established customers.',
		            'default_item':false
		        },
		    	{
		            'type':'Employment',
		            'institution':'Mobile PC Experts',
		            'title':'Owner/Technician',
		            'from':'2007-04-01',
		            'to':'2014-07-12',
		            'description':'Worked as owner and technician requiring me to balance my time between the business tasks and client services.'+
		            	'\n Provided PC repair, home theater installation, and networking solutions for customers at their home or business.',
		            'default_item':false
		        },
		        {
		            'type':'Employment',
		            'institution':'IBM',
		            'title':'Desktop Services Technician',
		            'from':'2008-11-01',
		            'to':'2014-07-12',
		            'description':'Provided highest tier desktop and network support for clients.'+
		            	'\n Wrote VBScripts, HTAs, and batch files to automate as many repetitive tasks as possible.',
		            'default_item':false
		        },
		        {
		            'type':'Employment',
		            'institution':'Kapsch TrafficCom',
		            'title':'Software Engineer',
		            'from':'2014-11-03',
		            'to':null, /* because this is my current job, it doesn't have an end date */
		            'description':'Design JavaScript/Angular applications to visualize tolling and traffic data. '+
		            	'\n Create many types of data visualizations using Kendo UI, D3, ChartJS, Raphael, Google Maps, and more.'+
                        '\n Architect, design, and implement NodeJS server and application solutions.',
		            'default_item':true
		        }
		    ],
		    'study':[
		        {
		            'type':'Study',
		            'institution':'MakerSquare',
		            'title':'Student',
		            'from':'2014-07-14',
		            'to':'2014-10-03',
		            'description':'Learned modern web technologies, best practices, and methodologies.'+
                        '\n Got exposed to Rails, Angular, Node, Underscore, and many more frameworks and libraries.'+
		            	'\n Developed and deployed apps built on Angular and Rails.',
		            'default_item':false
		        }
		    ]
		};

		var materialArray = ['#F44336', '#D32F2F', '#B71C1C', '#E91E63', '#C2185B', '#880E4F', '#9C27B0', '#7B1FA2', '#4A148C', '#673AB7',
		'#512DA8', '#311B92', '#3F51B5', '#303F9F', '#1A237E', '#2196F3', '#1976D2', '#0D47A1', '#03A9F4', '#0288D1', '#01579B', '#00BCD4', 
		'#0097A7', '#006064', '#009688', '#00796B', '#004D40', '#4CAF50', '#388E3C', '#1B5E20', '#8BC34A', '#689F38', '#33691E', '#CDDC39', 
		'#AFB42B', '#827717', '#FFEB3B', '#FBC02D', '#F57F17', '#FFC107', '#FFA000', '#FF6F00', '#FF9800', '#F57C00', '#E65100', '#FF5722',
		'#E64A19', '#BF360C'];

        var skills = [
            {
                title: 'UI',
                skillList: [
                    {name: 'JavaScript', rating: 92},
                    {name: 'HTML', rating: 90},
                    {name: 'CSS', rating: 88},
                    {name: 'LESS', rating: 80},
                    {name: 'SASS', rating: 75}
                ]
            }, {
                title: 'JavaScript',
                skillList: [
                    {name: 'Angular', rating: 90},
                    {name: 'Node', rating: 84},
                    {name: 'jQuery', rating: 80}
                ]
            }, {
                title: 'General Programming',
                skillList: [
                    {name: 'JavaScript', rating: 92},
                    {name: 'VB Script', rating: 80},
                    {name: 'Ruby', rating: 80},
                    {name: 'Python', rating: 65}
                ]
            }, {
                title: 'Database',
                skillList: [
                    {name: 'MongoDB', rating: 85},
                    {name: 'PostgreSQL', rating: 65}
                ]
            }
        ];

		return {
			getResume: function () { return resumeObject; },
			getMaterialColors: function () { return materialArray; },
            getProjects: function () { return projectsObject; },
			getSkills: function () { return skills; }
		};
	}
]);