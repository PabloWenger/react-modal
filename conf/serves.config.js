/** 
 * @author Sinecio Bermúdez Jacque
 * @description configuration to serve static files during the development.
 *
 * @example
 * 
 *      if we want to serve files from the directory ./foo we must set:
 * 
 *      module.exports = [
 *          {
 *              use: 'foo'
 *          }
 *      ];
 * 
 *      if we want to serve files from the directory ./foo/files with the virtual path /baz
 *      we must set:
 * s
 *      module.exports = [
 *          {
 *              use: '/baz',
 *              path: 'foo/files'
 *          }
 *      ];
 */
module.exports = [
    { 
        use: 'src' 
    },
    { 
        use: 'bundle' 
    },
    {
        use: '/spa',
        path: 'bundle'
    },
    {
        use: '/spa',
        path: 'src'
    },
    {
        use: '/css',
        path: 'src/styles'
    },
    {
        use: '/src',
        path: 'src'
    }
];