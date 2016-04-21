// Liveness: c
// - Kill: a
var a = 0, b, c;
do {
	// Liveness: a, c
	// - Gen: a
	// - Kill: b
	b = a + 1;
	// Liveness: b, c
	// - Gen: b, c
	// - Kill: c
	c = c + b;
	// Liveness: b, c
	// - Gen: b
	// - Kill: a
	a = b * 2;
} while (// Liveness: a, c
// - Gen: a
a < 9);
// Liveness: c
// - Gen: c
console.log(c);