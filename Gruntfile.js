
//http://gruntjs.com/sample-gruntfile

module.exports = function(grunt) {


	grunt.initConfig({
		jshint:  {
			files:   [
						'Gruntfile.js',
						'src/**/*.js',
						'test/**/*.js'
			],
			options: {
				globals: {
					jQuery: true
				}
			}
		},

		pkg: grunt.file.readJSON('package.json'),

		//https://github.com/gruntjs/grunt-contrib-connect
		connect: {


			//grunt connect:keepalive, to prevent the webserver
			//terminating when grunt does
			myserver: {
				options: {
					port: 8080,
					base: 'src/app',
					livereload: true,
					hostname: '*',
					keepalive: false,
					onCreateServer: function(server, connect, options) {
						grunt.log.writeln('SERVER STARTING');

						//http://socket.io/docs/
						var io = require('socket.io').listen(server);
						io.sockets.on('connection', function(socket) {
							// do something with socket
							socket.emit('gotconnection', { hello: 'world' });
						});
					},
				}
			},
			myotherserver: {
				port: 8001,
				base: 'src/app',
				hostname: '*'
				//e.g. grunt connect:myotherserver

			}
		},
		//watch: {
		//	html : {
		//		files: ['src/**/*.html', '!_site/**/*.html'],
		//	}
		//	//files: ['<%= jshint.files %>'],
		//	//tasks: ['jshint']
		//	options: {
		//		livereload: true
		//	}
		//},
		watch: {
			htmlfiles: {
				// Replace with whatever file you want to trigger the update from
				// Either as a String for a single entry
				// or an Array of String for multiple entries
				// You can use globing patterns like `css/**/*.css`
				// See https://github.com/gruntjs/grunt-contrib-watch#files
				files: [
					'src/**/*.html',
					'src/**/*.js',
					'src/**/*.css',
					'!bower_components/**/*.*'
				],
				options: {
					livereload: true
				}
			}
		},

		//open browser at project's URL
		//https://www.npmjs.com/package/grunt-open
		open: {
			dev: {
				// Gets the port from the connect configuration
				//path: 'http://localhost:<%= express.all.options.port%>'
				path: 'http://localhost:<%= connect.myserver.options.port%>/index.html'
			},
			prod: {
				// Gets the port from the connect configuration
				//path: 'http://localhost:<%= express.all.options.port%>'
				path: 'http://someprodhost:<%= connect.options.port%>'
			}
		}
	});

	// Load Grunt tasks declared in the package.json file
	// (https://www.npmjs.com/package/matchdep)
	require('matchdep')
			.filterDev('grunt-*')
			.forEach(grunt.loadNpmTasks);

	//https://github.com/gruntjs/grunt-contrib-watch/blob/master/docs/watch-examples.md
	grunt.event.on('watch', function(action, filepath, target) {
		grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
	});

	grunt.event.on('gotconnection', function(action, filepath, target) {
		//grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
		grunt.log.writeln("got connection");
	});

	grunt.registerTask('default', ['jshint']);

	//live reload using 'watch' plugin
	//http://rhumaric.com/2013/07/renewing-the-grunt-livereload-magic/

	// Start web server
	grunt.registerTask('serve', [
		'connect:myserver',
		'open:dev',
		'watch:htmlfiles'
	]);

};



