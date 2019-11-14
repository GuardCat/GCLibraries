/*jshint esversion: 5, esnext: true, loopfunc: true, browser: true, devel: true*/
const
	keySettings = {
		ups:		{min: 2, max: 5},
		lows:		{min: 2, max: 4},
		nums:		{min: 1, max: 2},
		syms:		{min: 1, max: 2},
		len:		10
	}
;

function genSeq(min, max) {
	if (min instanceof Array) return min.reduce( (res, el, i, arr) => {
		if ( !(i && i % 2) ) res.push( genSeq(el, arr[i + 1]) );
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
	let result = "", pieceLen = 0;

	while (result.length < sets.len) {
		for (let i in letters) {
			if ( !letters.hasOwnProperty(i) ) continue;
			pieceLen = rnd(sets[i].min, sets[i].max);
			if (result.length + pieceLen > sets.len) pieceLen -= result.length + pieceLen - sets.len;

			result += getRndEls(letters[i], pieceLen).join("");
		}
	}

	return shakeText(result);
}

function shakeText(text) {
	text = text.split("");
	for (let i = 0; i < 20; i++) text.sort( ( ) => rnd(-1, 1) );
	return text.join("");
}

function rnd(min, max) {
    return +( Math.random( ) * (max - min) + min ).toFixed(0);
}

function getRndEl(arr) {
	return arr[ rnd(0, arr.length - 1) ];
}

function getRndEls(arr, len) {
	let result = [ ];
	while (result.length < len) {
		result.push( getRndEl(arr) );
	}
	return result;
}


function director(el) {
	const
		key = genKey(keySettings),
		message = `
		<div  id = "dialog">
			<H2>ÐÑÐºÐ°Ð· Ð¾Ñ Ð¿ÑÐµÐ´Ð¾ÑÑÐ°Ð²Ð»ÐµÐ½Ð¸Ñ e-mail</H2>
			ÐÐ° ÑÐ²Ð¾Ð¹ E-mail ÐºÐ»Ð¸ÐµÐ½Ñ ÑÐ¼Ð¾Ð¶ÐµÑ Ð¿Ð¾Ð»ÑÑÐ°ÑÑ Ð½Ð°Ð¿Ð¾Ð¼Ð¸Ð½Ð°Ð½Ð¸Ñ Ð¾ Ð¿Ð»Ð°ÑÐµÐ¶Ð°Ñ Ð¸Ð»Ð¸ Ð·Ð°Ð¿ÑÐ¾ÑÐµÐ½Ð½ÑÐµ Ð´Ð¾ÐºÑÐ¼ÐµÐ½ÑÑ.</div>
			<div>ÐÑÐ»Ð¸ Ñ ÐºÐ»Ð¸ÐµÐ½ÑÐ° ÐµÑÑÑ Ð¿Ð¾ÑÑÐ¾Ð²ÑÐ¹ Ð°Ð´ÑÐµÑ, Ð½Ð°Ð¶Ð¼Ð¸ÑÐµ Â«ÐÑÐ¼ÐµÐ½Ð°Â» Ð¸ Ð²Ð²ÐµÐ´Ð¸ÑÐµ Ð¿Ð¾ÑÑÑ ÐºÐ»Ð¸ÐµÐ½ÑÐ°</div>
			<div>ÐÐ½Ð°ÑÐµ Ð²Ð²ÐµÐ´Ð¸ÑÐµ ÐºÐ¾Ð´ Ð¾ÑÐºÐ°Ð·Ð°, ÑÐºÐ°Ð·Ð°Ð½Ð½ÑÐ¹ Ð½Ð¸Ð¶Ðµ Ð¸ Ð½Ð°Ð¶Ð¼Ð¸ÑÐµ âOkâ Ð ÐºÐ¾Ð´Ðµ ÑÐ°Ð·Ð»Ð¸ÑÐ°ÑÑÑÑ ÑÑÑÐ¾ÑÐ½ÑÐµ Ð¸ Ð¿ÑÐ¾Ð¿Ð¸ÑÐ½ÑÐµ Ð±ÑÐºÐ²Ñ, Ð±ÑÐ´ÑÑÐµ Ð²Ð½Ð¸Ð¼Ð°ÑÐµÐ»ÑÐ½Ñ.</div>
			<strong>${key}</strong>
			<input type = "text" id = "noEmailCode">
		</div>`
	;
}
