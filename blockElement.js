/*jshint es5: true, esnext: true, loopfunc: true, browser: true, devel: true*/
const 
	keySettings = {
		ups:		{min: 2, max: 3},
		lows:		{min: 2, max: 3},
		nums:		{min: 1, max: 2},
		syms:		{min: 1, max: 6},
		len:		10
	}
;

function genSeq(min, max) {
	if (min instanceof Array) return min.reduce( (res, el, i, arr) => {
		if ( !i || !(i % 2) ) res.push( genSeq(el, arr[i + 1]) );
		return res.flat( );
	}, [ ]);
	
	let result = [ ];
	for (let i = min; i < max; i++) {
		result.push( String.fromCharCode(i) );
	}
	return result;
}

function genKey(sets) {
	const letters = {
		syms:	genSeq([35, 38, 40, 47, 58, 64]),
		ups:	genSeq(65, 90),
		lows:	genSeq(97, 122),
		nums:	genSeq(48, 57)
	};
	
	sets = Object.assign({ }, sets);
	let result = "", pieceLen = 0; 
	
	while (result.length < sets.len) {
		for (let i in letters) {
			if ( !letters.hasOwnProperty(i) ) continue;
			
			sets[i] = Object.assign({ }, sets[i]);
			pieceLen = rnd(sets[i].min, sets[i].max);
			if (result.length + pieceLen > sets.len) pieceLen -= result.length + pieceLen - sets.len;
				
			result += getRndEls( letters[i], pieceLen).join("");		
		}
	}
	
	return shakeText(result);
	
}

function shakeText(text) {
	text = text.split("");
	let result = "";
	while (text.length) {
		result += text.splice( rnd(0, text.length - 1), 1 )[0];
	}
	return result;
}

function rnd(min, max) {
    return +( Math.random( ) * (max - min) + min ).toFixed(0);
}

function getRndEls(arr, len) {
	let result = [ ];
	while (result.length < len) {
		result.push( getRndEl(arr) );
	}
	return result;
}

function getRndEl(arr) {
	return arr[ rnd(0, arr.length - 1) ];
}
