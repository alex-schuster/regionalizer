# Regionalizer

Regionalizer is a JavaScript library for dynamic re-rendering of defined regions. It uses Mozilla's [nunjucks](https://mozilla.github.io/nunjucks/) templating engine and enables you to share your template files between frontend and backend. This is convenient if you want your backend to serve a fully crawlable document which then is turned into a web app that only renders the dynamic parts of your views. Many frontend frameworks would require Node.js to deliver a pre-rendered page. With Regionalizer, you can read your view definitions from a JSON file using the backend technology of your choice and initially deliver the complete markup if you wish to do so. The frontend will then render the necessary parts of your views if the user navigates to another route.

## Define your views

You can define **layouts**, **views** and **regions**. The latter can be seen as the building blocks of your views. The `name` property of layouts and views determine the file name. For instance, the directory where you store your templates is called `templates`, which makes Regionalizer search for layouts inside `templates/layouts` and regions inside `templates/regions`. The `default` layout would then be called `templates/layouts/default.html` and the `content` region would be `templates/regions/content.html`. Your `definitions.json` file could look like this:

```
{
  "layouts": [
    {
      "name": "default",
      "regions": [
        "navigation",
        "content",
        "footer"
      ]
    },
    {
      "name": "anotherLayout",
      "regions": [
        "navigation",
        "content",
        "anotherRegion",
        "footer"
      ]
    }
  ],
  "views": [
    {
      "name": "index",
      "route": "/",
      "layout": "default"
    },
    {
      "name": "about",
      "route": "/about",
      "layout": "default"
    },
    {
      "name": "resourceItem",
      "route": "/resources/([0-9]+)",
      "layout": "anotherLayout"
    }
  ],
  "regions": [
    {
      "name": "navigation",
      "domElement": "header",
      "isPersistent": true
    },
    {
      "name": "content",
      "domElement": "#foo"
    },
    {
      "name": "anotherRegion",
      "domElement": "#bar"
    },
    {
      "name": "footer",
      "domElement": "footer",
      "isPersistent": true
    }
  ]
}
```
You also have to compile your templates via `nunjucks-precompile path/to/templates > templates.js` and include the generated `templates.js` file. Finally, you can import the Regionalizer library and call the `init` function. You have to pass the above JavaScript object as an argument.
