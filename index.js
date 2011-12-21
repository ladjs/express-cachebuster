//     Express Cachebuster
//     Copyright (c) 2011 Nick Baugh (niftylettuce@gmail.com)
//     MIT Licensed

// # Express Cachebuster

var fs = require('fs')
  , path = require('path')
  , mime = require('mime');

// ## Middleware
module.exports = function(req, res) {
  var publicDir = req.app.settings['public']
    , env = req.app.settings.env;
  return function(asset) {
    console.log(run(asset, publicDir, env));
    return run(asset, publicDir, env);
  };
};

// Run
function run(asset, publicDir, env) {
  if(typeof asset === 'undefined') {
    console.log("\n  Asset undefined using cacheBuster()");
    process.exit(0);
  }
  return loadAssets(asset, publicDir, env, function(buf) {
    return buf.join('\n');
  });
}

// Load Assets
function loadAssets(asset, publicDir, env, callback) {
  var buf = [], len = asset.length;
  if(asset instanceof Array && len > 0) {
    for(var i=0; i<len; i+=1) {
      if((i + 1) === len) {
        return checkAsset(asset[i], publicDir, env, buf, callback);
      } else {
        buf = checkAsset(asset[i], publicDir, env, buf);
      }
    }
  } else if (typeof asset === 'string') {
    return checkAsset(asset, publicDir, env, buf, callback);
  }
}

// Check Asset
function checkAsset(asset, publicDir, env, buf, callback) {
  var file = path.join(publicDir, asset);
  return checkExistence(file, function(exists) {
    if(exists) {
      return fileStat(asset, publicDir, function(fileStats) {
        return renderTag(asset, publicDir, env, buf, callback, fileStats, function(tag) {
          if(typeof callback !== 'undefined') {
            buf.push(tag);
            return callback(buf);
          } else {
            buf.push(tag);
            return buf;
          }
        });
      });
    } else {
      return renderTag(asset, publicDir, env, buf, callback, undefined, function(tag) {
        if(typeof callback !== 'undefined') {
          buf.push(tag);
          return callback(buf);
        } else {
          buf.push(tag);
          return buf;
        }
      });
    }
  });
}

// Check Existence
function checkExistence(file, callback) {
  return path.exists(file, function(exists) {
    return callback(exists);
  });
}

// Render Tag
function renderTag(asset, publicDir, env, buf, callback, stats, tag) {
  var mimeType = mime.lookup(asset)
    , timestamp = new Date().getTime();
  if(env === 'production' && typeof stats !== 'undefined') {
    timestamp = Date.parse(stats.mtime);
  }
  switch(mimeType) {
    case 'text/javascript':
      return tag('<script type="text/javascript" src="' + asset + '?v=' + timestamp + '"></script>');
    case 'text/css':
      return tag('<link rel="stylesheet" href="' + asset + '?v=' + timestamp + '">');
    default:
      console.log("Unknown asset type of " + mimeType);
      process.exit(0);
  }
}

// File Stat
function fileStat(asset, publicDir, fileStats) {
  return fs.stat(path.join(publicDir, asset), function(err, stats) {
    if(err) throw err;
    return fileStats(stats);
  });
}
