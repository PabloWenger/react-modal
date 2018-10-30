/**
 * @author Sinecio Bermúdez Jacque
 * @description this script transforms the `./conf/aliases.config.js` config into a plain object for pathmodify plugin.
 */

var aliases = require('./conf/aliases.config');
var pathmodify = require('pathmodify');
var path = require('path');

var modsAliases = [
    pathmodify.mod.dir('root', __dirname)
];
for (var k in aliases){
    modsAliases.push(pathmodify.mod.dir(k, path.join(__dirname, aliases[k])))
}
module.exports =  {
    mods: modsAliases
}