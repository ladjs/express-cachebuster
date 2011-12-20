
# Express Cachebuster

`express-cachebuster` provides cross-browser version-control/cache-busting as a dynamic helper to your views.

      app.dynamicHelpers({ cacheBuster: require('express-cachebuster') });

This was made as an integrated feature of [Expressling][1].
[1]: http://expressling.com

# Quick install

      $ npm install express-cachebuster

# Usage

In your views simply include the dynamic helper and pass your asset's path.

For more options see <a href="#goodies">Goodies</a>.

**Note:** `$` = variable which is automagically returned by `express-cachebuster`.

## EJS

      <%- cacheBuster('/js/mylibs/script.js') %>

Outputs HTML as shown below for development environment:

      <script type='text/javascript' src='/js/mylibs/script.js?v=$currentTimestamp'></script>

...and for production environment:

      <script type='text/javascript' src='/js/mylibs/script.js?v=$lastModifiedTimestamp'></script>

## Jade

      != cacheBuster('/stylesheets/style.css')

Outputs HTML as shown below for development environment:

      <link rel='stylesheet' href='/stylesheets/style.css?v=$currentTimestamp'>

...and for production environment:

      <link rel='stylesheet' href='/stylesheets/style.css?v=$lastModifiedTimestamp'>

# <a href="#goodies" name="goodies">Goodies</a>

### You can pass an array of assets to the middleware:

**EJS:** `<%- cacheBuster(['/stylesheets/style.css', '/stylesheets/ie.css']) %>`

**Jade:** `!= cacheBuster(['/stylesheets/style.css', '/stylesheets/ie.css'])`

Outputs HTML as shown below for development environment:

      <link rel='stylesheet' href='/public/css/style.css?v=$currentTimestamp'>
      <link rel='stylesheet' href='/public/css/ie.css?v=$currentTimestamp'>

.. and for production environment:

      <link rel='stylesheet' href='/public/css/style.css?v=$lastModifiedTimestamp'>
      <link rel='stylesheet' href='/public/css/ie.css?v=$lastModifiedTimestamp'>


### You can override the default "public" folder:

**EJS:** `<%- cacheBuster('/stylesheets/style.css', 'www') %>`

**Jade:** `!= cacheBuster('/stylesheets/style.css', 'www')`

... which looks inside `/home/username/project/www` for `/stylesheets/style.css`.

# License

MIT Licensed
