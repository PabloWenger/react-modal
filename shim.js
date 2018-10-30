/**
 * @author Sinecio Bermúdez Jacque
 * @description configuration generator for browserify-shim.
 * it use the settings in `./conf/shim.config.j` and if you need to do some change, you must review this file
 * and the grunt tasks named `browserify-*`.
 */

var shim = require('./conf/shim.config');

if (!shim.libs) shim.libs = {};
if (!shim.exports) shim.exports = {};

var shimlibs = Object.keys(shim.libs);
var config = JSON.stringify(shim.exports);
shimlibs.forEach(function(lib){
    config = config.replace(new RegExp('"'+lib+'":','g'), '"' + shim.libs[lib] + '":');
});

module.exports = JSON.parse(config);