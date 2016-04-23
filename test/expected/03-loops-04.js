// Liveness: write
// - Kill: res
var res = 0;
for (// Liveness: res, write
	// - Kill: i
	var i = 0; // Liveness: i, res, write
	// - Gen: i
	i < 10; // Liveness: i, res, write
	// - Gen: i
	// - Kill: i
	i++) {
	// Liveness: i, write
	// - Gen: i
	// - Kill: res
	res += i;
}
// Liveness: res, write
// - Gen: res, write
write(res);