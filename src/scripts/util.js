'use strict';
/**
 * @author Sinecio Bermúdez Jacque
 * @description script con métodos de utilidad, deben ser atomicos y genéricos
 */
module.exports = {
    date        : _date
};

/**
 * @description Permite transformar una fecha en objeto Date
 * @param  {string} input  	string que representa una fecha ('dia/mes/año')
 * @return {object}         Date
 */
function _date(input){
    if (input == null || input instanceof Date) return input;
    input = input.replace(/-/g,"/").split("/");
    input = new Date(input[1]+"/"+input[0]+"/"+input[2]);
    if (isNaN(input.getDay()) || input.getFullYear() <= 1900) input = null;
    return input;
}