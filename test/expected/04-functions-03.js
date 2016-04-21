// Liveness: global, this
// - Gen: global, this
function (__global) {
	var tmp0, tmp1, tmp2, tmp3, tmp4, tmp5, tmp6, tmp7, tmp8, tmp9;
	tmp9 = function(n) {
		var tmp10, tmp11, tmp12, tmp13, tmp14, tmp15, tmp16, tmp17, tmp18, tmp19, tmp20, tmp21, tmp22, tmp23, tmp24, tmp25, tmp26;
		tmp11 = n;
		tmp12 = 2;
		tmp10 = tmp11 <= tmp12;
		if (tmp10) {
			tmp13 = 1;
			return tmp13;
		} else {
			tmp18 = 'fib';
			tmp17 = __global[tmp18];
			tmp20 = n;
			tmp21 = 2;
			tmp19 = tmp20 - tmp21;
			tmp15 = tmp17(tmp19);
			tmp23 = 'fib';
			tmp22 = __global[tmp23];
			tmp25 = n;
			tmp26 = 1;
			tmp24 = tmp25 - tmp26;
			tmp16 = tmp22(tmp24);
			tmp14 = tmp15 + tmp16;
			return tmp14;
		}
	};
	tmp8 = 'fib';
	__global[tmp8] = tmp9;
	tmp2 = 'console';
	tmp0 = __global[tmp2];
	tmp1 = 'log';
	tmp5 = 'fib';
	tmp4 = __global[tmp5];
	tmp6 = 10;
	// Liveness: tmp0, tmp1, tmp4, tmp6
	// - Gen: tmp4, tmp6
	// - Kill: tmp3
	tmp3 = tmp4(tmp6);
	// Liveness: tmp0, tmp1, tmp3
	// - Gen: tmp0, tmp1, tmp3
	// - Kill: tmp7
	tmp7 = tmp0[tmp1](tmp3);
}(typeof global === 'undefined' ? this : global);