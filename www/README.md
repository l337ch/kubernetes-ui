### Install Dependencies

We have two kinds of dependencies in this project: tools and angular framework code.  The tools help
us manage and test the application.

* We get the tools we depend upon via `npm`, the [node package manager](https://www.npmjs.com/).
* We get the angular code via `bower`, a [client-side code package manager](http://bower.io/).

We have preconfigured `npm` to automatically run `bower` so we can simply do (in `www/master`):

```
npm install
```

Behind the scenes this will also call `bower install`.  You should find that you have two new
folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `app/bower_components` - contains the angular framework files

*Note that the `bower_components` folder would normally be installed in the root folder but
kraken changes this location through the `.bowerrc` file.  Putting it in the app folder makes
it easier to serve the files by a webserver.*



`npm` is configured to automatically run `bower install` and `gulp`. From the `www/master` directory, simply run:

```
npm start
```

The `gulp` command will start a file watcher which will update the generated `app` code after any changes are saved. Note: gulp file watcher does not currently support adding or deleting files, this will require a restart of gulp). Two new directories will also be created in the project.

* `master/node_modules` - contains npm dependencies
* `master/bower_components` - contains the angular framework files

Bower components should be refernced in one of the `vendor.json` files below:

* `master/vendor.base.json` - 3rd party vendor javascript required to start the app. JS is compiled to `base.js` and loaded before `app.js`
* `master/vendor.json` - 3rd party vendor scripts to make the app work, usually lazy loaded. Can be js or css. Copied to `vendor/*`.

*Note that the `bower_components` directory would normally be created in the project root. This has been changed in the `.bowerrc` file. Putting it in the app directory makes it easier to serve files from a web server.*

### Serving the App during Development

The app can be served through `kubectl`, but for some types of review a local web server is convenient. One can be installed as follows:

```
sudo npm install -g http-server
```

The server can then be launched:

```
cd app
http-server -a localhost -p 8000
```

### Building a New Visualizer or Component 

A custom visualizer can be created by adding files in the structure below
* Angular js files can be placed in `master/components/<visualizer name>/js`. All js files will be minified and concatenated into `app/assets/app.js`
* CSS, images, and html files can be placed in `master/components/<component name>`. All files (except .js) will be copied to `app/components/<component name>` in the same folder structure. The directory will be regenerated on each new gulp build. An example directory structure for a _graph-visualizer_ is below:
```
graph-visualizer
├── css
├── img
├── js
│   └── modules
│       ├── controllers
│       ├── directives
│       └── services
├── pages
└── views
    └── partials
```
