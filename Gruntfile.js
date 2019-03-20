﻿/** Gruntfile for [creatartis-base](http://github.com/LeonardoVal/list-utils.js).
*/
module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
	});

	require('creatartis-grunt').config(grunt, {
		globalName: 'list_utils',
		sourceNames: ['__prologue__',
			'_utils', 'core', 'async',
		// builders
			'builders/empty', 'builders/singleton', 'builders/strings', 'builders/arrays',
			'builders/objects', 
			'builders/range', 'builders/enumFromThenTo', 
			'builders/repeat', 'builders/iterate',
			'builders/ticks',
		// properties
			'properties/isAsync', 'properties/isEmpty', 'properties/length',
			'properties/indicesWhere', 'properties/indexWhere',
			'properties/indicesOf', 'properties/indexOf', 
		// selections
			'selections/get', 'selections/filter', 'selections/head', 'selections/tail',
			'selections/takeWhile', 'selections/dropWhile', 
			'selections/slice', 'selections/take', 'selections/drop',
			'selections/greater', 'selections/lesser',
		// conversions
			'conversions/map', 'conversions/join', 
			'conversions/toArray', 'conversions/toObject', 
			'conversions/toMap', 'conversions/toSet',
		// unary
			'unary/cycle', 'unary/reverse', 'unary/sorted', 'unary/slices',
		// reductions
			'reductions/scanl', 'reductions/foldl', 
			'reductions/sum', 'reductions/min', 'reductions/max',
			'reductions/all', 'reductions/any',
		// ... 
			'tuples', 'combinatorics',
			'__epilogue__'],
		deps: [
			{ id: 'tests-common', path: 'build/tests-common.js', dev: true, module: false }
		],
		copy: {
			'build/': 'src/tests-common.js'
		},
		jshint: { loopfunc: true, boss: true, evil: true, proto: true },
		karma: ['Firefox', 'Chrome'],
		connect: {
			console: 'tests/console.html'
		}
	});

	grunt.registerTask('full-test', ['test', 'karma:test_chrome']);
	grunt.registerTask('default', ['build']);
};
