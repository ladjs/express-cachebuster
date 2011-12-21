
var express = require('express')
  , app = express.createServer()
  , stylus = require('stylus');

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('warn', true)
    .set('firebug', false)
    .set('linenos', true);
}

app.configure(function(){
  app.set('public', __dirname + '/public');
  app.set('view engine','jade');
  app.set('view options',{layout: false});
  console.log(__dirname);
  app.use(stylus.middleware({
      src: __dirname
    , dest: __dirname + '/public'
    , compile: compile
  }));
  app.use(express.static(__dirname + '/public'));
});

app.dynamicHelpers({
  cacheBuster: require('../index')
});

app.get('/',function(req,res){
  res.render(__dirname + '/public/index',{title: 'hello world'});
});

app.listen(3000);
