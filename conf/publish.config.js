/** 
 * @author Sinecio Bermúdez Jacque
 * @description configuration for distribution
 * @type {Object}
 */
module.exports={
	/**
	 * @description path where application's package will be create. This path is relative to Gruntfile.js
	 * or complete to another directory.
	 * @type {String}
	 * @example '../../dist/spa' or '..\\..\\pub\\spa' or 'C:/pub/spa' or 'pub/dist'
	 */
	path: 'dist',

	/**
	 * @description env to use to create the application package.
	 * @type {String}
	 */
	env: 'prod',

	/**
	 * @description file name to use
	 * @type {String}
	 */
	libFileName: 'react-modal',

	/**
	 * @description entry file relative to gruntfile.js
	 * @type {String}
	 */
	entryFile: './src/modules/react-modal/modal.jsx'
};