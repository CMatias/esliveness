// Liveness: 
// - Kill: a
var a = 7, b, c, d;
// Liveness: a
// - Gen: a
// - Kill: b
b = a - a;
// Liveness: b
// - Kill: a
a = 3;
// Liveness: a, b
// - Gen: a, b
// - Kill: c
c = a + b;
// Liveness: a, c
// - Gen: c
// - Kill: b
b = c;
// Liveness: a
// - Gen: a
// - Kill: a
a = a;