
function parseInt(string) {
	const nums = {
		one:1,	 		two: 2,			three: 3,
		four: 4,	 		five: 5,			six: 6,
		seven: 7,		eight: 8,		nine: 9,
		ten: 10,			eleven: 11,		twelve: 12,
		thirteen: 13,	fourteen: 14,	fifteen: 15,
		sixteen: 16,	seventeen: 17,	eighteen: 18,
		nineteen: 19,	twenty:20,		thirty: 30,
		forty: 40,		fifty: 50,		sixty: 60,
		seventy: 70,	eighty: 80,		ninety: 90
	};
	let result = string;

	result = result.replace(/hundred^/, "00");
	result = result.replace(/thousand^/, "000");

	[ ].forEach.call( Array.from(Object.keys(nums).sort( (a, b) => a.length > b.length ? -1 : 1 ) ), el => {
		result = result.replace( new RegExp(el, "gi"), nums[el] )
	} );
	return +( result
		.replace(/0-/gi, "")
		.replace(/[^0-9]/g, "") )
	;
}