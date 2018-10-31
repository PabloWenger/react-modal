var pathmodify = require('pathmodify');

/**
 * @author Sinecio Bermúdez Jacque
 * @description karma's configurations
 */
module.exports = function(config) {
	config.set({
		port: 9876,
		basePath: '../',
		frameworks: ['browserify','jasmine'],
		files: [
			'src/tests/custom.js',
			'bundle/css/*.css',
			'bundle/js/*.js', 
			'src/tests/*.js'
		],
		exclude: [],
		preprocessors: {
			'src/tests/*.js': ['browserify']
		},
		browserify: {
			debug: true,
			plugin: [[pathmodify, require('../aliases')]],
			transform: [['babelify', require('./babel.config')], 'stringify'],
			extensions: ['.js', '.jsx']
		},
		reporters: ['verbose'],
		colors: true, 
		logLevel: config.LOG_INFO, //config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		autoWatch: true,
		browsers: ['phantomjs_without_security'], //it could be chrome_without_security for local tests.
		customLaunchers: {
			chrome_without_security: {
				base: 'Chrome',
				flags: ['--disable-web-security']
			},
			phantomjs_without_security: {
				base: 'PhantomJS',
				options: {
					settings: {
						webSecurityEnabled: false
					},
				},
				flags: ['--load-images=true'],
				debug: true
			}
		},
		phantomjsLauncher: {
			// Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
			exitOnResourceError: true
		},
		singleRun: false,
		concurrency: Infinity
	});
};
