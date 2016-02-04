
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

		connect: {
			myserver: {
				port: 8000,
				base: 'src/app',
				hostname: '*',
				onCreateServer: function(server, connect, options) {
					grunt.log.writeln('SERVER STARTING');
					var io = require('socket.io').listen(server);
					io.sockets.on('connection', function(socket) {
						// do something with socket
					});
				},

				//options: {
				//	port: 8000
				//	base: 'src/app',
				//	hostname: '*',
				//	onCreateServer: function(server, connect, options) {
				//		console.log("SERVER STARTING");
				//		var io = require('socket.io').listen(server);
				//		io.sockets.on('connection', function(socket) {
				//			// do something with socket
				//		});
				//	}
				//}
			},
			myotherserver: {
				port: 8001,
				base: 'src/app',
				hostname: '*'
				//e.g. grunt connect:myotherserver

			}
		},
		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['jshint']
		}
	});

	//grunt connect:keepalive, to prevent the webserver terminating when grunt does
	grunt.loadNpmTasks('grunt-contrib-jshint');
	//https://github.com/gruntjs/grunt-contrib-connect
	grunt.loadNpmTasks('grunt-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	//grunt.registerTask('default', []);
	grunt.registerTask('default', ['jshint']);

};



