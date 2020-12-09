# regionalizer

![GitHub](https://img.shields.io/github/license/alex-schuster/regionalizer)
![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/alex-schuster/regionalizer?include_prereleases)
![npm bundle size](https://img.shields.io/bundlephobia/min/regionalizer?logo=npm)
![npm](https://img.shields.io/npm/dw/regionalizer?logo=npm)

*regionalizer* is a JavaScript library for dynamic re-rendering of defined regions. It uses Mozilla's [nunjucks](https://mozilla.github.io/nunjucks/) templating engine and enables you to share your template files between frontend and backend. This is convenient if you want your backend to serve a fully crawlable document which then is turned into a web app that only renders the dynamic parts of your views. Many frontend frameworks would require Node.js to deliver a pre-rendered page. With regionalizer, you can read your view definitions from a JSON file using the backend technology of your choice and initially deliver the complete markup. The frontend will then render the necessary parts of your views if the user navigates to another route.

## Installation

You can install regionalizer via npm by running `npm i regionalizer`.

## Example

You can define **layouts**, **views** and **regions**. The latter can be seen as the building blocks of your views while layouts are considered their construction plans. The following example should clarify their interplay.

### Layouts

Inside your definitions object (which is ideally available to your backend as a JSON file), the property `layouts` is responsible for providing information about the structure of each separate layout. It could look as follows:

```json
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
  ]
}
```

The `name` property must be a valid file name (without extension) and should furthermore be unique. In this example, you would create two template files inside your `templates/layouts` directory which are called `default.html` and `anotherLayout.html`. These contain the markup of the respective layout and could look like this:

```html
{{ navigation | safe }}
<div>
  {{ content | safe }}
  <div>Some static content</div>
  {{ footer | safe }}
</div>
```

You can place your regions where you would like them to appear using the provided variables, which are named after the region. [Here](https://mozilla.github.io/nunjucks/), you can find more information about the templating engine used to render these files. Remember to add the `safe` filter as the variables will already contain placeholder markup.

### Views

A view can be defined inside the already mentioned definitions object as follows:

```json
{
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
  ]
}
```

Just add the property `views` to your definitions and specify a `name`. The `route` is a regular expression. The first one matching the requested path will be selected. Put the `name` of the layout you want to be used to render the view inside the `layout` property. 

### Regions

Regions are defined inside the `regions` property of the definitions object. They are given a unique `name` (which is used to reference a region inside a layout definition) and a `domElement` (an identifier which makes it possible to find the region in the DOM). Note that this string is used as an argument for JavaScript's `querySelector` function.

If a region is rather considered a singleton and sould not be rendered for each view, you can set `isPersistent` to `true`. However, this does not mean that the region has to be present in every layout. When needed, it will be inserted just as it was before it was removed from the DOM by regionalizer.

```json
{
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

The corresponding template file `templates/regions/content.html` for the content region could then look as folows:

```html
<main id="foo">
  <h1>{{ fooVariable }}</h1>
  <p>{{ barVariable }}</p>
</main>
```

Note that the `id` attribute of the wrapper element is set according to the definition. Inside the templates, you can use your own variables that you pass regionalizer when you trigger the rendering process. This is shown in the next section.

### API usage

In order to use regionalizer, you have to import the library. You also have to compile your templates via `nunjucks-precompile path/to/templates > templates.js` and include the generated `templates.js` file (or whatever name you choose for it). Furthermore, make the definitions object available. If you are using webpack, you can achieve this by adding `require('./templates')` and `const definitions = require('./path/to/definitions.json')` to your script.

```javascript
// Import the library.
import regionalizer from 'regionalizer';

// Import the definitions object. As mentioned, you could use webpack to require a JSON file.
const definitions = {
  // Definitions object here.
};

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the library.
  const myRegionalizer = regionalizer(definitions);
  myRegionalizer.init(definitions);

  // Detect the event which is fired whenever the user navigates to another view.
  window.addEventListener('regionalizer.inAppNavigation', (event) => {
    // Provide custom data to be used inside the templates (custom variables).
    // This can be more complex in real life, for example if the data has to be fetched from an API.
    const myData = { fooVariable: 'foo value', barVariable: 'bar value' };
    // Change the view like this.
    myRegionalizer.changeView(event.detail.path, myData).then(() => {
      // Do something after the new view has been displayed.
      console.log('View loaded');
    });
  });
});
```
