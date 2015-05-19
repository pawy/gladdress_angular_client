var config = require('./gulpconfig.json'),
	gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	concat = require('gulp-concat'),
	gif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	minifycss = require('gulp-minify-css'),
	filesize = require('gulp-filesize'),
	plumber = require('gulp-plumber'),
	ngAnnotate = require('gulp-ng-annotate'),
	templateCache = require("gulp-angular-templatecache"),
	htmlify = require('gulp-angular-htmlify'),
	autoprefixer = require('gulp-autoprefixer'),
	minifyHTML = require('gulp-minify-html'),
	clean = require('gulp-clean'),
	growler = require('growler'),
	http = require('http'),
	express = require('express'),
	morgan = require('morgan'),
	order = require('gulp-order');

// Init Growler
var growl = new growler.GrowlApplication('Growl Notifications', {
	hostname: config.myLocalIP
});
growl.setNotifications({
	'Build Status': {}
});
growl.register();


// Important directories
var dirs = {
	prod:          'build/',
	dev:           'dev-build/',
	public_assets: 'assets/',
	fonts:         'assets/fonts/',
	vendor:        'app/vendor-bower/',
	app:           'app/',
	frontendApp:   'app/js/',
	styles:        'app/css/',
	tests:         'app/js/tests/'
};

var outputDir = dirs.prod;
var debug = false;

gulp.task('setDebugMode', function ()
{
	debug = true;
	outputDir = dirs.dev;
});

gulp.task('js-hint', function ()
{
	return gulp.src(dirs.frontendApp + '**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('appVendorScripts', function ()
{
	var vendorScripts = [
		dirs.vendor + 'jquery/dist/jquery.js',
		dirs.vendor + 'fastclick/lib/fastclick.js',
		dirs.vendor + 'modernizr/modernizr.js',
		dirs.vendor + 'angular/angular.js',
		dirs.vendor + 'bootstrap-sass-official/assets/javascripts/bootstrap/modal.js',
		dirs.vendor + 'bootstrap-sass-official/assets/javascripts/bootstrap/collapse.js',
		dirs.vendor + 'bootstrap-sass-official/assets/javascripts/bootstrap/dropdown.js',
		dirs.vendor + 'datetimepicker/jquery.datetimepicker.js',
		dirs.vendor + 'lodash/lodash.js',
		dirs.vendor + 'moment/moment.js',
		dirs.vendor + 'moment/locale/de.js',
		dirs.vendor + 'angular-ui-router/release/angular-ui-router.js',
		dirs.vendor + 'angular-sanitize/angular-sanitize.js',
		dirs.vendor + 'angular-animate/angular-animate.js',
		dirs.vendor + 'angular-uuid-service/angular-uuid-service.js',
		dirs.vendor + 'angular-messages/angular-messages.js',
		dirs.vendor + 'angular-socket-io/socket.js',
		dirs.vendor + 'angular-cookies/angular-cookies.js',
		dirs.vendor + 'faker/build/build/faker.js'
	];

	var runningTask = gulp.src(vendorScripts)
		.pipe(concat('appVendor.js'))
		.pipe(gif(!debug, uglify()))
		.pipe(gulp.dest(outputDir + dirs.public_assets))
		.pipe(filesize());

	growl.sendNotification('Build Status', {
		title: 'App Vendor Scripts',
		text:  'Done'
	});

	return runningTask;
});

gulp.task('appScripts', function ()
{
	var runningTask = gulp.src([dirs.frontendApp + '**/*.js', '!' + dirs.frontendApp + 'tests/**/*'])
		.pipe(order([
			'init.js',
			'**/*_module.js',
			'main.js'
		], {base: dirs.frontendApp}))
		.pipe(plumber(function (err)
		{
			console.log(err);
			growl.sendNotification('Build Status', {
				title: 'App Scripts Error',
				text:  err.toString()
			});
			this.emit('end');
		}))
		.pipe(concat('app.js'))
		.pipe(ngAnnotate(), {
			add:           true,
			single_quotes: true
		})
		.pipe(gif(!debug, uglify()))
		.pipe(gulp.dest(outputDir + dirs.public_assets))
		.pipe(filesize());

	growl.sendNotification('Build Status', {
		title: 'App Scripts',
		text:  'Done'
	});

	return runningTask;
});

gulp.task('templates', function ()
{
	var runningTask = gulp.src(dirs.frontendApp + '**/*.html')
		.pipe(htmlify())
		.pipe(minifyHTML({
			quotes: true
		}))
		.pipe(templateCache('templates.js', {
			standalone: true,
			module:     'templates',
			root:       '/templates/'
		}))
		.pipe(gulp.dest(outputDir + dirs.public_assets))
		.pipe(filesize());

	growl.sendNotification('Build Status', {
		title: 'Template compilation finished',
		text:  'Done'
	});

	return runningTask;
});

gulp.task('styles', function ()
{
	var runningTask = gulp.src(dirs.styles + 'main.scss')
		.pipe(plumber({
			errorHandler: function (err)
			{
				console.log(err);
				growl.sendNotification('Build Status', {
					title: 'Style Error',
					text:  err.toString()
				});
			}
		}))
		.pipe(sass({includePaths: [dirs.vendor], errLogToConsole: true}))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade:  false
		}))
		.pipe(gif(!debug, minifycss()))
		.pipe(gulp.dest(outputDir + dirs.public_assets))
		.pipe(filesize())
		.pipe(plumber.stop());

	growl.sendNotification('Build Status', {
		title: 'Styles',
		text:  'Done'
	});

	return runningTask;
});

