/**
 * @author Sinecio Bermúdez Jacque
 * @description Configuration for third party libraries that are not written with modular support (UMD)
 *  or configuration of explicit dependencies for modules to use.
 *  All paths are relatives to Gruntfile.js
 * 
 *  Note:
 *      `excludes` allows exclude dependencies of `package.json > dependencies`, these dependencies
 *      will not be include in the bundle `libs.js`. This is necesary when the dependencies do not include
 *      a main javascript file to load, or instead of, we just need use their static files.
 *              
 * @example
 *      libs: {
 *          'mylib': './src/scripts/mylib.js'
 *          'nglib': './node_modules/angular-lib/dist/angular-lib.js'
 *      },
 *      exports: {
 *          'mylib' : 'myLib' // exports as 'myLib'
 *          'nglib': {
 *              exports: 'myLib2', // exports as 'myLib2'
 *              depends: {
 *                  jquery: 'jQuery' //depends of jquery as 'jQuery' (there are cases where the dependency is '$')
 *              }
 *          }
 *      },
 *      excludes: [
 *          'net'   //exclude the dependency 'net' 
 *      ]
 */
module.exports = {
    libs: {

    },
    exports: {
        
    },
    excludes: [
    ]
};