// Liveness: read, write
// - Gen: read
// - Kill: n
n = read();
// Liveness: n, write
// - Kill: i
i = 1;
// Liveness: i, n, write
// - Kill: sum
sum = 0;
while (// Liveness: i, n, sum, write
	// - Gen: i, n
	i <= n) {
	// Liveness: i, n, write
	// - Kill: sum
	sum = 0;
	// Liveness: i, n, sum, write
	// - Kill: j
	j = 1;
	while (// Liveness: i, j, n, sum, write
		// - Gen: i, j
		j <= i) {
		// Liveness: i, j, n, sum, write
		// - Gen: j, sum
		// - Kill: sum
		sum = sum + j;
		// Liveness: i, j, n, sum, write
		// - Gen: j
		// - Kill: j
		j = j + 1;
	}
	// Liveness: i, n, sum, write
	// - Gen: i, sum, write
	write(sum, i);
	// Liveness: i, n, sum, write
	// - Gen: i
	// - Kill: i
	i = i + 1;
}
// Liveness: i, sum, write
// - Gen: i, sum, write
write(sum, i);