gulp.task('copyAssets', function ()
{
	gulp.src(dirs.vendor + 'fontawesome/fonts/*')
		.pipe(gulp.dest(outputDir + dirs.fonts));

	gulp.src(dirs.app + 'images/**/*')
		.pipe(gulp.dest(outputDir + dirs.public_assets + 'images/'));
});

gulp.task('copyRootFiles', function ()
{
	gulp.src([dirs.app + '*.html', dirs.app + '*.json'])
		.pipe(gulp.dest(outputDir));
});

gulp.task('server', function() {
	var server = express();

	// log all requests to the console
	server.use(morgan('dev'));
	server.use(express.static(outputDir));

	// Serve index.html for all routes to leave routing up to Angular
	server.all('/*', function(req, res) {
		res.sendFile('index.html', { root: outputDir });
	});

	// Start webserver if not already running
	var s = http.createServer(server);
	s.on('error', function(err) {
		if (err.code === 'EADDRINUSE'){
			console.log('Development server is already started at port ' + config.serverport);
		} else {
			throw err;
		}
	});

	s.listen(config.serverport);
});

gulp.task('serve', [
	'setDebugMode',
	'styles',
	'js-hint',
	'appVendorScripts',
	'appScripts',
	'templates',
	'copyAssets',
	'copyRootFiles',
	'watch'
], function () {

	var server = express();

	// log all requests to the console
	server.use(morgan('dev'));
	server.use(express.static(outputDir));

	// Serve index.html for all routes to leave routing up to Angular
	server.all('/*', function(req, res) {
		res.sendFile('index.html', { root: outputDir });
	});

	// Start webserver if not already running
	var s = http.createServer(server);
	s.on('error', function(err) {
		if (err.code === 'EADDRINUSE'){
			console.log('Development server is already started at port ' + config.serverport);
		} else {
			throw err;
		}
	});

	s.listen(config.serverport);
});

gulp.task('build', [
	'styles',
	'js-hint',
	'appVendorScripts',
	'appScripts',
	'templates',
	'copyAssets',
	'copyRootFiles'
], function () {});

gulp.task('watch', function ()
{
	gulp.watch(dirs.frontendApp + '**/*.js', {interval: 500}, ['js-hint', 'appScripts']);
	gulp.watch(dirs.vendor + '**/*.js', {interval: 2000}, ['appVendorScripts']);
	gulp.watch(dirs.frontendApp + '**/*.html', {interval: 500}, ['templates']);
	gulp.watch(dirs.styles + '*.scss', {interval: 500}, ['styles']);
	gulp.watch(dirs.styles + '*.css', {interval: 500}, ['styles']);
	gulp.watch(dirs.app + '*', {interval: 500}, ['copyRootFiles']);
});

