
# Express Cachebuster

`express-cachebuster` provides cross-browser version-control/cache-busting as a dynamic view helper in `express`.

This was made as an integrated feature of [Expressling][1].
[1]: http://expressling.com


# Quick install

      $ npm install express-cachebuster

# Usage

Add the following to your `express` app, e.g., `server.js`:

      app.configure(function() {
        app.set('public', __dirname + '/public');
      });

      app.dynamicHelpers({
        cacheBuster: require('express-cachebuster');
      });


In your views execute the `cacheBuster` function and pass your asset's path.

For more options see <a href="#goodies">Goodies</a>.

**Note:** `$` = variable which is automagically returned by `express-cachebuster`.

## EJS

      <%- cacheBuster('/js/mylibs/script.js') %>

Outputs HTML as shown below for development environment:

      <script src='/js/mylibs/script.js?v=$currentTimestamp' type='text/javascript'></script>

&hellip; and for production environment:

      <script src='/js/mylibs/script.js' type='text/javascript'></script>

## Jade

      != cacheBuster('/stylesheets/style.css')

Outputs HTML as shown below for development environment:

      <link href='/stylesheets/style.css?v=$currentTimestamp' rel='stylesheet'>

&hellip; and for production environment:

      <link href='/stylesheets/style.css' rel='stylesheet'>

# <a href="#goodies" name="goodies">Goodies</a>

### You can pass an array of assets to the middleware:

**EJS:** `<%- cacheBuster(['/stylesheets/style.css', '/stylesheets/ie.css']) %>`

**Jade:** `!= cacheBuster(['/stylesheets/style.css', '/stylesheets/ie.css'])`

Outputs HTML as shown below for development environment:

      <link href='/stylesheets/style.css?v=$currentTimestamp' rel='stylesheet'>
      <link href='/stylesheets/ie.css?v=$currentTimestamp' rel='stylesheet'>

&hellip; and for production environment:

      <link href='/stylesheets/style.css' rel='stylesheet'>
      <link href='/stylesheets/ie.css' rel='stylesheet'>

### You can pass an object as the second parameter representing attributes and their values to add to the generated tag:

      cacheBuster('/scripts/require.js', {'data-message': 'Hello world', 'data-main': '/app/main.js'})

which outputs the following HTML:

      <script data-main='/app/main.js' data-message='Hello world' src='/scripts/require.js' type='text/javascript'></script>

# Contributors

David Murdoch - <hello@vervestudios.co> - [@davidmurdoch](https://github.com/davidmurdoch)
Butu - <butu25@gmail.com> - [@butu5](https://github.com/butu5)

# License

MIT Licensed
