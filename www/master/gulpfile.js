var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    // jade        = require('gulp-jade'),
    less        = require('gulp-less'),
    path        = require('path'),
    livereload  = require('gulp-livereload'), // Livereload plugin needed: https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
    // marked      = require('marked'), // For :markdown filter in jade
    path        = require('path'),
    changed     = require('gulp-changed'),
    prettify    = require('gulp-html-prettify'),
    w3cjs       = require('gulp-w3cjs'),
    rename      = require('gulp-rename'),
    // flip        = require('css-flip'),
    through     = require('through2'),
    gutil       = require('gulp-util'),
    htmlify     = require('gulp-angular-htmlify'),
    minifyCSS   = require('gulp-minify-css'),
    gulpFilter  = require('gulp-filter'),
    expect      = require('gulp-expect-file'),
    gulpsync    = require('gulp-sync')(gulp),
    ngAnnotate  = require('gulp-ng-annotate'),
    sourcemaps  = require('gulp-sourcemaps'),
    del         = require('del'),
    ngConstant  = require('gulp-ng-constant'),
    argv        = require('yargs').argv,
    foreach     = require('gulp-foreach'),
    gcallback   = require('gulp-callback'),
    PluginError = gutil.PluginError;

// LiveReload port. Change it only if there's a conflict
var lvr_port = 35729;

var W3C_OPTIONS = {
  // Set here your local validator if your using one. leave it empty if not
  //uri: 'http://validator/check',
  doctype: 'HTML5',
  output: 'json',
  // Remove some messages that angular will always display.
  filter: function(message) {
    if( /Element head is missing a required instance of child element title/.test(message) )
      return false;
    if( /Attribute .+ not allowed on element .+ at this point/.test(message) )
      return false;
    if( /Element .+ not allowed as child of element .+ in this context/.test(message) )
      return false;
    if(/Comments seen before doctype./.test(message))
      return false;
  }
};

// production mode (see build task)
var isProduction = false;
var useSourceMaps = false;

// ignore everything that begins with underscore
var hidden_files = '**/_*.*';
var ignored_files = '!'+hidden_files;

var component_hidden_files = '**/js/**/*.*';
var component_ignored_files = '!'+component_hidden_files;

// VENDOR CONFIG
var vendor = {
  // vendor scripts required to start the app
  base: {
    source: require('./vendor.base.json'),
    dest: '../app/assets/js',
    name: 'base.js'
  },
  // vendor scripts to make to app work. Usually via lazy loading
  app: {
    source: require('./vendor.json'),
    dest: '../app/vendor'
  }
};

// SOURCES CONFIG
var source = {
  scripts: {
    app:    [ 'js/app.init.js',
              'js/modules/*.js',
              'js/tabs.js',
              'js/config/generated-config.js',
              'js/modules/controllers/*.js',
              'js/modules/directives/*.js',
              'js/modules/services/*.js',
              'js/modules/filters/*.js',
              'components/*/js/**/*.js'
            ],
    watch: ['js/**/*.js', 'components/*/js/**/*.js']
  },
  // templates: {
  //   app: {
  //       files : ['jade/index.jade'],
  //       watch: ['jade/index.jade', hidden_files]
  //   },
  //   views: {
  //       files : ['jade/views/*.jade', 'jade/views/**/*.jade', ignored_files],
  //       watch: ['jade/views/**/*.jade']
  //   },
  //   pages: {
  //       files : ['jade/pages/*.jade'],
  //       watch: ['jade/pages/*.jade']
  //   }
  // },

  styles: {
    app: {
      // , 'components/*/less/*.less'
      main: ['less/app.less'],
      dir:  'less',
      watch: ['less/*.less', 'less/**/*.less', 'components/**/less/*.less']

    }
  },

  components: {
    source: ['components/**/*.*', component_ignored_files, '!components/**/config/*.*', '!master/js/modules/config.js', '!components/*/less/*.*'],
    dest:  'components',
    watch: ['components/**/*.*', component_ignored_files, '!components/**/config/*.*', '!master/js/modules/config.js', '!components/**/less/*.*']
  },

  config: {
    watch: ['js/config/development.json', 'js/config/production.json', 'js/config/development.json', 'js/config/production.json'],
    dest: 'js/config'
  }

  //,
  // bootstrap: {
  //   main: 'less/bootstrap/bootstrap.less',
  //   dir:  'less/bootstrap',
  //   watch: ['less/bootstrap/*.less']
  // }
};

// BUILD TARGET CONFIG
var build = {
  scripts: {
    app: {
      main: 'app.js',
      dir: '../app/assets/js'
    }
  },
  styles: '../app/assets/css',
  components: {
    dir: '../app/components'
  }
};

