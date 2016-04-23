// Liveness: write
// - Kill: a, c
var a = 1, b, c = true;
if (// Liveness: a, c, write
	// - Gen: a
	a != 0) {
	// Liveness: a, c, write
	// - Gen: a
	// - Kill: b
	b = 10 / a;
} else {
	// Liveness: write
	// - Kill: b
	b = 0;
	// Liveness: b, write
	// - Kill: c
	c = false;
}
// Liveness: b, c, write
// - Gen: b, c, write
write(b, c);