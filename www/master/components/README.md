Manifest File Format
======

Every component has a JSON-formatted manifest file, named ```manifest.json```,
that provides important information.

###Field summary
*The following code shows the supported manifest fields for Components, with
links to the page that discusses each field.*

```
{
      // Required
        "manifest_version": 1,
          "name": "My Component",
            "version": "versionString",

              // Recommended
                "default_locale": "en",
                  "description": "A plain text description",
                    "icons": {...},
}
```

Content available under the [CC-By 3.0
license](http://creativecommons.org/licenses/by/3.0/)