function stringSrc(filename, string) {
  var src = require('stream').Readable({ objectMode: true });
  src._read = function () {
    this.push(new gutil.File({ cwd: "", base: "", path: filename, contents: new Buffer(string) }));
    this.push(null);
  }
  return src;
}

//---------------
// TASKS
//---------------

gulp.task('bundle-manifest', function(){
  var components = [];
  var stream = gulp.src('./components/*/manifest.json')
  .pipe(foreach(function(stream, file) {
                var manifestFile = require(file.path);
                components.push(manifestFile.name);
                return stream
                })).pipe(gcallback(function() {
    stringSrc("tabs.js", 'app.value("tabs", ["' + components.join('","') + '"]);')
    .pipe(gulp.dest("js"))
  }));
});

// JS APP
gulp.task('scripts:app', ['bundle-manifest', 'config', 'scripts:app:base']);

// JS APP BUILD
gulp.task('scripts:app:base', function() {
    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src(source.scripts.app)
        .pipe( useSourceMaps ? sourcemaps.init() : gutil.noop())
        .pipe(concat(build.scripts.app.main))
        .pipe(ngAnnotate())
        .on("error", handleError)
        .pipe( isProduction ? uglify({preserveComments:'some'}) : gutil.noop() )
        .on("error", handleError)
        .pipe( useSourceMaps ? sourcemaps.write() : gutil.noop() )
        .pipe(gulp.dest(build.scripts.app.dir));
});


// VENDOR BUILD
gulp.task('scripts:vendor', ['scripts:vendor:base', 'scripts:vendor:app']);

//  This will be included vendor files statically
gulp.task('scripts:vendor:base', function() {

    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src(vendor.base.source)
        .pipe(expect(vendor.base.source))
        .pipe(uglify())
        .pipe(concat(vendor.base.name))
        .pipe(gulp.dest(vendor.base.dest))
        ;
});

// copy file from bower folder into the app vendor folder
gulp.task('scripts:vendor:app', function() {

  var jsFilter = gulpFilter('**/*.js');
  var cssFilter = gulpFilter('**/*.css');

  return gulp.src(vendor.app.source, {base: 'bower_components'})
      .pipe(expect(vendor.app.source))
      .pipe(jsFilter)
      .pipe(uglify())
      .pipe(jsFilter.restore())
      .pipe(cssFilter)
      .pipe(minifyCSS())
      .pipe(cssFilter.restore())
      .pipe( gulp.dest(vendor.app.dest) );

});

// APP LESS
gulp.task('styles:app', function() {
    return gulp.src(source.styles.app.main)
        .pipe( useSourceMaps ? sourcemaps.init() : gutil.noop())
        .pipe(less({
            paths: [source.styles.app.dir]
        }))
        .on("error", handleError)
        .pipe( isProduction ? minifyCSS() : gutil.noop() )
        .pipe( useSourceMaps ? sourcemaps.write() : gutil.noop())
        .pipe(gulp.dest(build.styles));
});

// // APP RTL
// gulp.task('styles:app:rtl', function() {
//     return gulp.src(source.styles.app.main)
//         .pipe( useSourceMaps ? sourcemaps.init() : gutil.noop())
//         .pipe(less({
//             paths: [source.styles.app.dir]
//         }))
//         .on("error", handleError)
//         .pipe(flipcss())
//         .pipe( isProduction ? minifyCSS() : gutil.noop() )
//         .pipe( useSourceMaps ? sourcemaps.write() : gutil.noop())
//         .pipe(rename(function(path) {
//             path.basename += "-rtl";
//             return path;
//         }))
//         .pipe(gulp.dest(build.styles));
// });


// Environment based configuration
// https://github.com/kraken-people/kubernetes-kraken/issues/21

gulp.task('config', ['config:base', 'config:copy']);

gulp.task('config:base', function () {
  return stringSrc('generated-config.js', 'angular.module("krakenApp.config", [])' + '\n' + '.constant("ENV", {})')
    .pipe(gulp.dest(source.config.dest));
});

gulp.task('config:copy', function () {
  var enviroment = argv.env || 'development'; // change this to whatever default environment you need.

  return gulp.src(['js/config/' + enviroment + '.json', 'components/**/config/' + enviroment + '.json'])
    .pipe(concat('generated-config.js'))
    .pipe(ngConstant({
      name: 'krakenApp.config',
      deps: [],
      constants: { ngConstant: true }
    }))
    .pipe(gulp.dest(source.config.dest));
});



