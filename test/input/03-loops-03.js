n = read();
i = 1;
sum = 0;
while (i <= n) {
	sum = 0;
	j = 1;
	while (j <= i) {
		sum = sum + j;
		j = j + 1;
	}
	write(sum, i);
	i = i + 1;
}
write(sum, i);