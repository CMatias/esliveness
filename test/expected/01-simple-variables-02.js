// Liveness: 
var a;
// Liveness: 
// - Kill: a
a = 7;
// Liveness: a
var b;
// Liveness: a
// - Gen: a
// - Kill: b
b = a;