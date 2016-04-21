var gcd = function (a, b) {
	var c = a;
	var d = b;
	if (c == 0) {
		return d;
	}
	while (d != 0) {
		if (c > d)
			c = c - d;
		else
			d = d - c;
	}
	return c;
};
gcd(18, 7);