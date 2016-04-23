// Lexical scoping
function foo(a) {
	var x = a;
	function bar() {
		var y = x + 5;
		function baz() {
			x = y + 1;
		}
		baz();
		return x;
	}
	var t = bar();
	return x + t;
}
var z = foo(3);