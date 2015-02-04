`npm` is configured to automatically run `bower install`. From the `www` directory, simply run:

```
npm install
```

That will create two new directories in the project.

* `node_modules` - contains npm dependencies
* `app/bower_components` - contains the angular framework files

*Note that the `bower_components` directory would normally be created in the project root. This has been changed in the `.bowerrc` file. Putting it in the app directory makes it easier to serve files from a web server.*

Update the tool dependencies by running:

```
npm update
```

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

