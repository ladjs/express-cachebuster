
//     Express Cachebuster
//     Copyright (c) 2011 Nick Baugh (niftylettuce@gmail.com)
//     MIT Licensed

// # Express Cachebuster

var fs = require('fs')
  , path = require('path')
  , mime = require('mime');

function getFile(asset, publicDir) {
  var file = path.join(publicDir, asset);
  return [fs.statSync(file, function(err, stats) {
    if(err || !stats.isFile()) {
      console.log('\n  express-cachebuster asset not found (is path correct?)');
      process.exit(0);
    }
  }), file, asset];
}

function renderTag(stats, env) {
  var v
    , t = mime.lookup(stats[1]);
  if(env === 'development') {
    v = new Date().getTime();
  } else {
    v = Date.parse(stats[0].mtime);
  }
  switch(t) {
    case 'text/javascript':
      return '<script type="'+t+'" src="'+stats[2]+'?v='+v+'"></script>';
    case 'text/css':
      return '<link rel="stylesheet" href="'+stats[2]+'?v='+v+'">';
    default:
      console.log('\n  express-cachebuster cannot render ' + t);
      process.exit(0);
  }
}

module.exports = function(req, res) {
  return function(asset) {
    var buf = []
      , stats
      , publicDir = req.app.settings['public']
      , env = req.app.settings.env;
    if(asset instanceof Array && asset.length > 0) {
      for(var i=0; i<asset.length; i++) {
        if(typeof asset[i] === 'string') {
          stats = getFile(asset[i], publicDir);
          buf.push(renderTag(stats, env));
        } else {
          console.log('\n  express-cachebuster asset undefined in array');
        }
      }
    } else if (asset && typeof asset === 'string') {
      stats = getFile(asset, publicDir);
      buf.push(renderTag(stats, env));
    } else {
      console.log('\n  express-cachebuster asset is undefined');
      process.exit(0);
    }
    return buf.join('\n');
  };
};
