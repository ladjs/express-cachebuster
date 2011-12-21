//     Express Cachebuster
//     Copyright (c) 2011 Nick Baugh (niftylettuce@gmail.com)
//     MIT Licensed

// # Express Cachebuster

var fs = require('fs')
  , path = require('path')
  , mime = require('mime');

// ## Middleware
module.exports = function(req, res) {
  console.log("cache buster getting called...")
  var publicDir = req.app.settings['public']
    , env = req.app.settings.env;
  console.log(publicDir)
  console.log(env)
  return function(asset,cb) {
    console.log("this callback method called..." + asset)
    //console.log(run(asset, publicDir, env));
    console.log("==================================================")
    run(asset,publicDir,env,function(buf){
      console.log(buf)
      console.log(">> ==================================================")
    })
    console.log("==================================================")
  };
};

// Run
function run(asset, publicDir, env,callback) {
  if(typeof asset === 'undefined') {
    console.log("\n  Asset undefined using cacheBuster()");
    process.exit(0);
  }
  loadAssets(asset, publicDir, env, function(buf) {
    console.log("loadAssets successfully executed..."+ buf)
    console.log(buf.join('\n'))
    callback(buf.join('\n'));
  });
}

// Load Assets
function loadAssets(asset, publicDir, env, callback) {
  console.log("loadAssets entry")
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
    console.log("Checking Asset...")
    checkAsset(asset, publicDir, env, buf, function(buf){
      console.log(buf)
      callback(buf)
    });
  }
}

// Check Asset
function checkAsset(asset, publicDir, env, buf, callback) {
  var file = path.join(publicDir, asset);
  console.log("checkAsset entry" + file)
  checkExistence(file, function(exists) {
    console.log("Check Existence callback...")
    if(exists) {
      console.log("file exist logic...")
      fileStat(asset, publicDir, function(fileStats) {
        console.log("returned fileStats...")
        renderTag(asset, publicDir, env, buf, callback, fileStats, function(tag) {
          console.log("renderTag result.."+ callback)
          console.log(tag)
          if(typeof callback !== 'undefined') {
            buf.push(tag);
            console.log("buffer after the pushed" + buf)
            callback(buf);
          } else {
            buf.push(tag);
            buf;
          }
        });
      });
    } else {
      renderTag(asset, publicDir, env, buf, callback, undefined, function(tag) {
        if(typeof callback !== 'undefined') {
          buf.push(tag);
          callback(buf);
        } else {
          buf.push(tag);
          callback(buf);
        }
      });
    }
  });
}

// Check Existence
function checkExistence(file, callback) {
  return path.exists(file, function(exists) {
    console.log("specified path exist....")
    return callback(exists);
  });
}

// Render Tag
function renderTag(asset, publicDir, env, buf, callback, stats, tag) {
  var mimeType = mime.lookup(asset)
    , timestamp = new Date().getTime();
  console.log(mimeType)
  if(env === 'production' && typeof stats !== 'undefined') {
    timestamp = Date.parse(stats.mtime);
  }
  switch(mimeType) {
    case 'text/javascript':
      return tag('<script type="text/javascript" src="' + asset + '?v=' + timestamp + '"></script>');
    case 'text/css':
      console.log('came here...')
      return tag('<link rel="stylesheet" href="' + asset + '?v=' + timestamp + '">');
    default:
      console.log("Unknown asset type of " + mimeType);
      process.exit(0);
  }
}

// File Stat
function fileStat(asset, publicDir, fileStats) {
  console.log("fileStat entry.."+ asset)
  console.log("fileStat entry.."+ publicDir)
  return fs.stat(path.join(publicDir, asset), function(err, stats) {
    if(err) throw err;
    console.log(stats)
    return fileStats(stats);
  });
}
