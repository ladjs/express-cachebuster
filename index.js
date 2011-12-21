
//     Express Cachebuster
//     Copyright (c) 2011 Nick Baugh (niftylettuce@gmail.com)
//     MIT Licensed

// # Express Cachebuster

var fs = require('fs')
  , path = require('path')
  , mime = require('mime');

// Render Tag
function renderTag(asset, env, stats) {
  var mimeType = mime.lookup(asset)
  , timestamp = '?v=' + new Date().getTime();
  if(env === 'production' && typeof stats !== 'undefined') {
    //timestamp = Date.parse(stats.mtime);
    timestamp = '';
  }
  switch(mimeType) {
    case 'application/javascript':
    case 'text/javascript':
      return '<script type="text/javascript" src="' + asset + timestamp + '"></script>';
    case 'text/css':
      return '<link rel="stylesheet" href="' + asset + timestamp + '">';
    default:
      console.log("Unknown asset type of " + mimeType);
      process.exit(0);
  }
}

// Check Asset
function checkAsset(asset, publicDir, env, buf) {
  var file = path.join(publicDir, asset);
  if(path.existsSync(file)) {
    var tag = renderTag(asset, env, fs.statSync(file));
    buf.push(tag);
  } else {
    var tag = renderTag(asset, env, { mtime: new Date().getTime() });
    buf.push(tag);
  }
  return buf;
}

// Load Assets
function loadAssets(asset, publicDir, env) {
  var buf = [], len = asset.length;
  if(asset instanceof Array && len > 0) {
    for(var i=0; i<len; i+=1) {
      if((i + 1) === len) {
        return checkAsset(asset[i], publicDir, env, buf);
      } else {
        buf = checkAsset(asset[i], publicDir, env, buf);
      }
    }
  } else if (typeof asset === 'string') {
    return checkAsset(asset, publicDir, env, buf);
  }
}

// Run
function run(asset, publicDir,env) {
  if(typeof asset === 'undefined') {
    console.log("\n  Asset undefined using cacheBuster()");
    process.exit(0);
  }
  return loadAssets(asset, publicDir, env);
}

// ## Middleware
module.exports = function(req, res) {
  var publicDir = req.app.settings['public']
  , env = req.app.settings.env;
  return function(asset) {
    return run(asset,publicDir,req.app.settings.env);
  };
};
