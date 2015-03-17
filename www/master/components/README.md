Components
==========

A tab in the Kubernetes UI with its set of visualizations is referred to as a *component*. Components are separated from the UI chrome and base data providers to simplify the development of new visualizations. This document provides reference for creation and modification of components.

Each component has its own directory, manifest file, HTML views, Angular providers, CSS and LESS.

###Manifest file

The JSON-formatted manifest file, named ```manifest.json```, is located at the root of a component. Based on the component directory name and the contents of the manifest, the Kubernetes UI automatically adds a tab to the chrome, a dependency on the component's AngularJS module to main AngularJS app and Angular routes for the component.

For example, consider a manifest file at ```www/master/components/foo_component/manifest.json```:
```
{
  "routes": [
    {
      "url": "/",
      "templateUrl": "/components/foo_component/pages/home.html"
    },
    {
      "url": "/kittens",
      "templateUrl": "/components/foo_component/pages/kittens.html",
      "css": "/components/foo_component/css/kittens.css"
    }
  ]
}
```

From the name of the component directory, the Kubernetes UI
* creates a tab called "Foo Component",
* adds Angular module ```kubernetesApp.components.fooComponent``` to the dependencies of ```kubernetesApp```, and
* defines Angular routes ```/foo_component/``` and ```/foo_component/kittens```.

####Manifest schema

```
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "description": {
      "type": "string",
      "description": "Very brief summary of the component. Use a README.md file for detailed descriptions."
    },
    "routes": {
      "type": "array",
      "description": "Angular routes for the component.",
      "items": {
        "type": "object",
        "properties": {
          "description": {
            "type": "string",
            "description": "Short description of the route."
          },
          "url": {
            "type": "string",
            "description": "Route location relative to '/<component>'."
          },
          "templateUrl": {
            "type": "string",
            "description": "Absolute location of the HTML template."
          },
          "css": {
            "type": "string",
            "description": "Absolute location of CSS to use with this route."
          }
        },
        "required": ["url", "templateUrl"]
      },
      "minItems": 1
    }
  },
  "required": ["routes"]
}
```

Content available under the [CC-By 3.0
license](http://creativecommons.org/licenses/by/3.0/)
