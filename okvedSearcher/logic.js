/*jshint esversion: 9, browser: true*/

async function director( ) {
	const
		okveds = await getJson("okved.json"),
		areas =  await getJson("area.json"),
		main = document.body.querySelector("main"),
		keys = ["code", "name", "desc"],
		input = document.querySelector("input[name='mainField']"),
		bindedSearch = doSearch.bind(null, input, okveds, areas, keys, main),
		searchWhenChanged = ( ) => timeId = setTimeout(bindedSearch, 1000)
		//,testArr = grepMissedCodes(okveds, areas)
		//,testArr = grep(okveds, ["name"], ["изготов"])
	;
	let timeId;

	input.addEventListener("keyup", searchWhenChanged, false);
	input.addEventListener( "keydown", ( ) => clearTimeout(timeId) );
	//addRow(testArr, areas, main, false);
	//console.log(testArr.length);
}

function doSearch(input, okveds, areas, keys, main) {
	const
		text = input.value,
		words = textToArray(text).filter( word => word.length > 1)
	;
	main.innerHTML = "<p>Поиск...</p>";
	setTimeout( ( ) => {
		let found = grep(okveds, keys, words);
		main.innerHTML = "";
		addRow(found, areas, main);
	}, 10);
}

async function getJson(url) {

	return new Promise( async (resolve, reject) => {
		let responce = await fetch(url);
		if (!responce.ok) throw new Error(`getJson: Can't recieve the file "${url}". Server response status: ${responce.status}: ${responce.statusText}`);
		resolve( await responce.json( ) );
	} );
}

function addRow(okvedEntry, areas, block, descFlag) {
	if (okvedEntry instanceof Array) return okvedEntry.map( entry => addRow(entry, areas, block) );

	let areaEntry = areas.filter(el => el.code === okvedEntry.code)[0];
	if (!areaEntry) return false; //areaEntry = {area: "Нет данных"};
	block.insertAdjacentHTML( "beforeend", createO(okvedEntry) );
	block.insertAdjacentHTML( "beforeend", createA(areaEntry) );
}

function createA(entry) {			
	return `<p>${entry.area}</p>`;
}

function createO(entry, descFlag = true) {
	const
		message = `<p><strong>${entry.code} ${entry.name}</strong>`,
		closer = `</p>`,
		desc =	`${entry.desc}`.replace(/\^/gi,"<br>")
	;
	return message + (descFlag ? desc + closer : closer);
}

function grep(arr, keys, words) {
	if (!words.length) return [{code:"", name: "введите больше слов", desc: ""}];
	const result = words.reduce(
		(res, word) => {
			return res.filter( el => {
				let r = new RegExp(word, "gi");
				return keys.some( (key) => r.test(el[key]) );
			} );
		}, arr)
		.sort( (a, b) => {
			const phrase = new RegExp( words.join(" "), "gi");
			let result = 0;
			if ( phrase.test(a.name) ) return -1;
			if ( keys.some( key => phrase.test(a[key]) ) ) return -1;
			if ( words.some( (word) => a.name.search(word) !== -1 ) ) return -1;
			return 0;
	} );

	if (!result.length) return [{code:"", name: "Ничего не найдено. Попробуйте сформулировать иначе.", desc: ""}];
	return result;
}

function grepMissedCodes(okveds, areas) {
	return okveds.filter( okved => !areas.some( area => area.code === okved.code ) );
}

function textToArray(text) {
	const
		badSymbols = /[^А-ЯЁ0-9\. ]/gi,
		spaces = / +/g
	;
	return text.replace(badSymbols, "").split(spaces).filter( text => !!text );
}

window.addEventListener("load", director, false);
