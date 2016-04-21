// Liveness: write
// - Kill: x1
var x1 = 1;
// Liveness: write, x1
// - Gen: x1
// - Kill: x2
var x2 = x1 + x1;
// Liveness: write, x1, x2
// - Gen: x1, x2
// - Kill: x3
var x3 = x2 + x1;
// Liveness: write, x1, x2, x3
// - Gen: x1, x2
// - Kill: y2
var y2 = x1 + x2;
// Liveness: write, x3, y2
// - Gen: x3, y2
// - Kill: y3
var y3 = y2 + x3;
// Liveness: write, y3
// - Gen: write, y3
write(y3);