Components
==========

A tab in the Kubernetes UI with its set of visualizations is referred to as a *component*. Components are separated from the UI chrome and base data providers to simplify the development of new visualizations. This document provides reference for creation and modification of components.

Each component has its own directory, manifest file, HTML views, Angular providers, CSS and LESS.

###Manifest file

The JSON-formatted manifested file, named ```manifest.json```, is located at the root of a component and provides the core information about it.

*The following code shows the supported manifest fields for Components, with
links to the page that discusses each field.*

```
{
  "manifest_version": 1,
  "name": "Graph",
  "version": "1",
  "namespace": "Graph",
  "default_locale": "en",
  "description": "Force Directed Graph",
  "icons": {},
  "sections": [
    {
      "name": "Graph",
      "url": "/graph",
      "type": "link",
      "templateUrl": "/components/graph/pages/home.html"
    },
    {
      "name": "Graph",
      "url": "/graph/inspect",
      "type": "link",
      "templateUrl": "/components/graph/pages/inspect.html",
      "css": "/components/graph/css/show-details-table.css"
    },
    {
      "name": "Graph",
      "type": "heading",
      "children": [
        {
          "name": "Graph",
          "type": "toggle",
          "url": "/graph",
          "templateUrl": "/components/graph/pages/home.html",
          "pages": [
            {
              "name": "Test",
              "url": "/graph/test",
              "type": "link",
              "templateUrl": "/components/graph/pages/home.html"
            }
          ]
        }
      ]
    }
  ]
}
```

####Field reference
#####manifest_version
Required. String. Monotonically increasing.
#####name
Required. String. Name to be displayed on the tab.
#####version
Required. Version string.
#####default_locale
String. Default locale for the component.
#####description
String. A plain-text description of the component.
#####icons
Object. No clue?! Remove?!

Content available under the [CC-By 3.0
license](http://creativecommons.org/licenses/by/3.0/)
