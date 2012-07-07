
//     Express Cachebuster
//     Copyright (c) 2011 Nick Baugh (niftylettuce@gmail.com)
//     MIT Licensed

// # Express Cachebuster

var fs = require('fs')
  , path = require('path')
  , mime = require('mime')
  , hasOwnProp = Object.prototype.hasOwnProperty;

// `escape` function from Lo-Dash v0.2.2 <http://lodash.com>
// and Copyright 2012 John-David Dalton <http://allyoucanleet.com/>
// MIT licensed <http://lodash.com/license>
function escape(string) {
  return (string + '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function renderAttributes(attributes){
  var str = []
    , name;
  for(name in attributes){
    if(hasOwnProp.call(attributes, name)){
      str.push(escape(name) + '="' + escape(attributes[name]) + '\"');
    }
  }
  return str.sort().join(" ");
}

// Render Tag
function renderTag(asset, env, stats, attributes) {
  var mimeType = mime.lookup(asset)
  , timestamp = '?v=' + new Date().getTime();
  attributes = attributes || {};
  asset = escape(asset) + timestamp;
  if(env === 'production' && typeof stats !== 'undefined') {
    //timestamp = Date.parse(stats.mtime);
    timestamp = '';
  }
  switch(mimeType) {
    case 'application/javascript':
    case 'text/javascript':
      attributes.type = attributes.type || 'text/javascript';
      attributes.src = asset;
      return '<script ' + renderAttributes(attributes) + '></script>';
    case 'text/css':
      attributes.rel = attributes.rel || 'stylesheet';
      attributes.href = asset;
      return '<link ' + renderAttributes(attributes) + '>';
    default:
      console.log("Unknown asset type of " + mimeType);
      process.exit(0);
  }
}

// Check Asset
function checkAsset(asset, publicDir, env, buf, attributes) {
  var file = path.join(publicDir, asset);
  if(fs.existsSync(file)) {
    var tag = renderTag(asset, env, fs.statSync(file), attributes);
    buf.push(tag);
  } else {
    var tag = renderTag(asset, env, { mtime: new Date().getTime() }, attributes);
    buf.push(tag);
  }
  return buf;
}

// Load Assets
function loadAssets(asset, publicDir, env, attributes) {
  var buf = [], len = asset.length;
  if(asset instanceof Array && len > 0) {
    for(var i=0; i<len; i+=1) {
      if((i + 1) === len) {
        return checkAsset(asset[i], publicDir, env, buf, attributes);
      } else {
        buf = checkAsset(asset[i], publicDir, env, buf, attributes);
      }
    }
  } else if (typeof asset === 'string') {
    return checkAsset(asset, publicDir, env, buf, attributes);
  }
}

// Run
function run(asset, publicDir, env, attributes) {
  if(typeof asset === 'undefined') {
    console.log("\n  Asset undefined using cacheBuster()");
    process.exit(0);
  }
  return loadAssets(asset, publicDir, env, attributes);
}

// ## Middleware
module.exports = function(req, res) {
  var publicDir = req.app.settings['public']
  , env = req.app.settings.env;
  return function(asset, attributes) {
    return run(asset, publicDir, req.app.settings.env, attributes);
  };
};
