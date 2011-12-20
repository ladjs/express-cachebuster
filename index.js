
//     Express Cachebuster
//     Copyright (c) 2011 Nick Baugh (niftylettuce@gmail.com)
//     MIT Licensed

// # Express Cachebuster

var fs = require('fs')
  , path = require('path')
  , mime = require('mime');

function getFile(asset, publicDir) {
  if(typeof publicDir === 'undefined' || typeof publicDir !== 'string') {
    publicDir = 'public';
  }
  var file = path.join(__dirname, publicDir, asset);
  return [fs.statSync(file, function(err, stats) {
    if(err || !stats.isFile()) {
      console.log('\n  express-cachebuster asset not found (is path correct?)');
      process.exit(0);
    }
  }), file, asset];
}

function renderTag(stats) {
  var v = 1
    , t = mime.lookup(stats[1]);
  if(app.settings.env === 'development') {
    v = new Date().getTime();
  } else {
    v = new Date().parse(stats[0].mtime);
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
  return function(asset, publicDir) {
    var buf = []
      , stats;
    if(asset instanceof Array && asset.length > 0) {
      for(var i=0; i<asset.length; i++) {
        if(typeof asset[i] === 'string') {
          stats = getFile(asset, publicDir);
          buf.push(renderTag(stats));
        } else {
          console.log('\n  express-cachebuster asset undefined in array');
        }
      }
    } else if (asset && typeof asset === 'string') {
      stats = getFile(asset, publicDir);
      buf.push(renderTag(stats));
    } else {
      console.log('\n  express-cachebuster asset is undefined');
      process.exit(0);
    }
    return buf.join('\n');
  };
};
