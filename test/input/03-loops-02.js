var a = 0, b, c;
do {
	b = a + 1;
	c = c + b;
	a = b * 2;
} while (a < 9);
write(c);