function rnd(min, max) {
    return +( Math.random( ) * (max - min) + min ).toFixed(0);
}

function genKey({len, low, up, s1, s2}) {
	const symbols = {
		syms2:	[ {min: 58, max: 64}, {min: 91, max: 96}, {min: 123, max: 126} ],
		syms1:	{min: 33, max: 47},
		lows:	{min: 97, max: 122},
		uppers:	{min: 65, max: 90},
		nums:	{min: 48, max: 57}
	};
}


function genSeq(min, max) {
	if (min instanceof Array) return min.reduce( (res, el, i, arr) => {
		if(i % 2 !== 0) {
			res.push( genSeq(el, el) );
		}
		return res.flat( );
	}, [ ]);
	let result = [];
	for (let i = min; i < max; i++) {
		result.push( String.fromCharCode(i) );
	}
	return result;
}