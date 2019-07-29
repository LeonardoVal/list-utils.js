/** General class for representing synchronous sequences.
 * 
 * @augments AbstractIterable
 */
class Iterable extends AbstractIterable {
	/** @inheritdoc */
	constructor (source) {
		super(source);
	}

	/** Instances of `Iterable` are always synchronous, hence `isAsync` is 
	 * always `false`.
	 */
	get isAsync() {
		return false;
	}

	/** All `Iterable` instances are (of course) _iterable_, hence they have a
	 * `Symbol.iterator` method that returns an iterator.
	 */
	[Symbol.iterator](){
		let source = this.source,
			iterator = typeof source === 'function' ? source() 
				: source[Symbol.iterator]();
		return this.constructor.__iter__(iterator);
	}

	/** A synchronous iterator can be transformed to an asynchronous iterator,
	 * by returning resolved promises. This may be useful for mocking 
	 * asynchronous iterables with synchronous ones.
	 */
	[Symbol.asyncIterator]() {
		let iter = this[Symbol.iterator]();
		return this.__aiter__({
			next() { 
				return Promise.resolve(iter.next());
			}
		});
	}

	/** @inheritdoc */
	filteredMap(valueFunction, checkFunction) {
		let source = generators.filteredMap.bind(generators, this,
			valueFunction, checkFunction);
		return new Iterable(source);
	}

	/** @inheritdoc */
	forEach(doFunction, ifFunction) {
		let result;
		for (result of this) {
			if (!ifFunction || ifFunction(value, i, iter)) {
				result = (doFunction ? doFunction(value, i, iter) : value);
			}
		}
		return result; //FIXME Should forEach return something?
	}

// Builders ////////////////////////////////////////////////////////////////////

	/**
	 */
	static range(from, to, step, rightInclusive = false) {
		return new EnumerationIterable(from, to, step, rightInclusive);
	}

	/**
	 */
	static enumFromThenTo(from, then, to) {
		return Iterable.range(from, then - from, to, true);
	}

	/**
	 */
	static enumFromThen(from, then) {
		return Iterable.enumFromThenTo(from, then,
			then > from ? +Infinity : -Infinity);
	}

	/**
	 */
	static enumFromTo(from, to) {
		return Iterable.enumFromThenTo(from, from + 1, to);
	}

	/**
	 */
	static enumFrom(from) {
		return Iterable.enumFromTo(from, +Infinity);
	}

	/**
	 */
	static repeat(value, n) {
		let source = generators.repeat.bind(generators, value, n);
		return new this(source);
	}

	/**
	 */
	static iterate(f, arg, n) {
		let source = generators.iterate.bind(generators, f, arg, n);
		return new this(generators.iterate, f, arg, n);
	}

	/** `scanl(seq, foldFunction, initial)` folds the elements of this iterable 
	 * with `foldFunction` as a left associative operator. Instead of returning 
	 * the last result, it iterates over the intermediate values in the folding 
	 * sequence.
	 */
	scanl(foldFunction, initial) {
		let source = generators.scanl.bind(generators, this, foldFunction, 
			initial);
		return new Iterable(source);
	}

// Conversions /////////////////////////////////////////////////////////////////

	/** 
	*/
	flat(depth = +Infinity) {
		let source = generators.flat.bind(generators, this, depth);
		return new Iterable(source);
	}

	flatMap(mapFunction) {
		return this.map(mapFunction).flat(1);
	}

	/** `toArray(array=[])`: appends to `array` the elements of the sequence
	 * and returns it. If no array is given, a new one is used.
	*/
	toArray(array = null) {
		if (!array) {
			array = [...this];
		} else {
			for (let v of this) {
				array.push(v);
			}
		}
		return array;
	}

// Properties //////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	has(value, equality = null) {
		let i = equality ? this.indexWhere(equality.bind(null, value)) : 
			this.indexOf(value);
		return i >= 0;
	}

	/** @inheritdoc */
	isEmpty() {
		for (let v of this) {
			return false;
		}
		return true;
	}

	/** @inheritdoc */
	get length() {
		let result = 0;
		for (let _ of this) {
			result++;
		}
		return result;
	}

// Reductions //////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	reduce(foldFunction, initial) {
		let folded = initial,
			iter = this[Symbol.iterator](),
			i = 0;
		for (let entry = iter.next(); !entry.done; entry = iter.next()) {
			folded = foldFunction(folded, entry.value, i, iter);
			i++;
		} 
		return folded;
	}

