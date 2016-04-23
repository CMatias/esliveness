(function (__global) {
	var val, id;
	id = function (n) {
		return n;
	};
	val = 'string';
	var ret = id(val);
	return ret;
}(typeof global === 'undefined' ? this : global));