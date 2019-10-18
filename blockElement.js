/*jshint es5: true, esnext: true, loopfunc: true, browser: true, devel: true*/
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

async function promptData(html, okFn, cancelFn) {
	const 
		container = document.createElement("div"),
		msg = document.createElement("div")
	;
	container.style.display = "flex";
	
}

function director(el) {
	const 
		key = genKey(keySettings),
		message = `
		<div  id = "dialog">
			<H2>Отказ от предоставления e-mail</H2>
			На свой E-mail клиент сможет получать напоминания о платежах или запрошенные документы.</div>
			<div>Если у клиента есть почтовый адрес, нажмите «Отмена» и введите почту клиента</div>
			<div>Иначе введите код отказа, указанный ниже и нажмите „Ok” В коде различаются строчные и прописные буквы, будьте внимательны.</div>
			<strong>${key}</strong>
			<input type = "text" id = "noEmailCode">
		</div>`
	;
}

