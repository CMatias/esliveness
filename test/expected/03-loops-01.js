// Liveness: 
// - Kill: x, y
var x = 0, y = 0;
// Liveness: x, y
// - Kill: z
var z = false;
while (// Liveness: x, y
	// - Gen: y
	y < 10) {
	// Liveness: x, y
	// - Gen: x
	// - Kill: x
	x++;
}
// Liveness: 
// - Kill: z
z = true;