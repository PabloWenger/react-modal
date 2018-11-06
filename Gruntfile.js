/**
 * @author Sinecio Rodrigo Bermúdez Jacque
 * @description grunt configuration for tasks with browserify workflow
 */
module.exports = function(grunt){
	
	require('load-grunt-tasks')(grunt);

	var pkg = grunt.file.readJSON('package.json');
	var publishConfig = require('./conf/publish.config');
	var portscanner = require('portscanner');
	var browserify = require('browserify');
	var exorcist = require('exorcist');
	var serveStatic = require('serve-static');
	var pathmodify = require('pathmodify');
	var fs = require('fs');
	var path = require('path');
	var nodeSass = require('node-sass');
	var watchify = require('watchify');

	var time = (new Date()).getTime();

	//by default env is 'development'
	var env = 'dev'; 

	/**
	 * dependencies array of third party, so we bundle a
	 * single file that contains their scripts
	 */
	var libs = Object.keys(pkg.dependencies || {});
	var shim = require('./conf/shim.config');
	var shimlibs = Object.keys(shim.libs || {});

	/**
	 * serve statics
	 */
	var servesConfig = require('./conf/serves.config');

	/** 
	 * custom dirs
	 */ 
	var customPath = require('./conf/custom-path.config'); 
	var customDirDist = []; 
	var fixPath = function(input){ 
		return input.replace(/[\\/]+/g,'/').replace(/\/$/,''); 
	}; 
	Object.keys(customPath).forEach(function(path){ 
		var virtual = fixPath(path); 
		virtual = /^\//.test(virtual) ? virtual : '/' + virtual; 
		customDirDist.push({ 
			expand: true, 
			dot: true, 
			cwd: customPath[path], 
			dest: publishConfig.path + virtual, 
			src: ['**']
		}); 
	});

	var modsAliases = require('./aliases');
	
	/**
	 * finds a free port for livereload
	 */
	var liveReload_port = 35720;
	var liveReload_maxPort = 35750;
	var findPort = function(callback) {
		portscanner.findAPortNotInUse(liveReload_port, liveReload_maxPort, '127.0.0.1', callback);
	};

	grunt.initConfig({
		publishConfig: publishConfig,
		connect: {
			options: {
				hostname: 'localhost',
			},
			dev: {
				options: {
					open: true,
					useAvailablePort: true,
					middleware: function(connect) {
						var serves = [];
						servesConfig.forEach(function(serv){
							if (!serv.path) serves.push(serveStatic(serv.use));
							else {
								serves.push(connect().use(serv.use, serveStatic(serv.path)));
							}
						});
						Object.keys(customPath).forEach(function(path){ 
							var virtual = fixPath(path);
							virtual = /^\//.test(virtual) ? virtual : '/' + virtual; 
							serves.push(connect().use(virtual, serveStatic(customPath[path]))); 
						}); 
						serves.push(function(req, res, next){
							res.writeHead(200, { 'Content-Type': 'text/html' });
							res.end(grunt.file.read('./src/index.html'));
						});
						return serves;
					}
				}
			},
			dist: {
				options: {
					livereload: false,
					keepalive: true,
					open: true,
					useAvailablePort: true,
					base: {
						path: publishConfig.path,
						options: {
							index: 'index.html'
						}
					}
				}
			}
		},

		watch: {
			options: {			
				debounceDelay: 250,	
				event: ['changed', 'added', 'deleted'],
			},
			bundle: {
				options: {
					livereload: false,
					interrupt: true,
					spawn: false,
				},
				files: ['bundle/js/'+publishConfig.exports+'.js', 'bundle/css/'+publishConfig.exports+'.css', 'src/**/*.html']
			},
			sass: {
				files: ['src/**/*.scss'],
				tasks: ['sass:dev']
			},
			config: {
				files: ['conf/app.config.js'],
				tasks: ['write-env','browserify-app']
			},
		},

		clean: {
			options: {
				force: true,
			},
			bundle: './bundle',
			dist: [publishConfig.path]
		},

		copy: {
			app: {
				expand: true,
				dot: true,
				cwd: 'src',
				dest: publishConfig.path,
				src: ['**','!index.html','!**/*.js','!**/*.jsx','!bundle/**','!styles/**']
			},
			bundles: {
				expand: true,
				dot: true,
				cwd: 'bundle',
				dest: publishConfig.path,
				src: ['js/' + publishConfig.exports + '.*', 'css/' + publishConfig.exports + '.*']
			},
			styles_dist: {
				expand: true,
				dot: true,
				cwd: 'src/styles',
				dest: publishConfig.path,
				src: ['sass/**']
			},
			custom: { 
				files: customDirDist 
			} 
		},

		sass: {                              
			dev: {                           
				options: {          
					implementation: nodeSass,    
					includePaths: require('./conf/sass-path.config'),        
					outputStyle: 'expanded',
					sourceMap: true,
					sourceMapContents: true 
				},
				src: ['src/styles/sass/main.scss'],
				dest: 'bundle/css/' + publishConfig.exports +  '.css'
			},
			dist: {
				options: {
					implementation: nodeSass,
					includePaths: require('./conf/sass-path.config'),        
					outputStyle: 'compressed',
					sourceMap: true,
					sourceMapContents: true
				},
				src: ['src/styles/sass/main.scss'],
				dest: publishConfig.path + '/css/' + publishConfig.exports + '.min.css'
			}
		},

		uglify: {
			options: {
				sourceMap: true,
				sourceMapIncludeSources: false,
				banner: '/*! ' + pkg.name + ' - ' + grunt.template.today("yyyy-mm-dd") + ' @author '+ pkg.author +'*/\n'
			},
			app: {
				files: {
					'<%= publishConfig.path %>/js/<%= publishConfig.exports %>.min.js' : publishConfig.path + '/js/' + publishConfig.exports + '.js'
				}
			}
		},

		cleanempty: {
			options: {
				files: false,
				force: true,
			},
			dist: [publishConfig.path + '/**/*'],
		},

		'string-replace': {
			dev: {
				options: {
					replacements: [
						{
							pattern: /(<!--\s*?bundle:(js|css)\s*?-->)[\s\S]*?(<!--\s*?endbundle\s*?-->)/gm,
							replacement: function(match, sectype) {
								var tag = sectype.indexOf(':js') > 0 
									? '<script src="js/libs.js?_r='+ time +'"></script>\n\t<script src="js/' + publishConfig.exports + '.js?_r='+ time +'"></script>'
									: '<link rel="stylesheet" type="text/css" href="css/' + publishConfig.exports + '.css?_r='+ time +'">';
								return sectype + tag + '<!--endbundle-->';
							}
						}
					]
				},
				files: {
					'./src/index.html': './src/index.html'
				}
			}
		}

	});

	grunt.registerTask('browserify-libs', 'bundles third party dependencies', function(){
		var done = this.async();
		var dir = './bundle/js';
		var reqs = [].concat(libs);
		var excludes = shim.excludes || [];
		var filePath = path.join(__dirname, dir, 'libs.js');

		var b = browserify({
			debug: false
		});

		var handleError = function(err){
			if (!err) return;
			grunt.log.error(err);
			done(false);
		};

		if (!fs.existsSync(dir)) fs.mkdirSync(dir);
		
		if (shimlibs.length > 0 && shim.exports) {
			b.transform('browserify-shim', {
				global: true
			});
			
			shimlibs.forEach(function(lib){
				var i = reqs.indexOf(lib);
				var expose = shim.exports[lib];
				var modulePath = shim.libs[lib];

				if (i >= 0) reqs.splice(i, 1);
				else {
					if (/node_modules/i.test(modulePath)){
						i = reqs.indexOf(lib);
						if (i >= 0) reqs.splice(i, 1);
					}
				}
				b.require(require.resolve(shim.libs[lib]), {
					expose: typeof expose == 'string' ? expose : expose.exports
				}) 
			});
		}

		excludes.forEach(function(e){ 
			var r = reqs.indexOf(e); 
			if (r >= 0) reqs.splice(r, 1); 
		}); 

		b.require(reqs)
		.bundle(handleError)
		.pipe(fs.createWriteStream(filePath, 'utf8')).on('finish', done);
	});

	grunt.registerTask('browserify-app', 'bundles our app', function(dist){
		var done = this.async();
		var dir = './bundle/js';
		var mapFilePath = path.join(__dirname, dir, publishConfig.exports + '.js.map');
		var filePath = path.join(__dirname, dir, publishConfig.exports + '.js');

		var b = browserify({ 
			cache: {}, 
			packageCache: {}, 
			debug: true, 
			extensions: ['.js', '.jsx'],
			standalone: publishConfig.exports
		});

		var handleError = function(err){
			if (!err) return;
			grunt.log.error(err);
			done(false);
		};

		if (!fs.existsSync(dir)) fs.mkdirSync(dir);

		if (shimlibs.length > 0 && shim.exports){
			shimlibs.forEach(function(lib){
				var expose = shim.exports[lib];
				expose = typeof expose == 'string' ? expose : expose.exports
				if (libs.indexOf(expose) < 0) libs.push(expose);
			});
		}
		
		var entryFile = dist ? publishConfig.entryFile : './src/modules/index.js';
			
		b.require(entryFile, { entry : true })
		.plugin(watchify)
		.plugin(pathmodify, modsAliases)
		.transform('stringify')
		.transform('babelify', require('./conf/babel.config'))
		.external(libs)
		.on('update', bundle);

		function bundle(){
			b.bundle(handleError).pipe(exorcist(mapFilePath)).pipe(fs.createWriteStream(filePath, 'utf8')).on('finish', done);
		}

		bundle();
	});

	grunt.registerTask('find-port', 'finds a free port for livereload', function(){
		var done = this.async();
		findPort(function(error, port){
			if (error) {
				grunt.log.writeln('it can not find a free port for livereload');
				done(false);
				return false;
			}
			grunt.config.set('connect.options.livereload', port);
			grunt.config.set('watch.bundle.options.livereload', port);
			done();
		});
	});

	grunt.registerTask('write-env', 'writes a configuration env file', function(){
		var conf = require('./conf/app.config')(env);
		if (!conf) {
			grunt.log.error('it can not find a env configuration "' + env + '" in file conf/app.config.js');
			return false;
		}
		conf.RELEASE_NUM = time;
		grunt.file.write('./bundle/conf/env-config.cfg', 'module.exports='+JSON.stringify(conf)+';');
	});

	grunt.registerTask('env', 'start up for development', function(param){
		if (param) env = param;

		grunt.task.run([
			'clean:bundle',
			'find-port',
			'write-env',
			'string-replace',
			'sass:dev',
			'browserify-libs',
			'browserify-app',
			'connect:dev',
			'watch'
		]);
	});

	grunt.registerTask('dist', 'makes package using env config', function(param){
		env = param || publishConfig.env;
		grunt.task.run([
			'clean',
			'write-env',
			'browserify-libs',
			'browserify-app:dist',
			'copy',
			'sass:dist',
			'uglify',
			'cleanempty'
		]);
	});

	grunt.registerTask('test', 'runs all needed to do tests with karma', function(param){
		if (param) env = param;
		grunt.task.run([
			'write-env',
			'sass:dev',
			'string-replace',
			'browserify-libs',
			'browserify-app'
		]);
	});
};