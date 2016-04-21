// Liveness: 
// - Kill: a, c
var a = 1, b, c = true;
if (// Liveness: a, c
	// - Gen: a
	a != 0) {
	// Liveness: a, c
	// - Gen: a
	// - Kill: b
	b = 10 / a;
} else {
	// Liveness: 
	// - Kill: b
	b = 0;
	// Liveness: b
	// - Kill: c
	c = false;
}
// Liveness: b, c
// - Gen: b, c
console.log(b, c);