'use strict';
/**
 * @author Sinecio Bermúdez Jacque
 * @description This function returns a plain object that defines env attributes to use in the project.
 * Can be whatever you want to use. by example if you want to use a base endpoint for request data to the server, 
 * so in your scripts you could use a relative url.
 * 
 * @example
 * 
 * 	var config = {
 * 		dev: {
 * 			BASE_URL: 'http://localhost:8080/'
 * 		},
 * 		prod: {
 * 			BASE_URL: ''	//empty because all request start from the base '/'.
 * 		}
 * 	}
 * 
 * 	//in script that defines a request:
 *
 * 	import config from 'root/bundle/conf/env-config.cfg';
 * 
 * 	export const listMovies() {
 * 		fetch(`${config.BASE_URL}/movies.json`)
 *  	.then(function(response) {
 *  	  	return response.json();
 *  	})
 *  	.then(function(myJson) {
 *  	  console.log(myJson);
 *  	});
 *  }
 * 
 * @param {String} env name of env config.
 */
module.exports = function(env){
	var config = {
		dev: {

		},
		prod: {

		}
	};
	
	return config[env];
}