/** 
 * @author Sinecio Bermúdez Jacque
 * @description configuration for custom paths. these paths allow you
 *              to create a virtual path for whatever directory you want.
 * @example
 *      if we have a directory './documents/example/test' and we need
 *      to access by a virtual path 'http://localhost:8080/test', we must
 *      set:
 *  
 *      module.exports = {
 *          'test' : './documents/example/test'
 *      };
 * 
 *      Note: when you make your application's distribution, these custom paths
 *      will become directories in your package and all files inside will be copied
 *      in there.
 */
module.exports = {

};