gulp.task('copy:components', function() {

  var jsFilter = gulpFilter('**/*.js');
  var cssFilter = gulpFilter('**/*.css');

  del.sync([build.components.dir], {force: true});

    return gulp.src(source.components.source, {base: 'components'})
      .pipe(expect(source.components.source))
      .pipe(jsFilter)
      .pipe(uglify())
      .pipe(jsFilter.restore())
      .pipe(cssFilter)
      .pipe(minifyCSS())
      .pipe(cssFilter.restore())
      .pipe( gulp.dest(build.components.dir) );
});

// // BOOSTRAP
// gulp.task('bootstrap', function() {
//     return gulp.src(source.bootstrap.main)
//         .pipe(less({
//             paths: [source.bootstrap.dir]
//         }))
//         .on("error", handleError)
//         .pipe(gulp.dest(build.styles));
// });

// JADE
// gulp.task('templates:app', function() {
//     return gulp.src(source.templates.app.files)
//         .pipe(changed(build.templates.app, { extension: '.html' }))
//         .pipe(jade())
//         .on("error", handleError)
//         .pipe(prettify({
//             indent_char: ' ',
//             indent_size: 3,
//             unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u']
//         }))
//         // .pipe(htmlify({
//         //     customPrefixes: ['ui-']
//         // }))
//         // .pipe(w3cjs( W3C_OPTIONS ))
//         .pipe(gulp.dest(build.templates.app))
//         ;
// });

// // JADE
// gulp.task('templates:pages', function() {
//     return gulp.src(source.templates.pages.files)
//         .pipe(changed(build.templates.pages, { extension: '.html' }))
//         .pipe(jade())
//         .on("error", handleError)
//         .pipe(prettify({
//             indent_char: ' ',
//             indent_size: 3,
//             unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u']
//         }))
//         // .pipe(htmlify({
//         //     customPrefixes: ['ui-']
//         // }))
//         // .pipe(w3cjs( W3C_OPTIONS ))
//         .pipe(gulp.dest(build.templates.pages))
//         ;
// });

// // JADE
// gulp.task('templates:views', function() {
//     return gulp.src(source.templates.views.files)
//         .pipe(changed(build.templates.views, { extension: '.html' }))
//         .pipe(jade())
//         .on("error", handleError)
//         .pipe(prettify({
//             indent_char: ' ',
//             indent_size: 3,
//             unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u']
//         }))
//         // .pipe(htmlify({
//         //     customPrefixes: ['ui-']
//         // }))
//         // .pipe(w3cjs( W3C_OPTIONS ))
//         .pipe(gulp.dest(build.templates.views))
//         ;
// });

//---------------
// WATCH
//---------------

// Rerun the task when a file changes
gulp.task('watch', function() {
  livereload.listen();

  gulp.watch(source.scripts.watch,           ['scripts:app']);
  gulp.watch(source.styles.app.watch,        ['styles:app']);
  gulp.watch(source.components.watch,     ['copy:components']);
  // gulp.watch(source.templates.pages.watch,   ['templates:pages']);
  // gulp.watch(source.templates.views.watch,   ['templates:views']);
  // gulp.watch(source.templates.app.watch,     ['templates:app']);

  gulp.watch([

      '../app/**'

  ]).on('change', function(event) {

      livereload.changed( event.path );

  });

});


//---------------
// DEFAULT TASK
//---------------


// build for production (minify)
gulp.task('build', ['prod', 'default']);
gulp.task('prod', function() { isProduction = true; });

// build with sourcemaps (no minify)
gulp.task('sourcemaps', ['usesources', 'default']);
gulp.task('usesources', function(){ useSourceMaps = true; });

// default (no minify)
gulp.task('default', gulpsync.sync([
          'scripts:vendor',
          'copy:components',
          'scripts:app',
          'start'
        ]), function(){

  gutil.log(gutil.colors.cyan('************'));
  gutil.log(gutil.colors.cyan('* All Done *'), 'You can start editing your code, LiveReload will update your browser after any change..');
  gutil.log(gutil.colors.cyan('************'));

});

gulp.task('start',[
          'styles:app',
          'copy:components',
          // 'templates:app',
          // 'templates:pages',
          // 'templates:views',
          'watch'
        ]);

gulp.task('done', function(){
  console.log('All Done!! You can start editing your code, LiveReload will update your browser after any change..');
});

// Error handler
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

// // Mini gulp plugin to flip css (rtl)
// function flipcss(opt) {

//   if (!opt) opt = {};

//   // creating a stream through which each file will pass
//   var stream = through.obj(function(file, enc, cb) {
//     if(file.isNull()) return cb(null, file);

//     if(file.isStream()) {
//         console.log("todo: isStream!");
//     }

//     var flippedCss = flip(String(file.contents), opt);
//     file.contents = new Buffer(flippedCss);
//     cb(null, file);
//   });

//   // returning the file stream
//   return stream;
// }
