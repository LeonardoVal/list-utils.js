/**
*/
const MAX_INTEGER = Math.pow(2, 53) - 1;

function __toBool__(x) {
	return !!x;
}

function __toNumber__(x) {
	return +x;
}

function __id__(x) {
	return x;
}

function k(value) {
	return function() { 
		return value; 
	};
}

function throwUnimplemented(methodName, typeName) {
	throw new Error(`Function \`${methodName}\` is not implemented for \`${typeName}\`!`);
}