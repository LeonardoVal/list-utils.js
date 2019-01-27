﻿define(['list-utils'], function (list_utils) { "use strict";
	function expectList(list) {
		expect(list.__iter__).toBeOfType('function');
		expectIterator.apply(null, 
			[list.__iter__()].concat(Array.prototype.slice.call(arguments, 1))
		);
	}

	function expectIterator(iterator) {
		expect(iterator.next).toBeOfType('function');
		expect(iterator.return).toBeOfType('function');
		var x;
		for (var i = 1; i < arguments.length; i++) {
			x = iterator.next();
			expect(x.done).toBeFalsy();
			expect(x.value).toBe(arguments[i]);
		}
		x = iterator.next();
		expect(x.done).toBeTruthy();
		expect(x.value).not.toBeDefined();
	}	

	describe("Lists from arrays:", function () {
		it("`Iterable.iteratorFromArray` function", function () {
			expect(list_utils.Iterable.iteratorFromArray).toBeOfType('function');
			var iteratorFromArray = list_utils.Iterable.iteratorFromArray.bind(list_utils.Iterable);
			expectIterator(iteratorFromArray([]));
			expectIterator(iteratorFromArray([true]), true);
			expectIterator(iteratorFromArray([1, 2]), 1, 2);
			expectIterator(iteratorFromArray(['a', 'b', 'c']), 'a', 'b', 'c');
		});

		it("`ArrayIterable` class", function () {
			expect(list_utils.ArrayIterable).toBeOfType('function');
			expectList(new list_utils.ArrayIterable([]));
			expectList(new list_utils.ArrayIterable([true]), true);
			expectList(new list_utils.ArrayIterable([1, 2]), 1, 2);
			expectList(new list_utils.ArrayIterable(['a', 'b', 'c']), 'a', 'b', 'c');
		});

		it("`Iterable.fromArray` function", function () {
			expect(list_utils.Iterable.fromArray).toBeOfType('function');
			var fromArray = list_utils.Iterable.fromArray.bind(list_utils.Iterable);
			expectList(fromArray([]));
			expectList(fromArray([true]), true);
			expectList(fromArray([1, 2]), 1, 2);
			expectList(fromArray(['a', 'b', 'c']), 'a', 'b', 'c');
		});

		it("`Iterable.fromValues` function", function () {
			expect(list_utils.Iterable.fromValues).toBeOfType('function');
			var fromValues = list_utils.Iterable.fromValues.bind(list_utils.Iterable);
			expectList(fromValues());
			expectList(fromValues(true), true);
			expectList(fromValues(1, 2), 1, 2);
			expectList(fromValues('a', 'b', 'c'), 'a', 'b', 'c');
		});
		//TODO More tests.
	}); // describe "Lists from arrays:"
}); //// define
