### Install Dependencies

We have two kinds of dependencies in this project: tools and angular framework code.  The tools help
us manage and test the application.

* We get the tools we depend upon via `npm`, the [node package manager](https://www.npmjs.com/).
* We get the angular code via `bower`, a [client-side code package manager](http://bower.io/).

`npm` is configured to automatically run `bower install` and `gulp`. From the `www/master` directory, simply run:

```
npm start
```

The `gulp` command will start a file watcher which will update the generated `app` code after any changes are saved. Note: gulp file watcher does not currently support adding or deleting files, this will require a restart of gulp). Two new directories will also be created in the project.

* `master/node_modules` - contains npm dependencies
* `master/bower_components` - contains the angular framework files and any custom dependencies

Bower components should be refernced in one of the `vendor.json` files below:

* `master/vendor.base.json` - 3rd party vendor javascript required to start the app. JS is compiled to `base.js` and loaded before `app.js`
* `master/vendor.json` - 3rd party vendor scripts to make the app work, usually lazy loaded. Can be js or css. Copied to `vendor/*`.

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

### Configuration
#### Configuration Settings
A json file can be used by `gulp` to automatically create angular constants. This is useful for setting per environment variables such as api endpoints.
*  ```www/master/js/config/development.json``` or ```www/master/js/config/production.json``` can be created from the ```www/master/js/config/development.example.json``` file.
* ```development.example.json``` should be kept up to date with default values, since ```development.json``` is not under source control.
* Component configuration can be added to ```www/master/components/<component name>/config/development.json``` and it will be combined with the main app config files and compiled into the intermediary ```www/master/js/config/generated-config.js``` file.
* All ```generated-config.js``` is compiled into ```app.js```
* Production config can be generated using ```gulp config --env production``` or ```gulp --env production```

#### Kubernetes Server Configuration

**RECOMMENDED**: By default the k8s api server does not support CORS,
  so the `kube-apiserver.service` must be started with
  `--cors_allowed_origins=.*` or `--cors_allowed_origins=http://<your
  host here>`

**HACKS**: If you don't want to/cannot restart the k8s api server:
* You can set up [a node proxy](https://github.com/bcbroussard/kraken-proxy) for the k8s api server which adds
 ```Access-Control-Allow-Origin: *``` for you.
* Or you can start your browser with web security disabled. For
  Chrome, you can [launch](http://www.chromium.org/developers/how-tos/run-chromium-with-flags) it with flag ```--disable-web-security```.

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