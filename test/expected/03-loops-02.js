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