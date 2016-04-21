// Liveness: 
var x = 0, y = 0;
// Liveness: x, y
var z = false;
// Liveness: x, y, z
// - Gen: y
while (y < 10) {
	// Liveness: x, y, z
	// - Gen: x
	// - Kill: x
	x++;
}
// Liveness: z
// - Kill: z
z = true;