// Selections //////////////////////////////////////////////////////////////////

	/** @inheritdoc */
	head(defaultValue) {
		for (let v of this) {
			return v;
		}
		if (arguments.length < 1) {
			throw new Error("Attempted to get the head of an empty list!");
		} else {
			return defaultValue;
		}
	}

	/** 
	 */
	static lastValue(seq, defaultValue) {
		let value = defaultValue,
			empty = true;
		for (value of seq) {
			empty = false;
		}
		if (empty && arguments.length < 2) {
			throw new Error("Attempted to get the last value of an empty iterator!");
		} else {
			return value;
		}
	}

	/**
	 */
	lastValue(defaultValue) {
		let iter = this[Symbol.iterator]();
		if (arguments.length < 1) {
			return Iterable.lastValue(iter);
		} else {
			return Iterable.lastValue(iter, defaultValue);
		}
	}

// Unary operations ////////////////////////////////////////////////////////////

	/** `buffered(array)` stores all elements of the iterable in an `array` and
	 * returns it as an iterable.
	 */
	buffered(array) {
		array = array || [];
		let source = generators.buffered.bind(generators, this, array);
		return new Iterable(source);
	}

	/** Generates all combinations of `k` values of this sequence, in 
	 * lexicographical order.
	 * 
	 * _Warning!_ Values are stored in memory during the iteration.
	 * 
	 * @param {integer} [k=1] - The number of values in each combination.
	 * @returns {iterable<T[]>}
	 * 
	 * @see generators.permutations
	 */
	combinations(k = 1) {
		let source = generators.combinations.bind(generators, this, k); 
		return new Iterable(source);
	}

	/** As the namesake from functional programming, `cons` generates a new
	 * sequence with the `head` first and the values of this sequence 
	 * afterwards.
	 * 
	 * @param {T} head - The first value in the new sequence.
	 * @returns {iterable<T>}
	 */
	cons(value) {
		let source = generators.cons.bind(generators, value, this);
		return new Iterable(source);
	}

	/** `cycle(n = +Infinity)` returns an iterable that loops `n` times (or 
	 * forever by default) over the elements of this `Iterable`.
	 */
	cycle(n = +Infinity) {
		let source = generators.cycle.bind(generators, this, n);
		return new Iterable(source);
	}

	/** Generates all permutations of `k` values of this sequence, in no 
	 * particular order.
	 * 
	 * _Warning!_ All values are stored in memory during the iteration.
	 * 
	 * @param {integer} [k=1] - The amount of values in each permutation. By
	 * 	default the length of this sequence is assumed.
	 * @yields {T[]}
	 * 
	 * @see generators.combinations
	*/
	permutations(k = 1) {
		let source = generators.permutations.bind(generators, this, k); 
		return new Iterable(source);
	}

	/** `reverse()` returns an iterable with this iterable elements in reverse
	 * order. 
	 * 
	 * _Warning!_ It stores all this iterable's elements in memory.
	 */
	reverse() {
		let reversedArray = this.toArray().reverse();
		return this.constructor.fromArray(reversedArray);
	}

	/** `sorted(sortFunction)` returns an iterable that goes through this 
	 * iterable's elements in order. 
	 * 
	 * _Warning!_ This iterable's elements are stored in memory for sorting.
	 */
	sorted(sortFunction) {
		let sortedArray = this.toArray().sort(sortFunction);
		return this.constructor.fromArray(sortedArray);
	}

// Variadic operations /////////////////////////////////////////////////////////
	
	/** Returns an iterable that goes over the concatenation of all the given 
	 * iterables.
	 * 
	 * @param {...iterable<T>} iterables
	 * @returns {iterable<T>} 
	 */
	static concat(...iterables) {
		let source = generators.concat.bind(generators, ...iterables);
		return new Iterable(source);
	}

	/** `zipWith(zipFunction, ...iterables)` builds an iterable that iterates 
	 * over all the given iterables at the same time, stopping at the first 
	 * sequence finishing. Each value in the generated sequence is made by 
	 * calling the given `zipFunction` with an array of the values of each 
	 * iterable.
	 */
	static zipWith(zipFunction, ...iterables) {
		let source = generators.zipWith.bind(generators, zipFunction, 
			...iterables);
		return new Iterable(source);
	}

	/** `product(iterables...)` builds an iterable that iterates over the 
	 * [cartesian product](http://en.wikipedia.org/wiki/Cartesian_product) of 
	 * this and all the given iterables, yielding an array of the values of
	 * each.
	 */
	static product(...iterables) {
		let source = generators.product.bind(generators, ...iterables);
		return new Iterable(source);
	}

} // class Iterable

exports.Iterable = Iterable;
