var express = require('express')

var app = express.createServer()

app.configure(function(){
  app.set('public',__dirname + '/public')
  app.set('view engine','jade')
  app.set('view options',{layout: false})
})

app.dynamicHelpers({
  cacheBuster: require('../index')
})

app.get('/',function(req,res){
  res.render(__dirname + '/public/index',{title: 'hello world'})
  // res.send('Hello World')
})

app.listen(3000)
