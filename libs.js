/**
 * @author Sinecio Bermúdez Jacque
 * @description entry file for libs.
 * The grunt task browserify-libs requires this file first and then dependencies from
 * package.json > dependencies, so we make sure some scripts are ready before all
 * requires in dependencies.
 */
require('@babel/polyfill');