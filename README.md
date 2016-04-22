# esliveness
Variable liveness analysis for ECMAScript (JavaScript) based on Mozilla's Parser API AST.

Compatible with https://github.com/estools

## Usage

```js
// Create AST and control-flow graph
var ast = esprima.parse(source);
var cfg = esgraph(ast);

var liveness = require('esliveness');

liveness.compute(ast, cfg /* cfg is a optional parameter */);
var sourceWithComments = liveness.format(ast, true);
```

## Examples

do-while loop (test 03-loops-02.js):
```js
// Liveness: c, write
// - Kill: a
var a = 0, b, c;
do {
	// Liveness: a, c, write
	// - Gen: a
	// - Kill: b
	b = a + 1;
	// Liveness: b, c, write
	// - Gen: b, c
	// - Kill: c
	c = c + b;
	// Liveness: b, c, write
	// - Gen: b
	// - Kill: a
	a = b * 2;
} while (// Liveness: a, c, write
// - Gen: a
a < 9);
// Liveness: c, write
// - Gen: c, write
write(c);
```
