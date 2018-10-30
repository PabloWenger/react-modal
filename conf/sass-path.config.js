/** 
 * @author Sinecio Bermúdez Jacque
 * @description configuration of paths to find sass files.
 *              All paths are relatives to Gruntfile.js
 * @example
 *      if we have by example, _my-style.scss in the path `./src/modules/my-module/sass`.
 *      we set:
 * 
 *      module.exports = [
 *          './src/modules/my-module/sass'
 *      ];
 * 
 *      then in scss files we can use:
 *      @import 'mi-estilo';
 * 
 *      Note: we must not set complete paths like the example, because it can exist files
 *      with the same name.
 */
module.exports = [
    './node_modules',
    './src/modules'
];